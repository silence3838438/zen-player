<template>
  <div class="video-player">
    <div class="video-container" :class="{ 'fullscreen': isFullscreen, 'audio-mode': currentMediaType === 'audio' }">
      <div class="video-header">
        <h3 class="video-title">{{ videoTitle }}</h3>
        <!-- 视频模式才显示大小屏按钮 -->
        <div v-if="currentMediaType === 'video'" class="video-controls-top">
          <button @click="toggleSmallScreen" class="screen-btn">
            <img :src="smallScreen" alt="小屏" class="screen-icon" />
          </button>
          <button @click="toggleFullScreen" class="screen-btn">
            <img :src="fullScreen" alt="全屏" class="screen-icon" />
          </button>
        </div>
      </div>
      <div class="video-content" @click="togglePlay">
        <video 
          ref="videoPlayer"
          :src="videoSrc"
          @timeupdate="updateProgress"
          @loadedmetadata="updateDuration"
          @ended="onVideoEnded"
          @error="onVideoError"
          @canplay="onVideoCanPlay"
          :poster="poster"
          class="video-element"
          preload="metadata"
          playsinline
          webkit-playsinline
          x-webkit-airplay="allow"
          x5-video-player-type="h5"
          x5-video-orientation="portraint"
        ></video>
        <!-- 视频模式：显示播放按钮 -->
        <div v-if="currentMediaType === 'video'" class="video-overlay" :class="{ 'playing': isPlaying }">
          <div class="play-button">
            <img :src="isPlaying ? pauseIcon : playIcon" alt="播放/暂停" class="play-icon" />
          </div>
        </div>
        <!-- 音频模式：显示音频图标 -->
        <div v-if="currentMediaType === 'audio'" class="audio-indicator" :class="{ 'playing': isPlaying }">
          <svg class="audio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
      </div>
      <div class="video-controls-bottom">
        <button @click.stop="seekBackward" class="control-btn">
          <img :src="backIcon" alt="后退" class="control-icon" />
        </button>
        <button @click.stop="togglePlay" class="control-btn play-pause">
          <img :src="isPlaying ? pauseIcon : playIcon" alt="播放/暂停" class="control-icon" />
        </button>
        <button @click.stop="seekForward" class="control-btn">
          <img :src="frontIcon" alt="前进" class="control-icon" />
        </button>
        <div class="progress-container">
          <div class="progress-bar" @click.stop="seekTo">
            <div class="progress-bg"></div>
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        <div class="time-display">
          <span style="font-size:0.4rem;" class="current-time">{{ formatTime(currentTime) }}</span>
          <span style="font-size: 0.4rem;" class="duration">{{ formatTime(duration) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Props
const props = defineProps({
  videoSrc: {
    type: String,
    required: true
  },
  videoTitle: {
    type: String,
    default: '视频标题'
  },
  poster: {
    type: String,
    default: ''
  },
  playIcon: {
    type: String,
    default: ''
  },
  backIcon: {
    type: String,
    default: ''
  },
  pauseIcon: {
    type: String,
    default: ''
  },
  frontIcon: {
    type: String,
    default: ''
  },
  smallScreenIcon: {
    type: String,
    default: ''
  },
  fullScreenIcon: {
    type: String,
    default: ''
  },
  mediaType: {
    type: String,
    default: 'auto', // 'auto', 'video', 'audio'
    validator: (value) => ['auto', 'video', 'audio'].includes(value)
  }
})

// 默认SVG图标 (Base64编码)
const defaultPlayIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTggNXYxNGwxMS03eiIvPjwvc3ZnPg=='
const defaultPauseIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTYgNGg0djE2SDZ6bTggMGg0djE2aC00eiIvPjwvc3ZnPg=='
const defaultBackIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTExLjk5IDVWMWwtNSA1IDUgNVY3YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTZoLTJjMCA0LjQyIDMuNTggOCA4IDhzOC0zLjU4IDgtOC0zLjU4LTgtOC04eiIvPjwvc3ZnPg=='
const defaultForwardIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDVWMWw1IDUtNSA1VjdjLTMuMzEgMC02IDIuNjktNiA2czIuNjkgNiA2IDYgNi0yLjY5IDYtNmgyYzAgNC40Mi0zLjU4IDgtOCA4cy04LTMuNTgtOC04IDMuNTgtOCA4LTh6Ii8+PC9zdmc+'
const defaultSmallScreenIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTUgMTZoM3YzaDJ2LTVINXYyem0zLThINXYyaDV2LTVIN3Y1em02IDExaDJ2LTNoM3YtMmgtNXY1em0yLTExVjVoLTJ2NWg1VjhoLTN6Ii8+PC9zdmc+'
const defaultFullScreenIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTcgMTRINXY1aDV2LTJIN3Yyem0tMi00aDJWN2gzVjVINXY1em0xMiA3aC0zdjJoNXYtNWgtMnYzek0xNCA1djJoM3YzaDJWNWgtNXoiLz48L3N2Zz4='

// 图片资源 URL（使用 props 传入的值，如果没有则使用默认图标）
const backIcon = props.backIcon || defaultBackIcon
const pauseIcon = props.pauseIcon || defaultPauseIcon
const playIcon = props.playIcon || defaultPlayIcon
const frontIcon = props.frontIcon || defaultForwardIcon
const smallScreen = props.smallScreenIcon || defaultSmallScreenIcon
const fullScreen = props.fullScreenIcon || defaultFullScreenIcon

// 媒体类型检测
const detectMediaType = (url) => {
  if (!url) return 'video'
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.wma', '.ape']
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.ogv', '.avi', '.mov', '.mkv', '.flv']
  
  const urlLower = url.toLowerCase()
  
  if (audioExtensions.some(ext => urlLower.includes(ext))) {
    return 'audio'
  }
  if (videoExtensions.some(ext => urlLower.includes(ext))) {
    return 'video'
  }
  
  return 'video' // 默认为视频
}

// 计算当前媒体类型 - 初始默认为视频模式
const currentMediaType = ref('video')
const detectedType = ref('video')

// 检测媒体类型但不立即应用
const updateDetectedType = (url) => {
  if (props.mediaType === 'auto') {
    detectedType.value = detectMediaType(url)
  } else {
    detectedType.value = props.mediaType
  }
}

// 初始检测
updateDetectedType(props.videoSrc)

// 监听 videoSrc 变化
watch(() => props.videoSrc, (newSrc) => {
  // 重置为视频模式，等待实际加载后再切换
  currentMediaType.value = 'video'
  updateDetectedType(newSrc)
})

// 监听 mediaType 变化
watch(() => props.mediaType, (newType) => {
  updateDetectedType(props.videoSrc)
})

// Emits
const emit = defineEmits(['videoEnded', 'play', 'pause', 'timeUpdate'])

// Refs
const videoPlayer = ref(null)
const isPlaying = ref(false)
const isFullscreen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progressPercentage = ref(0)

// 播放/暂停切换
const togglePlay = () => {
  if (videoPlayer.value) {
    if (isPlaying.value) {
      videoPlayer.value.pause()
      emit('pause')
      isPlaying.value = false
    } else {
      // iOS 兼容性：使用 Promise 处理 play() 
      const playPromise = videoPlayer.value.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('视频播放成功')
            isPlaying.value = true
            emit('play')
          })
          .catch((error) => {
            console.warn('视频播放失败:', error)
            isPlaying.value = false
          })
      } else {
        isPlaying.value = true
      emit('play')
      }
    }
  }
}

// 小屏切换
const toggleSmallScreen = () => {
  if (isFullscreen.value) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    isFullscreen.value = false
  }
}

// 全屏切换
const toggleFullScreen = () => {
  if (!isFullscreen.value) {
    // iOS 需要直接在 video 元素上调用 webkitEnterFullscreen
    if (videoPlayer.value && videoPlayer.value.webkitEnterFullscreen) {
      console.log('使用 iOS webkitEnterFullscreen')
      videoPlayer.value.webkitEnterFullscreen()
      isFullscreen.value = true
      return
    }
    
    // 其他浏览器使用容器全屏
    const container = document.querySelector('.video-container')
    if (container.requestFullscreen) {
      container.requestFullscreen()
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen()
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen()
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen()
    }
    isFullscreen.value = true
  } else {
    // iOS 退出全屏
    if (videoPlayer.value && videoPlayer.value.webkitExitFullscreen) {
      console.log('使用 iOS webkitExitFullscreen')
      videoPlayer.value.webkitExitFullscreen()
      isFullscreen.value = false
      return
    }
    
    // 其他浏览器退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    isFullscreen.value = false
  }
}

// 快进
const seekForward = () => {
  if (videoPlayer.value && duration.value > 0) {
    const oldTime = videoPlayer.value.currentTime
    const newTime = Math.min(duration.value, videoPlayer.value.currentTime + 15)
    videoPlayer.value.currentTime = newTime
    // 手动更新进度显示
    updateProgress()
    console.log(`快进: ${oldTime.toFixed(2)}s -> ${newTime.toFixed(2)}s (${progressPercentage.value.toFixed(1)}%)`)
  } else {
    console.warn('无法快进: videoPlayer:', !!videoPlayer.value, 'duration:', duration.value)
  }
}

// 快退
const seekBackward = () => {
  if (videoPlayer.value && duration.value > 0) {
    const oldTime = videoPlayer.value.currentTime
    const newTime = Math.max(0, videoPlayer.value.currentTime - 15)
    videoPlayer.value.currentTime = newTime
    // 手动更新进度显示
    updateProgress()
    console.log(`快退: ${oldTime.toFixed(2)}s -> ${newTime.toFixed(2)}s (${progressPercentage.value.toFixed(1)}%)`)
  } else {
    console.warn('无法快退: videoPlayer:', !!videoPlayer.value, 'duration:', duration.value)
  }
}

// 进度条点击
const seekTo = (event) => {
  if (videoPlayer.value && duration.value > 0) {
    const progressBar = event.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * duration.value
    videoPlayer.value.currentTime = newTime
    // 手动更新进度显示
    updateProgress()
    console.log(`跳转到: ${newTime.toFixed(2)}s (进度: ${progressPercentage.value.toFixed(1)}%)`)
  } else {
    console.warn('无法跳转: videoPlayer:', !!videoPlayer.value, 'duration:', duration.value, 'event:', event)
  }
}

// 更新进度
const updateProgress = () => {
  if (videoPlayer.value && duration.value > 0) {
    currentTime.value = videoPlayer.value.currentTime
    progressPercentage.value = (currentTime.value / duration.value) * 100
    emit('timeUpdate', currentTime.value)
  }
}

// 更新时长
const updateDuration = () => {
  if (videoPlayer.value) {
    duration.value = videoPlayer.value.duration
    console.log('视频时长已加载:', duration.value, 'videoSrc:', props.videoSrc)
    if (isNaN(duration.value) || duration.value === 0) {
      console.error('视频时长无效，请检查视频源')
    }
  }
}

// 视频结束
const onVideoEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  progressPercentage.value = 0
  emit('videoEnded')
}

// 视频加载错误
const onVideoError = (event) => {
  console.error('视频加载错误:', event)
  console.error('视频源:', props.videoSrc)
  if (videoPlayer.value && videoPlayer.value.error) {
    console.error('错误详情:', videoPlayer.value.error.message, '错误代码:', videoPlayer.value.error.code)
  }
}

// 视频可以播放
const onVideoCanPlay = () => {
  console.log('视频已准备好播放, duration:', videoPlayer.value?.duration)
  // 媒体加载完成后，应用检测到的媒体类型
  currentMediaType.value = detectedType.value
}

// 格式化时间显示
const formatTime = (time) => {
  if (isNaN(time)) return '00:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 全屏状态监听
const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  )
}

// iOS 进入全屏监听
const handleWebkitBeginFullscreen = () => {
  console.log('iOS 进入全屏')
  isFullscreen.value = true
}

// iOS 退出全屏监听
const handleWebkitEndFullscreen = () => {
  console.log('iOS 退出全屏')
  isFullscreen.value = false
}

// 监听视频源变化
watch(() => props.videoSrc, (newSrc) => {
  if (videoPlayer.value && newSrc) {
    videoPlayer.value.load()
  }
})

// 组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
  
  // iOS 全屏事件监听
  if (videoPlayer.value) {
    videoPlayer.value.addEventListener('webkitbeginfullscreen', handleWebkitBeginFullscreen)
    videoPlayer.value.addEventListener('webkitendfullscreen', handleWebkitEndFullscreen)
  }
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
  
  // 移除 iOS 全屏事件监听
  if (videoPlayer.value) {
    videoPlayer.value.removeEventListener('webkitbeginfullscreen', handleWebkitBeginFullscreen)
    videoPlayer.value.removeEventListener('webkitendfullscreen', handleWebkitEndFullscreen)
  }
})

// 暴露方法给父组件
defineExpose({
  play: () => {
    if (videoPlayer.value) {
      const playPromise = videoPlayer.value.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying.value = true
          })
          .catch((error) => {
            console.warn('暴露方法播放失败:', error)
            isPlaying.value = false
          })
      } else {
      isPlaying.value = true
      }
    }
  },
  pause: () => {
    if (videoPlayer.value) {
      videoPlayer.value.pause()
      isPlaying.value = false
    }
  },
  load: () => {
    if (videoPlayer.value) {
      videoPlayer.value.load()
    }
  }
})
</script>

<style lang="scss" scoped>
.video-player {
  margin: 1.5rem 2rem;
}

.video-container {
  background: transparent;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  margin-top: 0rem;
  margin: 0 1rem;
  padding-bottom: 1rem;
}

.video-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
  pointer-events: none; /* 确保不阻止控制按钮点击 */
  z-index: 1;
}

.video-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  border-radius: 0;
  margin-top: 0;
}

.video-container.fullscreen::after {
  height: 3rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.2));
  z-index: 5;
}

.video-container.fullscreen .video-content {
  height: calc(100vh - 140px);
  margin-top: 60px;
}

.video-container.fullscreen .video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #000;
}

.video-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
  padding: 1rem 1.5rem;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-title {
  color: white;
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
}

.video-controls-top {
  display: flex;
  gap: 0.5rem;
}

.screen-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.screen-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.screen-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.video-content {
  position: relative;
  width: 100%;
  height: 40rem;
  cursor: pointer;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #000;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  transition: background 0.3s ease;
  pointer-events: none; /* 让点击事件穿透，不阻止控制按钮点击 */
}

.video-overlay:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 视频播放中时，隐藏中间的按钮 */
.video-overlay.playing .play-button {
  opacity: 0;
  pointer-events: none;
}

/* 鼠标悬停时显示 */
.video-overlay.playing:hover .play-button {
  opacity: 0.8;
  pointer-events: auto;
}

.play-button {
  width: 80px;
  height: 80px;
  background: transparent;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.9;
  pointer-events: auto; /* 恢复点击事件，确保播放按钮可点击 */
}

.play-button:hover {
  opacity: 1;
  transform: scale(1.1);
}

.play-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.video-controls-bottom {
  position: absolute;
  bottom: 0rem;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
  padding: 1.5rem 1.2rem 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;

}

.control-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  z-index: 20; /* 确保按钮在最上层 */
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.control-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.control-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.progress-container {
  flex: 1;
  margin: 0 1rem;
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1.5px;
  cursor: pointer;
  position: relative;
  z-index: 12;
}

/* 使用伪元素增加点击区域，不影响视觉高度 */
.progress-bar::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  bottom: -10px;
  cursor: pointer;
}

/* hover 效果：进度条变粗 */
.progress-bar:hover {
  height: 4px;
}

.progress-bar:hover .progress-bg,
.progress-bar:hover .progress-fill {
  height: 4px;
}

.progress-bg {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: #16af4f;
  border-radius: 2px;
  transition: width 0.1s ease;
}

.time-display {
  color: white;
  align-items: center;
  position: absolute;
  left: 9.3rem;
  right: 9rem;
  width: 81%;
  top: 77%;
  transform: translateY(-50%);
  font-size: 0.6rem;
  display: flex;
  justify-content: space-between;
  z-index: 15;
  pointer-events: none; /* 让点击事件穿透，不阻止进度条点击 */
}

.current-time,
.duration {
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 音频模式专用样式 */
.audio-mode {
  .video-content {
    height: 300px !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .video-element {
    display: none; /* 隐藏video元素，只播放音频 */
  }
  
  /* 显示封面图作为背景 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    opacity: 0.3;
    z-index: 0;
  }
}

/* 音频指示器 */
.audio-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;
  transition: all 0.3s ease;
}

.audio-icon {
  width: 70px;
  height: 70px;
  color: rgba(255, 255, 255, 0.8);
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

/* 音频播放中 */
.audio-indicator.playing .audio-icon {
  color: rgba(255, 255, 255, 0.95);
  animation: audioPlaying 2s ease-in-out infinite;
}

@keyframes audioPlaying {
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

/* 移动端音频图标调整 */
@media (max-width: 768px) {
  .audio-icon {
    width: 50px;
    height: 50px;
  }
  
  .audio-mode .video-content {
    height: 200px !important;
  }
}

// 响应式设计
// PC端适配 (≥1200px)
@media (min-width: 1200px) {
  .video-player {
    margin: 2.5rem auto;
    max-width: 1200px;
    width: 95%;
    box-sizing: border-box;
  }

  .video-container {
    margin: 0;
    border-radius: 25px;
  }

  .video-content {
    height: 600px;
  }

  .video-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .video-player {
     margin: 0.8rem 1rem;
  }
  
  .video-container::after {
    height: 1.5rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.08));
  }

  .video-content {
    height: 250px;
  }

  .video-header {
    padding: 0.6rem 1.5rem;
  }

  .video-title {
    font-size: 0.8rem;
  }

  .video-controls-bottom {
    padding: 1rem 1rem 0.1rem 1rem;
    gap: 0.4rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }

  .progress-bar {
    height: 2px;
    border-radius: 1px;
  }

  .progress-container {
    margin: 0 3rem 0 0;
    margin-right: 3rem;
  }

  .time-display {
    position: absolute;
	left: 6.8rem;
    right: 8.5rem;
	width: 63%;
    top: 79%;
    transform: translateY(-50%);
    font-size: 0.25rem;
  }

  .screen-icon {
    width: 15px;
    height: 15px;
  }

  .control-icon {
    width: 20px;
    height: 20px;
  }

  .play-icon {
    width: 35px;
    height: 35px;
  }

  .control-btn {
    background: none !important;
    border-radius: 0;
  }

  .control-btn:hover {
    background-color: transparent !important;
  }

  .play-button {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .video-player {
    margin: 0.8rem 1rem;
  }
  
  .video-container::after {
    height: 1rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.06));
  }

  .video-content {
    height: 220px;
  }

  .video-header {
    padding: 0.8rem 1.2rem;
  }

  .video-title {
    font-size: 0.8rem;
  }

  .video-controls-bottom {
    padding: 0.8rem 0.8rem 0.6rem 0.8rem;
    gap: 0.3rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }

  .progress-bar {
    height: 2px;
    border-radius: 1px;
  }

  .progress-container {
    margin: 0 0.8rem;
    margin-right: 1.5rem;
  }

  .time-display {
    position: absolute;
	left: 6.8rem;
	right: 8.5rem;
	width: 63%;
	top: 79%;
	transform: translateY(-50%);
	font-size: 0.25rem;
  }

  .screen-icon {
    width: 12px;
    height: 12px;
  }

  .control-icon {
    width: 18px;
    height: 18px;
  }

  .play-icon {
    width: 30px;
    height: 30px;
  }

  .control-btn {
    background: none !important;
    border-radius: 0;
  }

  .control-btn:hover {
    background-color: transparent !important;
  }

  .play-button {
    width: 50px;
    height: 50px;
  }
}
</style>
