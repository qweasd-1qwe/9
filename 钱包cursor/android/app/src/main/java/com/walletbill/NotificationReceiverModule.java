package com.walletbill;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NotificationReceiverModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private BroadcastReceiver receiver;

    public NotificationReceiverModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        registerReceiver();
    }

    private void registerReceiver() {
        IntentFilter filter = new IntentFilter("com.walletbill.NOTIFICATION_LISTENER");
        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String pkg = intent.getStringExtra("package");
                String title = intent.getStringExtra("title");
                String text = intent.getStringExtra("text");
                String payload = (title != null ? title : "") + " " + (text != null ? text : "");
                try {
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("NotificationReceived", payload);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        LocalBroadcastManager.getInstance(reactContext).registerReceiver(receiver, filter);
    }

    @Override
    public String getName() {
        return "NotificationReceiver";
    }

    @ReactMethod
    public void noop() {
        // placeholder to keep module accessible from JS
    }

    @Override
    public void onCatalystInstanceDestroy() {
        try {
            if (receiver != null) {
                LocalBroadcastManager.getInstance(reactContext).unregisterReceiver(receiver);
                receiver = null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        super.onCatalystInstanceDestroy();
    }
}



