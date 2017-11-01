package com.zcbl.airport.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import android.content.Context;
import android.telephony.TelephonyManager;
import android.util.Log;


public class Device extends ReactContextBaseJavaModule{

    private Promise jsPromise;
    private ReactApplicationContext reactContext;

    public Device(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Device";
    }

    @ReactMethod
    public void getDeviceId(Promise promise){
        String serial = android.os.Build.SERIAL;
        promise.resolve(serial);
     }

    @ReactMethod
    public void getImsiCode(Promise promise){
        TelephonyManager mTelephonyMgr =
                (TelephonyManager) this.reactContext.getSystemService(Context.TELEPHONY_SERVICE);
        promise.resolve(mTelephonyMgr.getSubscriberId());
    }

}
