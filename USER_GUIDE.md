# NavGate User Guide | NavGate 使用指南

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

## 📖 How to Edit Navigation Content

### 🎯 Quick Start

When you first visit NavGate, demo data will be automatically loaded (3 groups, 12 sites). You can freely edit, delete, or add new content.

---

## 📁 Group Management

### ➕ Create New Group

1. Click the **blue floating button (+)** at the bottom right of the page
2. Fill in the dialog:
   - **Group Name**: e.g., "AI Tools", "Dev Resources"
   - **Public Group**: Toggle switch (enabled by default)
3. Click **Save**

### ✏️ Edit Group

1. Find the group you want to edit
2. Click the **edit icon (pencil)** on the right side of the group title
3. Modify the group name or public status
4. Click **Save**

### 🗑️ Delete Group

1. Find the group you want to delete
2. Click the **delete icon (trash)** on the right side of the group title
3. Click **Confirm Delete** in the confirmation dialog

⚠️ **Warning**: Deleting a group will also delete all sites in that group!

---

## 🔗 Site Management

### ➕ Create New Site

**Method 1: Add to specific group**

1. Find the group where you want to add a site
2. Click the **add icon (+)** on the right side of the group title
3. Fill in site information (see below)
4. Click **Save**

**Site Information:**

- **Site Name**: Required, e.g., "Cursor"
- **Site URL**: Required, full URL, e.g., "https://cursor.sh"
- **Description**: Optional, brief description of the site
- **Icon URL**: Optional, leave empty to auto-fetch site icon
- **Group**: Select which group to add to
- **Public Site**: Toggle switch (enabled by default)

### ✏️ Edit Site

1. Find the site card you want to edit
2. Click the **edit icon (pencil)** at the bottom of the card
3. Modify site information
4. Click **Save**

### 🗑️ Delete Site

1. Find the site card you want to delete
2. Click the **delete icon (trash)** at the bottom of the card
3. Click **Confirm Delete** in the confirmation dialog

### 🔗 Visit Site

**Method 1: Click the card**

- Click anywhere on the site card to open in a new tab

**Method 2: Use external link icon**

- Click the **external link icon (arrow)** at the bottom of the card

---

## 💾 Data Backup & Restore

### 📤 Export Data

1. Click the **Export** button at the top of the page
2. Browser will automatically download a JSON file
3. Filename format: `navgate-export-YYYY-MM-DD.json`

### 📥 Import Data

1. Click the **Import** button at the top of the page
2. Select a previously exported JSON file in the dialog
3. Click **Import** to confirm

⚠️ **Warning**: Importing will overwrite all current data!

---

## 🎨 Interface Settings

### 🌙 Toggle Dark Mode

Click the **moon/sun icon** at the top of the page to switch between light/dark themes

---

## 💡 Tips

### 1. Quick Add Common Websites

Recommend creating groups by category, for example:

- **AI Dev Tools**: Cursor, GitHub Copilot, V0.dev
- **AI Model Platforms**: OpenAI, Claude, Hugging Face
- **Dev Resources**: GitHub, Stack Overflow, MDN

### 2. Icon Fetching

If you don't fill in an icon URL, the system will automatically use Google's favicon service to fetch the site icon.

For custom icons, you can:

- Use the website's favicon URL
- Upload custom icons to an image hosting service

### 3. Data Storage

- **GitHub Pages Mode**: Data is stored in browser localStorage
- Data is only saved in the current browser
- Clearing browser data will lose all navigation content
- Regular export backups are recommended!

### 4. Multi-Device Sync

To sync data across multiple devices:

1. Export data on device A
2. Transfer the JSON file to device B
3. Import data on device B

---

## ❓ FAQ

### Q: Will data be lost?

A: Data is stored in browser localStorage and will persist unless you clear browser data. Regular export backups are recommended.

### Q: How many sites can I add?

A: Theoretically unlimited, but localStorage typically has a 5-10MB capacity limit.

### Q: How to reset to demo data?

A: Clear browser localStorage data and refresh the page to reload demo data.

### Q: Does it support drag-and-drop sorting?

A: Not in the current version, this feature will be added in future releases.

---

## 🚀 Advanced Usage

### Customize Demo Data

If you want to modify the default demo data, edit:

```
apps/frontend/src/api/local.ts
```

Find the `DEFAULT_GROUPS` and `DEFAULT_SITES` constants to modify.

---

## 📞 Feedback & Support

For issues or suggestions, please submit an issue on GitHub:
https://github.com/yunlongwen/NavGate/issues

---

**Enjoy using NavGate! 🎉**

---

<a name="中文"></a>

## 中文

# NavGate 使用指南

## 📖 如何编辑导航内容

### 🎯 快速开始

首次访问 NavGate 时，会自动加载演示数据（3个分组，12个站点）。你可以随意编辑、删除或添加新的内容。

---

## 📁 分组管理

### ➕ 新建分组

1. 点击页面右下角的 **蓝色浮动按钮（+）**
2. 在弹出的对话框中输入：
   - **分组名称**：例如 "AI工具"、"开发资源"
   - **公开分组**：开关按钮（默认开启）
3. 点击 **保存**

### ✏️ 编辑分组

1. 找到要编辑的分组
2. 点击分组标题右侧的 **编辑图标（铅笔）**
3. 修改分组名称或公开状态
4. 点击 **保存**

### 🗑️ 删除分组

1. 找到要删除的分组
2. 点击分组标题右侧的 **删除图标（垃圾桶）**
3. 在确认对话框中点击 **确认删除**

⚠️ **注意**：删除分组会同时删除该分组下的所有站点！

---

## 🔗 站点管理

### ➕ 新建站点

**方法一：在指定分组中添加**

1. 找到要添加站点的分组
2. 点击分组标题右侧的 **添加图标（+）**
3. 填写站点信息（见下方）
4. 点击 **保存**

**站点信息说明：**

- **站点名称**：必填，例如 "Cursor"
- **站点URL**：必填，完整的网址，例如 "https://cursor.sh"
- **描述**：可选，简短描述站点功能
- **图标URL**：可选，留空会自动获取网站图标
- **所属分组**：选择要添加到哪个分组
- **公开站点**：开关按钮（默认开启）

### ✏️ 编辑站点

1. 找到要编辑的站点卡片
2. 点击卡片底部的 **编辑图标（铅笔）**
3. 修改站点信息
4. 点击 **保存**

### 🗑️ 删除站点

1. 找到要删除的站点卡片
2. 点击卡片底部的 **删除图标（垃圾桶）**
3. 在确认对话框中点击 **确认删除**

### 🔗 访问站点

**方法一：点击卡片**

- 直接点击站点卡片的任意位置，会在新标签页打开

**方法二：使用外链图标**

- 点击卡片底部的 **外链图标（箭头）**

---

## 💾 数据备份与恢复

### 📤 导出数据

1. 点击页面顶部的 **导出** 按钮
2. 浏览器会自动下载一个 JSON 文件
3. 文件名格式：`navgate-export-YYYY-MM-DD.json`

### 📥 导入数据

1. 点击页面顶部的 **导入** 按钮
2. 在对话框中选择之前导出的 JSON 文件
3. 点击 **导入** 确认

⚠️ **注意**：导入会覆盖当前所有数据！

---

## 🎨 界面设置

### 🌙 切换深色模式

点击页面顶部的 **月亮/太阳图标** 即可切换亮色/深色主题

---

## 💡 使用技巧

### 1. 快速添加常用网站

建议按类别创建分组，例如：

- **AI 开发工具**：Cursor, GitHub Copilot, V0.dev
- **AI 模型平台**：OpenAI, Claude, Hugging Face
- **开发资源**：GitHub, Stack Overflow, MDN

### 2. 图标获取

如果不填写图标URL，系统会自动使用 Google 的 favicon 服务获取网站图标。

如果想自定义图标，可以：

- 使用网站的 favicon URL
- 使用图床服务上传自定义图标

### 3. 数据存储

- **GitHub Pages 模式**：数据存储在浏览器的 localStorage 中
- 数据只保存在当前浏览器
- 清除浏览器数据会丢失所有导航内容
- 建议定期导出备份！

### 4. 多设备同步

如果需要在多个设备间同步数据：

1. 在设备A上导出数据
2. 将 JSON 文件传输到设备B
3. 在设备B上导入数据

---

## ❓ 常见问题

### Q: 数据会丢失吗？

A: 数据存储在浏览器 localStorage 中，除非清除浏览器数据，否则会一直保留。建议定期导出备份。

### Q: 可以添加多少个站点？

A: 理论上没有限制，但 localStorage 通常有 5-10MB 的容量限制。

### Q: 如何重置为演示数据？

A: 清除浏览器的 localStorage 数据，刷新页面即可重新加载演示数据。

### Q: 支持拖拽排序吗？

A: 当前版本暂不支持，后续版本会添加此功能。

---

## 🚀 进阶使用

### 自定义演示数据

如果你想修改默认的演示数据，可以编辑：

```
apps/frontend/src/api/local.ts
```

找到 `DEFAULT_GROUPS` 和 `DEFAULT_SITES` 常量进行修改。

---

## 📞 反馈与支持

如有问题或建议，欢迎在 GitHub 提 Issue：
https://github.com/yunlongwen/NavGate/issues

---

**祝你使用愉快！🎉**
