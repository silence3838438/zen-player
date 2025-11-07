# Vue 3 项目集成示例

## 1. 安装插件

```bash
npm install zen-player
# 或
yarn add zen-player
# 或
pnpm add zen-player
```

## 2. 全局注册（推荐）

在 `main.js` 或 `main.ts` 中：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import ImmersiveMediaPlayer from 'zen-player'

const app = createApp(App)

// 全局注册插件
app.use(ImmersiveMediaPlayer, {
  // 可选：自定义组件名称
  videoPlayerName: 'VideoPlayer',
  mediaGalleryName: 'MediaGallery'
})

app.mount('#app')
```

## 3. 按需引入

如果不想全局注册，可以在需要的组件中按需引入：

```vue
<template>
  <div>
    <ImmersiveVideoPlayer
      video-src="https://example.com/video.mp4"
      video-title="我的视频"
      poster="https://example.com/poster.jpg"
    />
  </div>
</template>

<script setup>
import { VideoPlayer as ImmersiveVideoPlayer } from 'zen-player'
</script>
```

## 4. 完整示例 - 单个视频播放器

```vue
<template>
  <div class="video-page">
    <ImmersiveVideoPlayer
      ref="playerRef"
      :video-src="videoData.src"
      :video-title="videoData.title"
      :poster="videoData.poster"
      :seek-step="15"
      :autoplay="false"
      :show-seek-buttons="true"
      @play="handlePlay"
      @pause="handlePause"
      @videoEnded="handleVideoEnded"
      @timeUpdate="handleTimeUpdate"
      @error="handleError"
    >
      <!-- 自定义播放图标 -->
      <template #play-icon>
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M8 5v14l11-7z"/>
        </svg>
      </template>
    </ImmersiveVideoPlayer>

    <div class="control-panel">
      <button @click="playVideo">播放</button>
      <button @click="pauseVideo">暂停</button>
      <button @click="reloadVideo">重新加载</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { VideoPlayer as ImmersiveVideoPlayer } from 'zen-player'

const playerRef = ref(null)

const videoData = reactive({
  src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  title: '大兔子邦尼 - 经典动画短片',
  poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
})

// 控制方法
const playVideo = () => {
  playerRef.value?.play()
}

const pauseVideo = () => {
  playerRef.value?.pause()
}

const reloadVideo = () => {
  playerRef.value?.load()
}

// 事件处理
const handlePlay = () => {
  console.log('视频开始播放')
}

const handlePause = () => {
  console.log('视频暂停')
}

const handleVideoEnded = () => {
  console.log('视频播放结束')
}

const handleTimeUpdate = (currentTime) => {
  console.log('当前播放时间:', currentTime)
}

const handleError = (error) => {
  console.error('视频加载错误:', error)
}
</script>

<style scoped>
.video-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.control-panel {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.control-panel button {
  padding: 0.5rem 1rem;
  background: #6EBA44;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.control-panel button:hover {
  background: #5aa535;
  transform: translateY(-2px);
}
</style>
```

## 5. 完整示例 - 分类视频画廊

```vue
<template>
  <div class="gallery-page">
    <ImmersiveMediaGallery
      :categories="categories"
      :videos="videos"
      header-title="精彩视频合集"
      header-subtitle="Wonderful Video Collection"
      :items-per-page="9"
      :default-category-index="0"
      :show-header="true"
      :show-divider="true"
      divider-text="更多相关视频"
      @category-change="handleCategoryChange"
      @video-select="handleVideoSelect"
      @page-change="handlePageChange"
    >
      <!-- 自定义播放器 -->
      <template #player="{ currentVideo }">
        <ImmersiveVideoPlayer
          v-if="selectedVideo"
          ref="playerRef"
          :video-src="selectedVideo.src"
          :video-title="selectedVideo.title"
          :poster="selectedVideo.cover"
          :seek-step="15"
          @videoEnded="handleVideoEnded"
        />
      </template>
    </ImmersiveMediaGallery>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  VideoPlayer as ImmersiveVideoPlayer,
  MediaGallery as ImmersiveMediaGallery
} from 'zen-player'

const playerRef = ref(null)

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '动画短片',
    nameEn: 'Animation',
    image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    description: '精选世界顶级的开源动画短片作品集'
  },
  {
    id: 2,
    name: '纪录片',
    nameEn: 'Documentary',
    image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    description: '探索世界的精彩纪录片'
  },
  {
    id: 3,
    name: '科技',
    nameEn: 'Technology',
    image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    description: '科技相关的精彩视频'
  }
])

// 视频数据
const videos = ref([
  {
    id: 1,
    title: '大兔子邦尼 - 经典动画短片',
    titleEn: 'Big Buck Bunny',
    cover: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: '动画短片',
    categoryEn: 'Animation'
  },
  {
    id: 2,
    title: '大象之梦',
    titleEn: 'Elephants Dream',
    cover: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: '动画短片',
    categoryEn: 'Animation'
  },
  {
    id: 3,
    title: '辛特尔',
    titleEn: 'Sintel',
    cover: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    category: '动画短片',
    categoryEn: 'Animation'
  },
  {
    id: 4,
    title: '钢铁之泪',
    titleEn: 'Tears of Steel',
    cover: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    category: '科技',
    categoryEn: 'Technology'
  }
])

const selectedVideo = ref(videos.value[0])

// 事件处理
const handleCategoryChange = ({ index, category, videos }) => {
  console.log('切换到分类:', category.name)
  console.log('该分类下的视频数量:', videos.length)
  if (videos.length > 0) {
    selectedVideo.value = videos[0]
  }
}

const handleVideoSelect = (video) => {
  console.log('选择视频:', video.title)
  selectedVideo.value = video
  // 可选：自动播放选中的视频
  // playerRef.value?.play()
}

const handlePageChange = (page) => {
  console.log('切换到第', page + 1, '页')
}

const handleVideoEnded = () => {
  console.log('当前视频播放结束')
  // 可选：自动播放下一个视频
}
</script>

<style scoped>
.gallery-page {
  min-height: 100vh;
}
</style>
```

## 6. TypeScript 支持

```typescript
import { ref, reactive } from 'vue'
import {
  VideoPlayer as ImmersiveVideoPlayer,
  MediaGallery as ImmersiveMediaGallery
} from 'zen-player'
import type { Category, Video } from 'zen-player'

// 类型安全的数据定义
const categories = ref<Category[]>([
  {
    id: 1,
    name: '动画短片',
    nameEn: 'Animation',
    image: 'https://example.com/image.jpg',
    description: '精彩动画'
  }
])

const videos = ref<Video[]>([
  {
    id: 1,
    title: '视频标题',
    titleEn: 'Video Title',
    cover: 'https://example.com/cover.jpg',
    src: 'https://example.com/video.mp4',
    category: '动画短片',
    categoryEn: 'Animation'
  }
])
```

## 7. 样式自定义

```vue
<style>
/* 自定义进度条颜色 */
:deep(.imp-progress-fill) {
  background: #ff6b6b !important;
}

/* 自定义按钮悬停效果 */
:deep(.imp-control-btn:hover) {
  background-color: rgba(255, 107, 107, 0.2) !important;
}

/* 自定义分类卡片 */
:deep(.imp-category-item) {
  border-radius: 20px !important;
}
</style>
```

## 8. 常见问题

### Q: 视频无法播放？
A: 请检查视频源是否支持 CORS，或者视频格式是否被浏览器支持。

### Q: 如何实现自动播放下一个视频？
A: 在 `@videoEnded` 事件中，切换到下一个视频即可。

### Q: 如何自定义图标？
A: 使用具名插槽 `#play-icon`、`#pause-icon` 等来自定义图标。

### Q: 支持哪些视频格式？
A: 支持所有浏览器支持的 HTML5 视频格式（MP4、WebM、Ogg 等）。

## 9. 更多示例

查看完整示例代码：
- GitHub: https://github.com/yourusername/zen-player/tree/main/examples
- 在线演示: https://yourusername.github.io/zen-player/

## 10. 技术支持

- 文档: https://github.com/yourusername/zen-player
- Issues: https://github.com/yourusername/zen-player/issues
- QQ群: 123456789


