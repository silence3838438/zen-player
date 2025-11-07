# 沉浸式音视频播放器 Zen Player

> 一款功能强大、界面精美的沉浸式音视频播放器插件，支持 Vue 3 项目

## 插件特色

✅ **自定义视频播放器** - 支持播放/暂停、进度条拖拽、快进/快退  
✅ **全屏播放支持** - 完美兼容 iOS/Android 全屏模式  
✅ **视频分类展示** - 支持多分类视频管理和切换  
✅ **媒体画廊组件** - 精美的视频列表展示，支持分页  
✅ **响应式设计** - 完美适配 PC/平板/手机等各种设备  
✅ **TypeScript 支持** - 完整的类型定义  
✅ **二维码分享** - 支持生成分享二维码  
✅ **自定义图标** - 可自定义播放器所有图标  

## 平台兼容性

| Vue2 | Vue3 | H5 | App | 微信小程序 | 支付宝小程序 |
| :--: | :--: | :--: | :--: | :--: | :--: |
| × | √ | √ | √ | √ | √ |

## 安装方式

### 方式一：通过 DCloud 插件市场导入
1. 访问 [DCloud 插件市场](https://ext.dcloud.net.cn/)
2. 在 HBuilderX 中右键项目 → 导入插件 → 从插件市场导入
3. 搜索"zen-player"并导入

### 方式二：通过 npm 安装
\`\`\`bash
npm install zen-player
\`\`\`

### 方式三：手动导入
1. 下载插件
2. 将 \`zen-player\` 文件夹复制到项目的 \`uni_modules\` 目录下

## 快速开始

### 基础用法

在 Vue 3 项目中使用：

\`\`\`vue
<template>
  <div class="container">
    <!-- 视频播放器 -->
    <ImmersiveVideoPlayer
      :video-src="videoSrc"
      :video-title="videoTitle"
      :poster="poster"
      @play="handlePlay"
      @pause="handlePause"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VideoPlayer as ImmersiveVideoPlayer } from '@/uni_modules/zen-player/src/index.js'

const videoSrc = ref('https://example.com/video.mp4')
const videoTitle = ref('示例视频')
const poster = ref('https://example.com/poster.jpg')

const handlePlay = () => {
  console.log('视频开始播放')
}

const handlePause = () => {
  console.log('视频暂停')
}
</script>
\`\`\`

### 媒体画廊用法

\`\`\`vue
<template>
  <div class="gallery-container">
    <ImmersiveMediaGallery
      :categories="categories"
      :videos="videos"
      header-title="视频库"
      header-subtitle="Video Gallery"
      @video-select="handleVideoSelect"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { MediaGallery as ImmersiveMediaGallery } from '@/uni_modules/zen-player/src/index.js'

const categories = reactive([
  {
    id: 1,
    name: '精选视频',
    nameEn: 'Featured',
    image: 'https://example.com/category1.jpg',
    description: '精选优质视频内容'
  }
])

const videos = reactive([
  {
    id: 1,
    title: '示例视频',
    titleEn: 'Sample Video',
    cover: 'https://example.com/cover1.jpg',
    src: 'https://example.com/video1.mp4',
    category: '精选视频',
    categoryEn: 'Featured'
  }
])

const handleVideoSelect = (video) => {
  console.log('选中视频:', video)
}
</script>
\`\`\`

## API 文档

### VideoPlayer 组件

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| video-src | String | - | 视频地址（必填） |
| video-title | String | - | 视频标题 |
| poster | String | - | 视频封面 |
| seek-step | Number | 10 | 快进/快退步长（秒） |
| autoplay | Boolean | false | 是否自动播放 |

#### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| play | 视频开始播放时触发 | - |
| pause | 视频暂停时触发 | - |
| videoEnded | 视频播放结束时触发 | - |
| timeUpdate | 播放进度更新时触发 | currentTime: 当前播放时间(秒) |

### MediaGallery 组件

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| categories | Array | [] | 分类列表（必填） |
| videos | Array | [] | 视频列表（必填） |
| default-category-index | Number | 0 | 默认选中的分类索引 |
| header-title | String | '' | 页面主标题 |
| header-subtitle | String | '' | 页面副标题 |
| items-per-page | Number | 9 | 每页显示数量 |

#### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| category-change | 分类切换时触发 | { index, category, videos, defaultVideo } |
| video-select | 选中视频时触发 | video: 视频对象, autoPlay: 是否自动播放 |
| page-change | 翻页时触发 | page: 页码 |

## 更新日志

### 1.0.2 (2025-11-07)
- 优化插件目录结构
- 更新文档格式符合 DCloud 规范
- 添加更多使用示例

### 1.0.1 (2025-11-06)
- 修复已知问题
- 优化性能

### 1.0.0 (2025-11-05)
- 首次发布

## 技术支持

- GitHub: https://github.com/silence3838438/zen-player
- 问题反馈: https://github.com/silence3838438/zen-player/issues

## 开源协议

本插件遵循 MIT 协议开源
