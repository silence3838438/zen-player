<template>
  <div class="imp-science-container">
    <!-- 渐变背景层 -->
    <div class="imp-background-gradient"></div>
    
    <!-- 标题区域 -->
    <div class="imp-science-bg">
      <div class="imp-science-text" v-if="showHeader">
        <h1 class="imp-science-title" v-html="headerTitle"></h1>
        <p class="imp-science-subtitle" v-html="headerSubtitle"></p>
      </div>
    </div>

    <!-- 分类选择区域 -->
    <div class="imp-science-pictures animate-on-scroll" v-if="categories && categories.length">
      <div
        v-for="(category, index) in categories"
        :key="category.id"
        class="imp-science-picture-item"
        :class="{
          'selected': selectedCategoryIndex === index,
          'unselected': selectedCategoryIndex !== index
        }"
      >
        <div class="imp-science-picture-wrapper" @click="selectCategory(index)">
          <img
            :src="category.image"
            :alt="category.name"
            class="imp-science-picture"
          />
          <div class="imp-category-title-overlay">
            <div class="imp-category-title-chinese">{{ category.name }}</div>
            <div class="imp-category-title-english">{{ category.nameEn }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放器插槽 -->
    <slot name="player" :currentVideo="currentVideo">
      <!-- 默认播放器 -->
    </slot>

    <!-- 分类描述 -->
    <div class="imp-video-description" v-if="currentCategoryDescription">
      <p class="imp-description-text animate-on-scroll" v-html="currentCategoryDescription"></p>
    </div>

    <!-- 分隔线 -->
    <div class="imp-divider-line animate-on-scroll" v-if="showDivider">
      <div class="imp-more-videos-btn">
        <span class="imp-more-videos-text">{{ dividerText }}</span>
      </div>
    </div>

    <!-- 视频网格 -->
    <div class="imp-video-grid animate-on-scroll" v-if="filteredVideos && filteredVideos.length">
      <div
        v-for="video in paginatedVideos"
        :key="video.id"
        class="imp-video-item"
        @click="selectVideo(video)"
      >
        <div class="imp-video-cover">
          <img :src="video.cover" :alt="video.title" class="imp-cover-image" />
          <!-- 播放按钮叠加层 -->
          <div class="imp-play-overlay">
            <img :src="playIconUrl" alt="播放" class="imp-play-button-icon" />
          </div>
        </div>
        <div class="imp-video-title-item">{{ video.title }}</div>
      </div>
    </div>

    <!-- 分页控制 -->
    <div class="imp-video-index-indicator" v-if="totalPages > 0">
      <div class="imp-page-btn imp-prev-btn" :class="{ 'disabled': currentPage === 0 }" @click="prevPage">
        <span class="imp-page-btn-icon">‹</span>
        <span class="imp-page-btn-text">上一页</span>
      </div>
      <div class="imp-index-items">
        <div
          v-for="pageNum in totalPages"
          :key="`page-${pageNum}`"
          class="imp-index-item"
          :class="{ 'active': currentPage === pageNum - 1 }"
          @click="selectPage(pageNum - 1)"
        >
          {{ String(pageNum).padStart(2, '0') }}
        </div>
      </div>
      <div class="imp-page-btn imp-next-btn" :class="{ 'disabled': currentPage >= totalPages - 1 }" @click="nextPage">
        <span class="imp-page-btn-text">下一页</span>
        <span class="imp-page-btn-icon">›</span>
      </div>
    </div>

    <!-- 二维码显示区域 -->
    <div v-if="showQRCode && qrCodeImage" class="imp-qr-code-section">
      <div class="imp-qr-code-container">
        <div class="imp-qr-code-wrapper">
          <div class="imp-qr-code-image-container">
            <img :src="qrCodeImage" alt="二维码" class="imp-qr-code-image" @longpress="saveQRCode" @contextmenu.prevent="saveQRCode" />
          </div>
          <div class="imp-qr-code-tip">
            <div class="imp-qr-code-tip-text">
              <div class="imp-qr-code-tip-line1">{{ qrCodeTipLine1 }}</div>
              <div class="imp-qr-code-tip-line2">{{ qrCodeTipLine2 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'ImmersiveMediaGallery',
  props: {
    categories: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(cat =>
          cat.hasOwnProperty('id') &&
          cat.hasOwnProperty('name') &&
          cat.hasOwnProperty('image')
        )
      }
    },
    videos: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(video =>
          video.hasOwnProperty('id') &&
          video.hasOwnProperty('title') &&
          video.hasOwnProperty('src') &&
          video.hasOwnProperty('category')
        )
      }
    },
    headerTitle: {
      type: String,
      default: '分类视频'
    },
    headerSubtitle: {
      type: String,
      default: 'CATEGORY VIDEOS'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    dividerText: {
      type: String,
      default: '更多相关视频'
    },
    showDivider: {
      type: Boolean,
      default: true
    },
    itemsPerPage: {
      type: Number,
      default: 9
    },
    defaultCategoryIndex: {
      type: Number,
      default: 0
    },
    playIcon: {
      type: String,
      default: 'https://cdn.jsdelivr.net/gh/wangfupeng1988/wangEditor@4.7.0/examples/img/play-button.png'
    },
    videoPlayerSelector: {
      type: String,
      default: '#video-player-section'
    },
    autoPlayOnSelect: {
      type: Boolean,
      default: true
    },
    showQRCode: {
      type: Boolean,
      default: false
    },
    qrCodeImage: {
      type: String,
      default: ''
    },
    qrCodeTipLine1: {
      type: String,
      default: '扫一扫'
    },
    qrCodeTipLine2: {
      type: String,
      default: '观看更多分类视频'
    }
  },
  emits: ['category-change', 'video-select', 'page-change'],
  setup(props, { emit }) {
    // 播放按钮图片 URL
    const playIconUrl = computed(() => props.playIcon)
    const selectedCategoryIndex = ref(props.defaultCategoryIndex)
    const currentPage = ref(0)

    const currentCategory = computed(() => {
      return props.categories[selectedCategoryIndex.value] || null
    })

    const currentCategoryDescription = computed(() => {
      return currentCategory.value?.description || ''
    })

    const filteredVideos = computed(() => {
      if (!currentCategory.value) return []
      return props.videos.filter(
        video => video.category === currentCategory.value.name
      )
    })

    const paginatedVideos = computed(() => {
      const start = currentPage.value * props.itemsPerPage
      const end = start + props.itemsPerPage
      return filteredVideos.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredVideos.value.length / props.itemsPerPage)
    })

    const currentVideo = computed(() => {
      return filteredVideos.value[0] || null
    })

    const selectCategory = (index) => {
      if (index === selectedCategoryIndex.value) return
      
      selectedCategoryIndex.value = index
      currentPage.value = 0
      
      const category = props.categories[index]
      emit('category-change', {
        index,
        category,
        videos: filteredVideos.value
      })
    }

    const selectVideo = (video) => {
      emit('video-select', video, props.autoPlayOnSelect)
      
      // 滚动到视频播放区域
      setTimeout(() => {
        const videoPlayerElement = document.querySelector(props.videoPlayerSelector)
        if (videoPlayerElement) {
          videoPlayerElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 200) // 延迟200ms确保视频切换完成
    }

    const prevPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--
        emit('page-change', currentPage.value)
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value - 1) {
        currentPage.value++
        emit('page-change', currentPage.value)
      }
    }

    const selectPage = (page) => {
      currentPage.value = page
      emit('page-change', currentPage.value)
    }

    // 保存二维码
    const saveQRCode = () => {
      if (!props.qrCodeImage) return
      
      // 创建临时链接下载
      const link = document.createElement('a')
      link.href = props.qrCodeImage
      link.download = `二维码_${currentCategory.value?.name || '视频'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    watch(() => selectedCategoryIndex.value, () => {
      currentPage.value = 0
    })

    // 滚动动画
    onMounted(() => {
      const animateElements = document.querySelectorAll('.animate-on-scroll')
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, { threshold: 0.1 })

      animateElements.forEach(el => observer.observe(el))
    })

    return {
      selectedCategoryIndex,
      currentPage,
      currentCategory,
      currentCategoryDescription,
      filteredVideos,
      paginatedVideos,
      totalPages,
      currentVideo,
      playIconUrl,
      selectCategory,
      selectVideo,
      prevPage,
      nextPage,
      selectPage,
      saveQRCode
    }
  }
})
</script>

<style lang="scss" scoped>
:root {
  --primary-color: #6EBA44;
  --primary-hover: #5a9a3a;
  --text-dark: #333;
  --text-gray: #666;
  --text-light: #999;
}

.imp-science-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f8ec 0%, #fefefe 30%, #f5f9f7 100%);
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  padding: 0;
  position: relative;

  * {
    box-sizing: border-box;
  }
}

.imp-background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at top, rgba(110, 186, 68, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at bottom, rgba(110, 186, 68, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.imp-science-bg {
  height: 14vh;
  min-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  z-index: 1;
}

.imp-science-text {
  text-align: center;
  position: absolute;
  top: 35px;
  z-index: 2;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.imp-science-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 5px 0;
  font-family: 'Arial Black', Arial, sans-serif;
}

.imp-science-subtitle {
  font-size: clamp(0.75rem, 2vw, 1rem);
  color: var(--text-light);
  margin: 0;
  letter-spacing: 3px;
  font-weight: 300;
  opacity: 0.8;
}

.imp-science-pictures {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  margin: 0.5rem auto;
  padding: 0 1rem;
  flex-shrink: 0;
  width: calc(100% - 2rem);
  max-width: 100%;
  box-sizing: border-box;
  z-index: 1;
  position: relative;
}

.imp-science-picture-item {
  height: 70px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  transform-origin: center;

  &.selected {
    transform: scale(1.05);
    z-index: 10;
    
    .imp-science-picture-wrapper {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 8px 24px rgba(110, 186, 68, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .imp-category-title-overlay {
      opacity: 1;
    }
    
    .imp-science-picture {
      filter: brightness(1.05);
    }
  }

  &.unselected {
    .imp-science-picture-wrapper {
      opacity: 0.6;
    }
  }
}

.imp-science-picture-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(200, 200, 200, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:active {
    transform: scale(0.98);
  }
  
  &:hover {
    border-color: rgba(110, 186, 68, 0.5);
  }
}

.imp-science-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  filter: brightness(0.95);
  border-radius: 12px;
}

.imp-category-title-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.8rem;
  background: transparent;
  text-align: center;
  z-index: 2;
  pointer-events: none;
  transition: all 0.3s ease;
}

.imp-category-title-chinese {
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.1rem;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.imp-category-title-english {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.65rem;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.imp-video-description {
  margin: 0.3rem auto 1rem auto;
  padding: 1rem 1.5rem;
  max-width: 100%;
  width: calc(100% - 2rem);
  text-align: justify;
  flex-shrink: 0;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  z-index: 1;
  position: relative;
}

.imp-description-text {
  font-size: 0.85rem;
  line-height: 1.9;
  color: #555;
  margin: 0;
  text-align: justify;
  text-indent: 2em;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  letter-spacing: 0.5px;
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.imp-divider-line {
  height: 1px;
  background-color: #CFCFCF;
  margin: 2rem auto 0;
  max-width: 1000px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  z-index: 1;
}

.imp-more-videos-btn {
  background-color: #72B84A;
  border-radius: 0.6rem;
  padding: 0.3rem 0.9rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5a9a3a;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.imp-more-videos-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.imp-video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
  margin: 1.5rem auto 1rem auto;
  padding: 0 1rem;
  width: calc(100% - 2rem);
  max-width: 100%;
  box-sizing: border-box;
  z-index: 1;
  position: relative;
}

.imp-video-item {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.4rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 24px rgba(110, 186, 68, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(110, 186, 68, 0.2);
  }

  &:active {
    transform: translateY(-3px);
  }
}

.imp-video-cover {
  position: relative;
  width: 100%;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.imp-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.4s ease;
}

.imp-video-item:hover .imp-cover-image {
  transform: scale(1.05);
}

.imp-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

/* PC端悬停时显示 */
.imp-video-item:hover .imp-play-overlay {
  opacity: 1;
}

.imp-play-button-icon {
  width: 40px;
  height: 40px;
  opacity: 0.9;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.imp-video-item:hover .imp-play-button-icon {
  opacity: 1;
  transform: scale(1.1);
}

/* 移动端播放按钮更小 */
@media (max-width: 768px) {
  .imp-play-button-icon {
    width: 25px !important;
    height: 25px !important;
  }
}

.imp-video-title-item {
  font-size: 0.7rem;
  color: #666;
  text-align: center;
  line-height: 1.5;
  font-weight: 500;
  padding: 0 0.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.imp-video-index-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5rem 0;
  gap: 2rem;
}

.imp-page-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #6EBA44;
  border-radius: 0.3rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  user-select: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border: none;

  .imp-page-btn-icon {
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1;
  }

  .imp-page-btn-text {
    @media (max-width: 480px) {
      display: none;
    }
  }

  &:hover:not(.disabled) {
    color: #5a9a3a;
    transform: scale(1.05);
  }

  &:active:not(.disabled) {
    transform: scale(0.98);
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: #999;
  }
}

.imp-index-items {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.imp-index-item {
  width: 26px;
  height: 26px;
  background-color: #6EBA44;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(110, 186, 68, 0.4);
  }

  &:active {
    transform: scale(1.15) !important;
  }

  &.active {
    transform: scale(1.2);
    box-shadow: 0 3px 10px rgba(110, 186, 68, 0.5);
    animation: pulse 0.5s ease;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.25);
  }
}

// 平板端适配
@media (min-width: 768px) {
  .imp-science-bg {
    height: 12vh;
    min-height: 120px;
  }

  .imp-science-text {
    top: 50px;
  }

  .imp-science-pictures {
    gap: 0.8rem;
    margin: 1rem auto;
    padding: 0 2rem;
    width: calc(100% - 4rem);
  }

  .imp-science-picture-item {
    height: 6rem;

    &.selected {
      height: 9rem;
    }

    &.unselected {
      height: 9rem;
    }
  }

  .imp-video-description {
    margin: 2rem auto;
    padding: 1rem 2rem;
    width: calc(100% - 4rem);
  }

  .imp-description-text {
    font-size: 0.9rem;
    line-height: 1.4rem;
  }

  .imp-video-grid {
    gap: 0.6rem;
    margin: 2rem auto;
    padding: 0 2rem;
    width: calc(100% - 4rem);
  }

  .imp-video-cover {
    height: 10rem;
  }

  .imp-video-title-item {
    font-size: 0.8rem;
  }
  
  .imp-video-item {
    padding: 0.8rem;
  }
}

// PC端适配
@media (min-width: 1200px) {
  .imp-science-bg {
    height: 15vh;
    min-height: 150px;
  }

  .imp-science-text {
    top: 60px;
  }

  .imp-science-pictures {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.2rem;
    margin: 2rem auto;
    padding: 0;
    max-width: 1200px;
    width: 95%;
  }

  .imp-science-picture-item {
    height: 140px;
    border-radius: 12px !important;
    border: none !important;
    overflow: hidden;

    &.selected {
      transform: scale(1.08);
      z-index: 10;
      
      .imp-science-picture-wrapper {
        background: transparent;
        border-radius: 12px !important;
        border: none !important;
        box-shadow: 0 12px 32px rgba(110, 186, 68, 0.35), 0 6px 16px rgba(0, 0, 0, 0.15);
      }
      
      .imp-science-picture {
        filter: brightness(1.08);
      }
    }

    &.unselected {
      .imp-science-picture-wrapper {
        opacity: 0.7;
        border-radius: 12px !important;
        border: none !important;
      }
    }
  }

  .imp-science-picture-wrapper {
    background: transparent;
    border-radius: 12px !important;
    backdrop-filter: none;
    border: none !important;
    
    &:hover {
      border: none !important;
      border-radius: 12px !important;
    }
  }

  .imp-science-picture {
    border-radius: 12px !important;
    border: none !important;
  }

  .imp-video-description {
    margin: 2.5rem auto;
    max-width: 1200px;
    width: 95%;
    padding: 2rem 3rem;
  }

  .imp-description-text {
    font-size: 1rem;
    line-height: 2.2;
  }

  .imp-video-grid {
    margin: 2.5rem auto 0;
    max-width: 1200px;
    width: 95%;
    gap: 1rem;
    padding: 0;
  }

  .imp-video-cover {
    height: 10rem;
  }

  .imp-video-title-item {
    font-size: 0.95rem;
  }

  .imp-video-item {
    padding: 0.8rem;
    border-radius: 14px;
  }

  .imp-index-item {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
}

// 超大屏幕适配
@media (min-width: 1600px) {
  .imp-science-bg {
    height: 18vh;
    min-height: 180px;
  }

  .imp-science-text {
    top: 80px;
  }

  .imp-science-pictures {
    gap: 1.5rem;
    max-width: 1400px;
    width: 90%;
  }

  .imp-science-picture-item {
    height: 160px;
    
    &.selected {
      transform: scale(1.1);
      
      .imp-science-picture-wrapper {
        box-shadow: 0 16px 40px rgba(110, 186, 68, 0.4), 0 8px 20px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .imp-video-description {
    max-width: 1400px;
    width: 90%;
    padding: 2.5rem 4rem;
  }

  .imp-description-text {
    font-size: 1.05rem;
    line-height: 2.4;
  }

  .imp-video-grid {
    max-width: 1400px;
    width: 90%;
    gap: 1.2rem;
  }

  .imp-video-cover {
    height: 11rem;
  }

  .imp-video-item {
    padding: 1rem;
    border-radius: 16px;
  }

  .imp-index-item {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}

/* 二维码区域样式 */
.imp-qr-code-section {
  margin: 2rem 0.5rem 3rem 0.5rem;
  display: flex;
  justify-content: center;
  z-index: 1;
  position: relative;
}

.imp-qr-code-container {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(110, 186, 68, 0.15), 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 2px solid rgba(110, 186, 68, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(110, 186, 68, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #6EBA44;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(110, 186, 68, 0.08), transparent);
    animation: shimmer 4s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.imp-qr-code-wrapper {
  background: white;
  border-radius: 10px;
  padding: 0.8rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
  display: inline-block;
}

.imp-qr-code-image-container {
  position: relative;
  display: inline-block;
}

.imp-qr-code-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
}

.imp-qr-code-tip {
  margin-top: 0.4rem;
  text-align: center;
}

.imp-qr-code-tip-text {
  text-align: center;
  line-height: 1.2;
}

.imp-qr-code-tip-line1 {
  font-size: 0.8rem;
  color: #6EBA44;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-bottom: 0.25rem;
}

.imp-qr-code-tip-line2 {
  font-size: 0.7rem;
  color: #6f6f6f;
  font-weight: 400;
  letter-spacing: 0.2px;
}

// 平板端二维码适配
@media (min-width: 768px) {
  .imp-qr-code-section {
    margin: 2rem auto 3rem auto;
  }

  .imp-qr-code-image {
    width: 120px;
    height: 120px;
  }

  .imp-qr-code-tip-line1 {
    font-size: 0.9rem;
  }

  .imp-qr-code-tip-line2 {
    font-size: 0.8rem;
  }
}

// PC端二维码适配
@media (min-width: 1200px) {
  .imp-qr-code-section {
    margin: 3rem auto 5rem auto;
    max-width: 1200px;
    width: 95%;
  }

  .imp-qr-code-container {
    border-radius: 20px;
    padding: 2rem;
    border: 2px solid rgba(110, 186, 68, 0.4);
  }

  .imp-qr-code-wrapper {
    border-radius: 14px;
    padding: 1.3rem;
  }

  .imp-qr-code-image {
    width: 130px;
    height: 130px;
    border-radius: 10px;
  }

  .imp-qr-code-tip {
    margin-top: 1.5rem;
  }

  .imp-qr-code-tip-line1 {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }

  .imp-qr-code-tip-line2 {
    font-size: 1.3rem;
  }
}

// 超大屏二维码适配
@media (min-width: 1920px) {
  .imp-qr-code-section {
    max-width: 1400px;
    width: 90%;
  }

  .imp-qr-code-container {
    border-radius: 20px;
    padding: 2rem;
  }

  .imp-qr-code-wrapper {
    border-radius: 15px;
    padding: 1.5rem;
  }

  .imp-qr-code-image {
    width: 140px;
    height: 140px;
  }

  .imp-qr-code-tip {
    margin-top: 1.8rem;
  }
}
</style>
