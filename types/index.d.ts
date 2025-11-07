import { App, Plugin } from 'vue'
import { VideoPlayerComponent, VideoPlayerProps } from './components/VideoPlayer'
import { MediaGalleryComponent, MediaGalleryProps } from './components/MediaGallery'

export interface InstallOptions {
  videoPlayerName?: string
  mediaGalleryName?: string
}

declare const ImmersiveMediaPlayer: Plugin & {
  install: (app: App, options?: InstallOptions) => void
  VideoPlayer: VideoPlayerComponent
  MediaGallery: MediaGalleryComponent
}

export default ImmersiveMediaPlayer

export { 
  VideoPlayerComponent as VideoPlayer,
  VideoPlayerProps,
  MediaGalleryComponent as MediaGallery,
  MediaGalleryProps
}





