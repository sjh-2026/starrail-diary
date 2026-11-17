# 星穹日志 · 孙俊豪的个人主页

《计算机基础》课程设计作业 · 主题：《崩坏：星穹铁道》
作者：孙俊豪 · 计算机科学与技术专业 · 2611 班

一套纯手写的静态网站：**HTML5 + CSS3 + 原生 JavaScript + 手绘 SVG**，没有使用任何框架、外部字体、CDN 或网络图片，断网也能完整显示。

---

## 一、目录结构

```
starrail-diary/                 ← 把这个文件夹里的全部内容上传到仓库根目录
├── index.html                  ← 主页（必须叫 index.html）
├── about.html                  ← 开拓档案
├── characters.html             ← 星穹图鉴
├── gallery.html                ← 手账相册
├── study.html                  ← 开拓计划
├── contact.html                ← 联络 / 留言板
├── css/
│   └── style.css               ← 全站样式（深空科技 + 国潮金朱 + 手账纸感）
├── js/
│   └── main.js                 ← 星空、筛选、灯箱、时钟、清单、留言板
├── assets/
│   └── img/                    ← 17 个原创 SVG（列车、星球、档案、命途图标、favicon）
└── README.md
```

所有页面之间的跳转、图片与样式引用**全部使用相对路径**，整个文件夹复制到任何位置都能直接打开。

---

## 二、六个页面做了什么

| 页面 | 文件 | 主要内容 | 交互 / 技术点 |
| --- | --- | --- | --- |
| 首页 | `index.html` | 星空首屏、星穹列车、四个“停靠站”入口、手账速写、图鉴预告 | Canvas 星空与流星、跑马灯、滚动入场、鼠标视差 |
| 开拓档案 | `about.html` | 角色档案式个人信息、属性条、三段自述、三句摘抄 | 技能条进入视口后生长、印章与拍立得手账元素 |
| 星穹图鉴 | `characters.html` | 10 位角色、7 条命途、每人一句短评 | 命途筛选按钮、CSS 变量控制角色主题色 |
| 手账相册 | `gallery.html` | 9 张原创插画贴在拍立得白边与胶带上 | 瀑布流、灯箱放大、方向键 / Esc、焦点管理 |
| 开拓计划 | `study.html` | 实时时钟、期末倒计时、课表、技能进度、任务清单 | 时钟与倒计时、任务勾选写入 localStorage、进度条 |
| 联络 | `contact.html` | 车票式联系卡、星穹邮局留言板、结语 | 留言本地保存、表单校验、文字转义防注入 |

另含：响应式布局（手机 / 平板 / 桌面）、无障碍跳转链接、`alt` 文本、`aria` 属性、`prefers-reduced-motion` 降级、打印样式。

---

## 三、本地预览

三种方式任选：

1. **直接双击** `index.html`，浏览器即可打开（相对路径已全部处理好）。
2. 用 VS Code 安装 **Live Server** 插件，右键 `index.html` → *Open with Live Server*。
3. 命令行（需要 Python）：

```bash
cd starrail-diary
python -m http.server 8000
# 浏览器访问 http://localhost:8000
```

> 提示：留言板与任务清单使用浏览器 `localStorage`，换浏览器或清除数据后会重置，这是静态网站的预期行为。

---

## 四、发布到 GitHub Pages（照做即可）

### 第 1 步：新建仓库

1. 登录 GitHub，右上角 **+ → New repository**。
2. 仓库名建议 `starrail-diary`（全小写、用短横线）。
3. 选择 **Public**（Pages 免费版需要公开仓库）。
4. 不要勾选 “Add a README file”，直接 **Create repository**。
5. 复制仓库地址，形如 `https://github.com/你的用户名/starrail-diary.git`。

### 第 2 步：把网页放进本地 Git 工作目录

1. 新建本地工作目录，例如 `D:\Work`。
2. 把本项目 `starrail-diary` 文件夹**里面的全部文件**复制到 `D:\Work`。
   - ✅ 正确：`D:\Work\index.html`、`D:\Work\css\`、`D:\Work\assets\`
   - ❌ 错误：`D:\Work\starrail-diary\index.html`（多套一层，Pages 会找不到主页）

### 第 3 步：推送（二选一）

**A. SourceTree**

1. `Clone / New` → **Add Working Copy**，选择 `D:\Work`。
2. 在文件列表点 **Stage All**（add）。
3. 下方填写提交信息，例如 `完成星穹日志个人主页`，点 **Commit**。
4. 点 **Push**，选择 `origin`、分支 `main`，确认。

**B. 命令行（Git Bash / PowerShell）**

```bash
cd D:\Work
git init
git add .
git commit -m "完成星穹日志个人主页"
git branch -M main
git remote add origin https://github.com/你的用户名/starrail-diary.git
git push -u origin main
```

> 首次推送会要求登录，按提示在浏览器授权即可。

### 第 4 步：开启 Pages

1. 打开仓库 → **Settings** → 左侧 **Pages**。
2. **Source** 选 *Deploy from a branch*。
3. **Branch** 选 `main`，目录选 `/ (root)`，点 **Save**。
4. 等待 1–2 分钟，页面顶部会出现：
   `Your site is live at https://你的用户名.github.io/starrail-diary/`
5. 打开该地址，确认首页、图片、各分页都能正常访问。

### 第 5 步：提交作业

把 `https://你的用户名.github.io/starrail-diary/` 填进作业提交处即可。

> 如果仓库名取为 `你的用户名.github.io`，则主页地址是 `https://你的用户名.github.io/`（不带仓库名）。
> 更新网站时，只需再次 commit + push，Pages 会自动重新发布。

---

## 五、提交前请替换的占位信息

| 位置 | 现在的内容 | 需要改成 |
| --- | --- | --- |
| `contact.html` 车票 | `sunjunhao@example.com` | 你的真实邮箱 |
| `contact.html` 车票 | `github.com/your-name` | 你的 GitHub 主页 |
| `about.html` 档案 | 年级 `2026 级` | 若不符请修改 |
| `study.html` 课表 | 示例课表 | 按实际课表调整（节次、课程、教室） |

留言板、任务清单不需要服务器，纯前端即可运行。

---

## 六、素材与版权说明

- `assets/img/` 下 17 个 SVG 均由本人手写代码绘制：星轨是贝塞尔曲线，星尘是循环生成的小圆点，手账胶带、车票、印章是矩形与虚线组合。
- **没有**下载或使用官方立绘、游戏截图、网络图片；页面中的“角色卡面”由 CSS 渐变 + 原创命途图标构成。
- 《崩坏：星穹铁道》的角色名称、命途与世界观设定版权归**米哈游**所有；本站为非官方课程作业，仅作学习交流，不作商业用途。
- 字体使用系统自带字体栈（宋体 / 楷体 / 微软雅黑 / Consolas），不依赖外部字体服务。

---

## 七、对照作业要求的自查

- [x] 网页总数 ≥ 5：共 **6** 个 HTML 页面
- [x] 有主页且文件名为 `index.html`，主页内含全部 5 个分页面的链接
- [x] 页面间链接、图片、CSS、JS 全部使用**相对路径**
- [x] 图文并茂：17 张原创 SVG + 手账拼贴排版
- [x] 主题积极向上：个人档案、学习计划、兴趣图鉴、留言互动
- [x] 未抄袭、未直接使用网上下载的页面
- [ ] **发布到 GitHub Pages**（这一步需要你在自己的账号下完成，步骤见第四节）

---

## 八、可以写进实验报告的技术点

1. **语义化结构**：`header / nav / main / section / article / figure / footer`，配合 `aria-label` 与跳转链接。
2. **CSS 自定义属性**：全站配色、字体、间距统一由 `:root` 变量控制；角色卡用 `--c` 变量实现“一卡一色”。
3. **布局**：Grid 负责卡片与档案分栏，Flex 负责导航与按钮，`columns` 实现手账瀑布流。
4. **Canvas 星空**：按面积计算星点数量，`requestAnimationFrame` 绘制闪烁与偶发流星，离开视口或切换标签页时暂停。
5. **IntersectionObserver**：滚动入场与技能条生长，避免一次性触发全部动画。
6. **localStorage**：任务清单与留言板的本地持久化，刷新不丢；所有用户输入用 `textContent` 写入，避免 XSS。
7. **SVG 手绘插画**：渐变、径向光晕、路径与滤镜组合，体积小、任意缩放不糊。
8. **响应式与无障碍**：三档断点、移动端折叠菜单、`prefers-reduced-motion` 降级、键盘可操作灯箱。

---

祝发布顺利。愿此行，终抵群星。
