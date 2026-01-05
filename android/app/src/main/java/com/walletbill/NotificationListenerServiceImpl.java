package com.walletbill;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.content.Intent;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class NotificationListenerServiceImpl extends NotificationListenerService {
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        try {
            String packageName = sbn.getPackageName();
            CharSequence titleCs = sbn.getNotification().extras.getCharSequence("android.title");
            CharSequence textCs = sbn.getNotification().extras.getCharSequence("android.text");
            String title = titleCs != null ? titleCs.toString() : "";
            String text = textCs != null ? textCs.toString() : "";

            Intent intent = new Intent("com.walletbill.NOTIFICATION_LISTENER");
            intent.putExtra("package", packageName);
            intent.putExtra("title", title);
            intent.putExtra("text", text);
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        } catch (Throwable t) {
            // swallow to avoid crashing the service
            t.printStackTrace();
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // no-op for now
    }
}



