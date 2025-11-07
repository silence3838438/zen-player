# 沉浸式音视频播放器插件 (Zen Player)

[![Version](https://img.shields.io/npm/v/zen-player.svg)](https://www.npmjs.com/package/zen-player)
[![License](https://img.shields.io/npm/l/zen-player.svg)](https://github.com/yourusername/zen-player/blob/main/LICENSE)

一款功能强大、界面精美的沉浸式音视频播放器插件，支持 Vue 3 和原生 JavaScript/TypeScript 项目。

## ✨ 特性

### 免费基础功能
- ✅ **音视频播放器**，支持视频和音频文件播放
- ✅ **智能媒体类型检测**，自动识别音频/视频格式
- ✅ **音频专用UI**，为音频播放优化的界面
- ✅ 自定义播放器，支持播放/暂停、进度条拖拽
- ✅ 快进/快退控制（可自定义步长）
- ✅ 全屏播放支持（兼容 iOS/Android）
- ✅ 响应式设计，完美适配 PC/平板/手机
- ✅ 自定义封面和标题
- ✅ 媒体分类展示
- ✅ 分类画廊
- ✅ 分页功能
- ✅ 自定义图标插槽
- ✅ TypeScript 类型支持

### 🔥 高级功能（付费版）
- 🎯 视频清晰度切换（标清/高清/超清/4K）
- 📊 播放速度调节（0.5x - 2.0x）
- 🎨 自定义主题颜色
- 💾 播放历史记录
- 🔖 视频收藏功能
- 📺 画中画模式
- 🎵 音频可视化效果
- 📱 投屏功能（支持 AirPlay/DLNA）
- 🔐 视频加密播放
- 📈 播放数据统计分析
- 🎬 视频片段裁剪
- 🌐 多语言国际化支持
- 🎞️ 视频弹幕功能
- 📝 字幕文件支持（SRT/VTT）
- 🔄 断点续播功能

## 📦 安装

### NPM
```bash
npm install zen-player
```

### Yarn
```bash
yarn add zen-player
```

### PNPM
```bash
pnpm add zen-player
```

## 🚀 快速开始

### 全局注册（Vue 3）

```javascript
import { createApp } from 'vue'
import ImmersiveMediaPlayer from 'zen-player'
import App from './App.vue'

const app = createApp(App)
app.use(ImmersiveMediaPlayer)
app.mount('#app')
```

### 按需引入

#### 播放视频

```vue
<template>
  <div>
    <ImmersiveVideoPlayer
      video-src="https://example.com/video.mp4"
      video-title="我的视频"
      poster="https://example.com/poster.jpg"
      @play="onPlay"
      @pause="onPause"
    />
  </div>
</template>

<script setup>
import { VideoPlayer as ImmersiveVideoPlayer } from 'zen-player'

const onPlay = () => {
  console.log('视频开始播放')
}

const onPause = () => {
  console.log('视频已暂停')
}
</script>
```

#### 播放音频

```vue
<template>
  <div>
    <ImmersiveVideoPlayer
      video-src="https://example.com/audio.mp3"
      video-title="我的音乐"
      poster="https://example.com/album-cover.jpg"
      media-type="auto"
      @play="onPlay"
      @pause="onPause"
    />
  </div>
</template>

<script setup>
import { VideoPlayer as ImmersiveVideoPlayer } from 'zen-player'

const onPlay = () => {
  console.log('音频开始播放')
}

const onPause = () => {
  console.log('音频已暂停')
}
</script>
```

> **提示**: 插件会自动检测文件类型（通过扩展名），音频文件会使用专用的音频播放界面。支持的音频格式：mp3, wav, ogg, aac, m4a, flac 等。

### 原生 JavaScript/TypeScript

```javascript
import ImmersiveMediaPlayer from 'zen-player'

// 注册组件
app.use(ImmersiveMediaPlayer)

// 或者直接导入组件
import { VideoPlayer, MediaGallery } from 'zen-player'
```

## 📖 组件文档

### VideoPlayer 组件

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| videoSrc | String | - | 媒体源地址（视频/音频，必填） |
| videoTitle | String | '视频标题' | 媒体标题 |
| poster | String | '' | 封面图（视频封面/专辑封面） |
| mediaType | String | 'auto' | 媒体类型：'auto'(自动检测), 'video'(视频), 'audio'(音频) |
| playIcon | String | - | 自定义播放按钮图标URL |
| pauseIcon | String | - | 自定义暂停按钮图标URL |
| backIcon | String | - | 自定义后退按钮图标URL |
| frontIcon | String | - | 自定义前进按钮图标URL |
| smallScreenIcon | String | - | 自定义小屏按钮图标URL |
| fullScreenIcon | String | - | 自定义全屏按钮图标URL |
| showSmallScreenBtn | Boolean | true | 是否显示小屏按钮 |
| showFullScreenBtn | Boolean | true | 是否显示全屏按钮 |
| showSeekButtons | Boolean | true | 是否显示快进/快退按钮 |
| seekStep | Number | 15 | 快进/快退步长（秒） |
| autoplay | Boolean | false | 是否自动播放 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| play | - | 视频开始播放时触发 |
| pause | - | 视频暂停时触发 |
| videoEnded | - | 视频播放结束时触发 |
| timeUpdate | currentTime: number | 播放进度更新时触发 |
| error | error: Event | 视频加载错误时触发 |
| loaded | duration: number | 视频元数据加载完成时触发 |

#### Methods

| 方法名 | 参数 | 说明 |
|--------|------|------|
| play() | - | 播放视频 |
| pause() | - | 暂停视频 |
| load() | - | 重新加载视频 |

#### Slots

| 插槽名 | 说明 |
|--------|------|
| play-icon | 自定义播放图标 |
| pause-icon | 自定义暂停图标 |
| back-icon | 自定义后退图标 |
| forward-icon | 自定义前进图标 |
| small-screen-icon | 自定义小屏图标 |
| full-screen-icon | 自定义全屏图标 |

### MediaGallery 组件

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| categories | Array | - | 分类数据（必填） |
| videos | Array | - | 视频列表（必填） |
| headerTitle | String | '分类视频' | 头部标题 |
| headerSubtitle | String | 'Category Videos' | 头部副标题 |
| showHeader | Boolean | true | 是否显示头部 |
| dividerText | String | '更多相关视频' | 分隔线文字 |
| showDivider | Boolean | true | 是否显示分隔线 |
| itemsPerPage | Number | 9 | 每页显示数量 |
| defaultCategoryIndex | Number | 0 | 默认选中的分类索引 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| category-change | { index, category, videos } | 分类切换时触发 |
| video-select | video | 选择视频时触发 |
| page-change | page | 分页变化时触发 |

#### Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| player | 自定义播放器 | { currentVideo } |

## 💡 使用示例

### 完整示例：分类视频画廊

```vue
<template>
  <ImmersiveMediaGallery
    :categories="categories"
    :videos="videos"
    header-title="精彩视频"
    header-subtitle="Wonderful Videos"
    :items-per-page="9"
    @category-change="onCategoryChange"
    @video-select="onVideoSelect"
  >
    <template #player="{ currentVideo }">
      <ImmersiveVideoPlayer
        v-if="selectedVideo"
        :video-src="selectedVideo.src"
        :video-title="selectedVideo.title"
        :poster="selectedVideo.cover"
        :seek-step="10"
        @videoEnded="onVideoEnded"
      />
    </template>
  </ImmersiveMediaGallery>
</template>

<script setup>
import { ref } from 'vue'
import { VideoPlayer as ImmersiveVideoPlayer, MediaGallery as ImmersiveMediaGallery } from 'zen-player'

const categories = ref([
  {
    id: 1,
    name: '动画短片',
    nameEn: 'Animation',
    image: 'https://example.com/category1.jpg',
    description: '精选世界顶级的开源动画短片作品集'
  },
  {
    id: 2,
    name: '纪录片',
    nameEn: 'Documentary',
    image: 'https://example.com/category2.jpg',
    description: '探索世界的精彩纪录片'
  }
])

const videos = ref([
  {
    id: 1,
    title: '大兔子邦尼',
    titleEn: 'Big Buck Bunny',
    cover: 'https://example.com/video1-cover.jpg',
    src: 'https://example.com/video1.mp4',
    category: '动画短片',
    categoryEn: 'Animation'
  },
  {
    id: 2,
    title: '辛特尔',
    titleEn: 'Sintel',
    cover: 'https://example.com/video2-cover.jpg',
    src: 'https://example.com/video2.mp4',
    category: '动画短片',
    categoryEn: 'Animation'
  }
])

const selectedVideo = ref(videos.value[0])

const onCategoryChange = ({ index, category, videos }) => {
  console.log('切换分类:', category.name)
  if (videos.length > 0) {
    selectedVideo.value = videos[0]
  }
}

const onVideoSelect = (video) => {
  console.log('选择视频:', video.title)
  selectedVideo.value = video
}

const onVideoEnded = () => {
  console.log('视频播放结束')
}
</script>
```

### TypeScript 支持

```typescript
import { VideoPlayer, MediaGallery } from 'zen-player'
import type { Category, Video } from 'zen-player'

const categories: Category[] = [
  {
    id: 1,
    name: '动画短片',
    nameEn: 'Animation',
    image: 'https://example.com/category.jpg',
    description: '精彩动画'
  }
]

const videos: Video[] = [
  {
    id: 1,
    title: '视频标题',
    titleEn: 'Video Title',
    cover: 'https://example.com/cover.jpg',
    src: 'https://example.com/video.mp4',
    category: '动画短片',
    categoryEn: 'Animation'
  }
]
```

## 🎨 样式自定义

所有组件的 CSS 类名都使用 `imp-` 前缀，您可以通过覆盖这些类名来自定义样式：

```css
/* 自定义播放器主题色 */
.imp-progress-fill {
  background: #ff6b6b !important;
}

/* 自定义分类卡片样式 */
.imp-category-item {
  border-radius: 20px !important;
}

/* 自定义按钮样式 */
.imp-control-btn:hover {
  background-color: rgba(255, 107, 107, 0.2) !important;
}
```

## 🔧 浏览器兼容性

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79
- iOS Safari >= 12
- Android Chrome >= 60

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- 邮箱: your.email@example.com
- GitHub: https://github.com/yourusername/zen-player

## 🌟 致谢

感谢所有为这个项目做出贡献的开发者！

---

Made with ❤️ by Your Name


