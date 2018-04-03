package com.zcbl.airport;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.zcbl.airport.modules.ModuleManagerPackage;
import com.zyu.ReactNativeWheelPickerPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.beefe.picker.PickerViewPackage;
import com.remobile.toast.RCTToastPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ReactNativeWheelPickerPackage(),
          new OrientationPackage(),
          new RSSignatureCapturePackage(),
          new ImagePickerPackage(),
          new VectorIconsPackage(),
          new PickerViewPackage(),
          new RCTToastPackage(),
          new ModuleManagerPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initUMAnalytics();
  }

  private void initUMAnalytics(){
    UMConfigure.init(this, UMConfigure.DEVICE_TYPE_PHONE, null);
    MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_DUM_NORMAL);
//    UMConfigure.setLogEnabled(true);
//    UMConfigure.setEncryptEnabled(true);
  }
}
