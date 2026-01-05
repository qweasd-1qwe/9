Android 通知监听与 React Native 集成说明

已添加的原生示例文件（路径：`android/app/src/main/java/com/walletbill/`）：
- `NotificationListenerServiceImpl.java`：实现 `NotificationListenerService`，在 `onNotificationPosted` 中把包名、标题与正文通过 `LocalBroadcastManager` 广播出去（action = `com.walletbill.NOTIFICATION_LISTENER`）。
- `NotificationReceiverModule.java`：React Native 原生模块，注册 `LocalBroadcastManager` 的 `BroadcastReceiver`，接收广播后通过 `DeviceEventEmitter` 把文本发到 JS（事件名：`NotificationReceived`）。
- `NotificationReceiverPackage.java`：用于在 `MainApplication` 中注册模块。

必须在项目中完成的集成步骤：
1. 在 `android/app/src/main/AndroidManifest.xml` 的 `<application>` 内添加服务声明：

```xml
<service android:name=".NotificationListenerServiceImpl"
         android:label="WalletBillNotificationListener"
         android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">
    <intent-filter>
        <action android:name="android.service.notification.NotificationListenerService" />
    </intent-filter>
</service>
```

2. 确保 `androidx.localbroadcastmanager` 可用（在 `android/app/build.gradle` 的 `dependencies` 中加入）：

```gradle
implementation 'androidx.localbroadcastmanager:localbroadcastmanager:1.0.0'
```

3. 在 `MainApplication.java` 的 `getPackages()` 或包列表中加入：

```java
packages.add(new NotificationReceiverPackage());
```

4. 在 JS 层监听事件并交给解析器：

```ts
import { NativeEventEmitter, NativeModules } from 'react-native';
const { NotificationReceiver } = NativeModules;
const emitter = new NativeEventEmitter(NotificationReceiver);
emitter.addListener('NotificationReceived', (payload: string) => {
  // payload 为通知标题与正文的拼接文本
  parseNotification(payload); // 使用已有的解析器
});
```

注意事项与调试：
- 用户必须在系统设置中为应用开启“通知访问”。可以在应用中引导用户到 `android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS` 页面打开权限。
- 不同设备/ROM 的通知内容格式差异较大，建议在 JS 端做更健壮的拼接与清洗（多行合并、特殊符号去除）。
- 在某些 Android 版本上，服务组件声明需要与 package 名严格匹配（注意 `package` 名与文件路径）。

我可以接着把 `MainApplication.java` 中的包注册和 `AndroidManifest.xml` 的服务声明添加进仓库（需要我直接修改项目的 `android/` 下的 manifest 与 `MainApplication.java` 吗？）



