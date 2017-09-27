package com.zcbl.airport.modules;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;

public class BaiduMapModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = "ReactNativeJS";

    private ReactApplicationContext reactContext;
    private Promise promise;
    private int locateTimes = 0;

    public LocationClient mLocationClient = null;

    public BaiduMapModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    public void location(Promise promise){
        Log.i(TAG, "location: execute this");
        this.promise = promise;
        this.mLocationClient = new LocationClient(this.reactContext.getApplicationContext());
        this.mLocationClient.registerLocationListener( this.myLocationListener );
        this.mLocationClient.setLocOption(initLocation());
        this.mLocationClient.start();
    }

    private LocationClientOption initLocation(){
        LocationClientOption option = new LocationClientOption();
        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
        //可选，默认高精度，设置定位模式，高精度，低功耗，仅设备

        option.setCoorType("bd09ll");
        //可选，默认gcj02，设置返回的定位结果坐标系

//        option.setScanSpan(1000);//可选，默认0，即仅定位一次，设置发起定位请求的间隔需要大于等于1000ms才是有效的
        option.setIsNeedAddress(true); //可选，设置是否需要地址信息，默认不需要
        option.setOpenGps(true);       //可选，默认false,设置是否使用gps
        option.setLocationNotify(true);//可选，默认false，设置是否当GPS有效时按照1S/1次频率输出GPS结果
        option.setIsNeedLocationDescribe(true);//可选，默认false，设置是否需要位置语义化结果，可以在BDLocation.getLocationDescribe里得到，结果类似于“在北京天安门附近”
        option.setIsNeedLocationPoiList(true); //可选，默认false，设置是否需要POI结果，可以在BDLocation.getPoiList里得到
        option.setIgnoreKillProcess(false); //可选，默认true，定位SDK内部是一个SERVICE，并放到了独立进程，设置是否在stop的时候杀死这个进程，默认不杀死
        option.SetIgnoreCacheException(false); //可选，默认false，设置是否收集CRASH信息，默认收集
        option.setEnableSimulateGps(false); //可选，默认false，设置是否需要过滤GPS仿真结果，默认需要

        return option;

    }

    private BDLocationListener myLocationListener = new BDLocationListener() {
        @Override
        public void onReceiveLocation(BDLocation location) {
            // sb.append(location.getTime());  获取定位时间
            // sb.append(location.getLocationDescribe());  位置语义化信息
            // BDLocation.TypeGpsLocation; GPS定位结果
            // BDLocation.TypeNetWorkLocation; 网络定位结果
            // BDLocation.TypeOffLineLocation; 离线定位结果
            // BDLocation.TypeServerError;     服务端网络定位失败，可以反馈IMEI号和大体定位时间到loc-bugs@baidu.com，会有人追查原因
            // BDLocation.TypeNetWorkException;  网络不同导致定位失败，请检查网络是否通畅
            // BDLocation.TypeCriteriaException; 无法获取有效定位依据导致定位失败，一般是由于手机的原因，处于飞行模式下一般会造成这种结果，可以试着重启手机
            Log.i(TAG, "onReceiveLocation: and the BDLocation -->> "+new Gson().toJson(location));
            int errorCode = location.getLocType();
            WritableMap map = Arguments.createMap();
            if(errorCode == BDLocation.TypeOffLineLocation){
                map.putInt("errorCode", 62);
                BaiduMapModule.this.promise.resolve(map);
                BaiduMapModule.this.mLocationClient.stop();
            }else if(errorCode == BDLocation.TypeGpsLocation || errorCode == BDLocation.TypeNetWorkLocation){
                double latitude = location.getLatitude();
                double longitude = location.getLongitude();
                String address = location.getAddrStr();
                if(address != null && !"".equals(address)){
                    map.putDouble("latitude", latitude);
                    map.putDouble("longitude", longitude);
                    map.putString("address", address);
                    BaiduMapModule.this.promise.resolve(map);
                    BaiduMapModule.this.mLocationClient.stop();

                }else{
                    BaiduMapModule.this.locateTimes += 1;
                    if(BaiduMapModule.this.locateTimes > 10){
                        map.putInt("errorCode", 62);
                        BaiduMapModule.this.promise.resolve(map);
                        BaiduMapModule.this.mLocationClient.stop();
                    }
                }

            }else{
                map.putInt("errorCode", errorCode);
                BaiduMapModule.this.promise.resolve(map);
                BaiduMapModule.this.mLocationClient.stop();

            }
        }

        @Override
        public void onConnectHotSpotMessage(String s, int i) {

        }
    };


    /** Activity Event Implements */
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    /** ReactContextBaseJavaModule Extends */
    @Override
    public void onNewIntent(Intent intent) {

    }

    @Override
    public String getName() {
        return "BaiduMapModule";
    }
}
