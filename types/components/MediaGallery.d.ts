import { DefineComponent } from 'vue'

export interface Category {
  /** 分类ID */
  id: number | string
  /** 分类名称（中文） */
  name: string
  /** 分类名称（英文） */
  nameEn?: string
  /** 分类封面图 */
  image: string
  /** 分类描述 */
  description?: string
}

export interface Video {
  /** 视频ID */
  id: number | string
  /** 视频标题 */
  title: string
  /** 视频标题（英文） */
  titleEn?: string
  /** 视频封面 */
  cover: string
  /** 视频源地址 */
  src: string
  /** 所属分类 */
  category: string
  /** 所属分类（英文） */
  categoryEn?: string
}

export interface MediaGalleryProps {
  /** 分类数据 */
  categories: Category[]
  /** 视频列表 */
  videos: Video[]
  /** 头部标题 */
  headerTitle?: string
  /** 头部副标题 */
  headerSubtitle?: string
  /** 是否显示头部 */
  showHeader?: boolean
  /** 分隔线文字 */
  dividerText?: string
  /** 是否显示分隔线 */
  showDivider?: boolean
  /** 每页显示数量 */
  itemsPerPage?: number
  /** 默认选中的分类索引 */
  defaultCategoryIndex?: number
}

export interface CategoryChangeEvent {
  index: number
  category: Category
  videos: Video[]
}

export interface MediaGalleryEmits {
  (e: 'category-change', event: CategoryChangeEvent): void
  (e: 'video-select', video: Video): void
  (e: 'page-change', page: number): void
}

export type MediaGalleryComponent = DefineComponent<
  MediaGalleryProps,
  {},
  {},
  {},
  {},
  {},
  {},
  MediaGalleryEmits
>

declare const MediaGallery: MediaGalleryComponent

export default MediaGallery





