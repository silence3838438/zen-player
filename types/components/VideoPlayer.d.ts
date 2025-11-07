import { DefineComponent } from 'vue'

export interface VideoPlayerProps {
  /** 视频/音频源地址 */
  videoSrc: string
  /** 媒体标题 */
  videoTitle?: string
  /** 封面图 */
  poster?: string
  /** 媒体类型：'auto' 自动检测，'video' 视频，'audio' 音频 */
  mediaType?: 'auto' | 'video' | 'audio'
  /** 播放按钮图标 */
  playIcon?: string
  /** 暂停按钮图标 */
  pauseIcon?: string
  /** 后退按钮图标 */
  backIcon?: string
  /** 前进按钮图标 */
  frontIcon?: string
  /** 小屏按钮图标 */
  smallScreenIcon?: string
  /** 全屏按钮图标 */
  fullScreenIcon?: string
  /** 是否显示小屏按钮 */
  showSmallScreenBtn?: boolean
  /** 是否显示全屏按钮 */
  showFullScreenBtn?: boolean
  /** 是否显示快进/快退按钮 */
  showSeekButtons?: boolean
  /** 快进/快退的步长（秒） */
  seekStep?: number
  /** 是否自动播放 */
  autoplay?: boolean
}

export interface VideoPlayerEmits {
  (e: 'videoEnded'): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'timeUpdate', currentTime: number): void
  (e: 'error', error: Event): void
  (e: 'loaded', duration: number): void
}

export interface VideoPlayerMethods {
  /** 播放视频 */
  play(): void
  /** 暂停视频 */
  pause(): void
  /** 重新加载视频 */
  load(): void
}

export type VideoPlayerComponent = DefineComponent<
  VideoPlayerProps,
  {},
  {},
  {},
  VideoPlayerMethods,
  {},
  {},
  VideoPlayerEmits
>

declare const VideoPlayer: VideoPlayerComponent

export default VideoPlayer


