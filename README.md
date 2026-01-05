# 钱包账单 App — Android 原型

这是一个面向 Android 的 React Native + TypeScript 项目雏形，包含：
- 通知解析器雏形（`src/services/notificationParser.ts`）
- CSV 导入器雏形（`src/services/csvImporter.ts`）
- 本地存储接口占位（`src/storage/EncryptedDB.ts`，当前基于 `AsyncStorage`，后续替换为加密 SQLite/Realm）
- 简单的规则分类器（`src/utils/categories.ts`）

快速开始（在本机开发环境）：
1. 安装依赖：`npm install`
2. 运行 Metro：`npm run start`
3. 在已连接的 Android 设备上运行：`npm run android`

后续工作（优先级）：
- 实现 Android 通知监听原生模块并与 `src/services/notificationParser.ts` 集成（需要 Android 原生权限）  
- 把本地存储替换为加密 SQLite / Realm（生产必需）  
- 扩展解析规则与单元测试，支持更多银行/支付宝/微信通知样式  
- 实现每月消费分析与可视化导出（PDF/CSV）

关于 Android 通知监听：
- Android 需要注册 `NotificationListenerService` 原生服务并把通知文本发送到 JS 层（通过原生模块）。我会在后续实现中添加示例 native 代码和打包说明（你已授权读取通知）。



