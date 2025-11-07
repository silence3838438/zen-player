# DCloud 插件市场上传指南

## 📋 上传前准备清单

### ✅ 已完成的准备工作
- [x] 插件目录结构符合 uni_modules 规范
- [x] package.json 包含完整的 DCloud 配置
- [x] 文件名改为小写（readme.md, changelog.md, license）
- [x] 创建 screenshots 目录（用于存放预览图）
- [x] readme.md 文档格式符合 DCloud 规范
- [x] 代码已同步到 GitHub

### 📸 需要准备的内容

#### 1. 插件预览图（必需）
在 `screenshots/` 目录下准备以下图片：
- **插件图标**：128x128 px，PNG 格式
- **预览图1-5张**：建议尺寸 750x1334 px 或 16:9 比例
  - 图1：首页/主要功能展示
  - 图2：视频播放器界面
  - 图3：媒体画廊展示
  - 图4：响应式效果（可选）
  - 图5：其他特色功能（可选）

#### 2. 插件信息
- **插件名称**：沉浸式音视频播放器 Zen Player
- **插件 ID**：zen-player
- **版本号**：1.0.2
- **分类**：前端组件 > 媒体组件
- **开源协议**：MIT
- **价格**：免费

#### 3. 详细描述（可从 readme.md 复制）
- 插件简介
- 功能特性列表
- 使用示例代码
- API 文档

## 🚀 上传步骤

### 方式一：通过 HBuilderX 上传（推荐）

1. **打开 HBuilderX**
   - 确保已安装最新版 HBuilderX
   - 登录你的 DCloud 账号

2. **导入插件项目**
   ```
   文件 → 导入 → 从本地目录导入
   选择：/Users/fgi/Desktop/zen-player
   ```

3. **验证插件结构**
   - 确认项目根目录有 `package.json`
   - 确认 `package.json` 中有 `uni_modules` 配置节点
   - 确认所有必需文件都存在

4. **上传到插件市场**
   ```
   右键项目根目录 → 发行 → 发布到插件市场
   
   或者：
   工具 → 插件市场 → 提交插件
   ```

5. **填写插件信息**
   - 插件ID：自动从 package.json 读取（zen-player）
   - 插件名称：自动从 package.json 读取
   - 插件描述：填写或从 readme.md 复制
   - 选择分类：前端组件 > 媒体组件
   - 上传预览图：从 screenshots 目录选择
   - 上传图标：128x128 PNG 图片

6. **提交审核**
   - 检查所有信息无误
   - 点击"提交审核"
   - 等待 DCloud 官方审核（通常 1-3 个工作日）

### 方式二：通过网页上传

1. **访问 DCloud 插件市场**
   - 打开 https://ext.dcloud.net.cn/
   - 登录你的 DCloud 账号

2. **进入发布页面**
   ```
   个人中心 → 我的插件 → 发布新插件
   ```

3. **上传插件包**
   - 将 `/Users/fgi/Desktop/zen-player` 整个目录打包为 ZIP
   - 上传 ZIP 文件
   - 系统会自动解析 package.json

4. **填写插件信息**
   - 按照页面提示填写各项信息
   - 上传预览图和图标
   - 填写更新说明

5. **提交审核**
   - 点击"提交审核"
   - 等待审核通过

## 📁 项目结构说明

当前 zen-player 插件的目录结构：

```
zen-player/
├── package.json          # 插件配置文件（包含 DCloud 规范配置）
├── readme.md            # 插件说明文档
├── changelog.md         # 更新日志
├── license              # 开源协议（MIT）
├── screenshots/         # 预览图目录（需要添加图片）
│   └── （待添加预览图）
├── src/                 # 源代码目录
│   ├── index.js        # 插件入口文件
│   └── components/     # 组件目录
│       ├── VideoPlayer.vue      # 视频播放器组件
│       └── MediaGallery.vue     # 媒体画廊组件
├── types/              # TypeScript 类型定义
│   ├── index.d.ts
│   └── components/
│       ├── VideoPlayer.d.ts
│       └── MediaGallery.d.ts
└── examples/           # 使用示例
    ├── basic-usage.html
    └── vue3-project-example.md
```

## ⚠️ 注意事项

1. **插件 ID 唯一性**
   - 插件 ID `zen-player` 需要在 DCloud 插件市场中唯一
   - 如果已被占用，需要修改为其他 ID

2. **版本号规范**
   - 遵循语义化版本（Semantic Versioning）
   - 格式：主版本号.次版本号.修订号
   - 每次更新需要递增版本号

3. **审核要求**
   - 代码需要经过测试，确保功能正常
   - 不能包含违规内容
   - 文档描述需要准确清晰
   - 预览图需要真实展示插件功能

4. **更新插件**
   - 修改 `package.json` 中的 `version`
   - 更新 `changelog.md`
   - 重新提交审核

## 📝 示例项目说明

如果需要提供示例项目（powerfulPlayer）：

1. **准备示例项目**
   - 项目位置：`/Users/fgi/Desktop/powerfulPlayer`
   - 确保项目可以正常运行
   - 包含插件的完整使用示例

2. **上传方式**
   - 可以将示例项目打包后，在插件描述中提供下载链接
   - 或者在 GitHub 仓库中提供示例代码链接

## 🔗 相关链接

- **插件 GitHub 仓库**：https://github.com/silence3838438/zen-player
- **DCloud 插件市场**：https://ext.dcloud.net.cn/
- **uni_modules 规范文档**：https://uniapp.dcloud.net.cn/plugin/uni_modules.html
- **插件发布指南**：https://ask.dcloud.net.cn/article/35408

## ✨ 上传后的工作

1. **推广插件**
   - 在社区发布使用教程
   - 收集用户反馈
   - 持续优化功能

2. **维护更新**
   - 定期修复 bug
   - 添加新功能
   - 保持文档更新

3. **用户支持**
   - 回复用户评论和问题
   - 提供技术支持
   - 建立用户社区

---

**提示**：第一次上传插件建议使用 HBuilderX，更加简单直观。

