# 更新说明

## v1.0.1 (2025-11-06)

### 🎨 样式更新

**重大改进**: 将 MediaGallery 组件的样式完全调整为与 powerfulPlayer 项目中 science.vue 页面一致

#### 具体更新内容

1. **容器结构调整**
   - 添加渐变背景层 (`imp-background-gradient`)
   - 使用 science.vue 的完整布局结构
   - 添加固定背景渐变效果

2. **标题区域**
   - 采用 science.vue 的标题样式
   - 添加淡入下滑动画效果
   - 保持相同的字体大小和间距

3. **分类卡片**
   - 完全复制 science.vue 的分类卡片样式
   - 选中/未选中状态效果一致
   - 保持相同的悬停和点击效果
   - 使用毛玻璃效果和边框样式

4. **视频网格**
   - 3列网格布局（移动端）
   - 卡片悬停效果一致
   - 封面图片缩放动画
   - 标题显示样式统一

5. **分页控制**
   - 圆形页码指示器
   - 与原项目相同的样式和动画
   - Pulse 动画效果

6. **响应式布局**
   - 移动端：2列分类，3列视频
   - 平板端：适配优化
   - PC端：4列分类，3列视频
   - 超大屏：1400px 最大宽度

7. **滚动动画**
   - 添加 `animate-on-scroll` 类
   - 元素进入视口时淡入和上移
   - 使用 IntersectionObserver 实现

### 📦 类名更新

所有类名添加 `imp-` 前缀以避免样式冲突：
- `.science-container` → `.imp-science-container`
- `.science-pictures` → `.imp-science-pictures`
- `.video-grid` → `.imp-video-grid`
- 等等...

### 🔧 兼容性

- ✅ 完全向后兼容
- ✅ 保持相同的 Props 和 Events
- ✅ API 无变化

### 🎯 测试建议

在 powerfulPlayer 项目中测试：

```bash
cd /Users/fgi/Desktop/powerfulPlayer
npm run dev
```

访问以下页面对比效果：
- 插件演示页面: `http://localhost:5174/#/plugin-demo`
- 原始页面: `http://localhost:5174/#/science`

两个页面的显示效果应该完全一致！

---

## v1.0.0 (2025-11-06)

初始版本发布





