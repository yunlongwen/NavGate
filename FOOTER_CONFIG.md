# 备案信息配置说明

NavGate 支持灵活的备案信息配置，不会在开源代码中硬编码任何备案号。

## 配置方式

### 1. Docker 部署（推荐）

在启动 Docker 容器时，通过环境变量设置备案信息：

```bash
docker run -d \
  --name navgate \
  -p 3456:3456 \
  --restart=unless-stopped \
  -v /www/wwwroot/NavGate/data:/app/data \
  -e AUTH_USERNAME=your_username \
  -e AUTH_PASSWORD=your_password \
  -e ICP_NUMBER="京ICP备12345678号" \
  -e POLICE_NUMBER="京公网安备 11000002000001号" \
  -e COPYRIGHT="© 2024 您的公司名称" \
  yunlong3639/navgate:sha-590b643
```

### 2. 配置界面设置

登录管理员账号后，通过 API 更新配置：

```bash
curl -X PUT http://localhost:3456/api/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ICP_NUMBER": "京ICP备12345678号",
    "POLICE_NUMBER": "京公网安备 11000002000001号",
    "COPYRIGHT": "© 2024 您的公司名称",
    "CUSTOM_FOOTER": "<a href='https://example.com'>友情链接</a>"
  }'
```

## 配置字段说明

| 字段            | 说明            | 示例                                         |
| --------------- | --------------- | -------------------------------------------- |
| `ICP_NUMBER`    | ICP 备案号      | "京ICP备12345678号"                          |
| `POLICE_NUMBER` | 公安备案号      | "京公网安备 11000002000001号"                |
| `COPYRIGHT`     | 版权信息        | "© 2024 您的公司名称"                        |
| `CUSTOM_FOOTER` | 自定义页脚 HTML | "<a href='https://example.com'>友情链接</a>" |

## 显示效果

- ICP 备案号会显示为可点击的链接，指向 https://beian.miit.gov.cn/
- 公安备案号会显示图标和文字，点击跳转到公安备案查询页面
- 版权信息直接显示在页脚
- 自定义页脚支持 HTML 格式

## 注意事项

1. 备案号信息会显示在页面底部，只在配置了相关字段时才显示
2. 环境变量配置优先级高于数据库配置
3. 如需隐藏备案信息，删除相关配置即可
4. 公安备案号格式需要包含完整编号，如"京公网安备 11000002000001号"
5. 自定义页脚支持 HTML，但请注意安全性，避免注入恶意代码

## 常见备案号格式

### ICP 备案号

- 京ICP备12345678号-1
- 沪ICP备12345678号
- 粤ICP备12345678号

### 公安备案号

- 京公网安备 11000002000001号
- 沪公网安备 31000002000001号
- 粤公网安备 44000002000001号

## 宝塔面板部署示例

如果您使用宝塔面板部署，可以在创建容器时添加环境变量：

```bash
docker run -d \
  --name navgate \
  -p 3456:3456 \
  --restart=unless-stopped \
  -v /www/wwwroot/NavGate/data:/app/data \
  -e AUTH_USERNAME=your_username \
  -e AUTH_PASSWORD=your_password \
  -e ICP_NUMBER="您的ICP备案号" \
  -e POLICE_NUMBER="您的公安备案号" \
  -e COPYRIGHT="© 2024 您的公司名称" \
  yunlong3639/navgate:sha-590b643
```

这样配置后，您的备案信息就会正确显示在网站底部，同时不会影响开源代码的通用性。
