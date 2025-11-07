import VideoPlayer from './components/VideoPlayer.vue'
import MediaGallery from './components/MediaGallery.vue'

// 插件安装函数
const install = (app, options = {}) => {
  // 注册组件
  app.component(options.videoPlayerName || 'ImmersiveVideoPlayer', VideoPlayer)
  app.component(options.mediaGalleryName || 'ImmersiveMediaGallery', MediaGallery)
}

// 导出组件
export { VideoPlayer, MediaGallery }

// 导出插件
export default {
  install,
  VideoPlayer,
  MediaGallery
}

// 如果在浏览器中作为全局脚本使用
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}





