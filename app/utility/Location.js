/**
 * Created by yyt on 16/8/17.
 * © 2016 NCF GROUP ALL RIGHTS RESERVED
 */

import AMapLocation from 'react-native-amap-location'
import coordtransform from 'coordtransform'
import {
  Platform,
  Alert
} from 'react-native'
import Toast from '@remobile/react-native-toast';

let listener = null

export function getLocation(callback) {
  if (Platform.OS === 'ios') {

    navigator.geolocation.getCurrentPosition(
    (position) => {
      var initialPosition = JSON.stringify(position);
      var q = JSON.parse(initialPosition);
      var lastPosition=coordtransform.wgs84togcj02(q.coords.longitude, q.coords.latitude);

      // console.log("initialPosition");
      // console.log(initialPosition);
      callback({"longitude":lastPosition[0],"latitude":lastPosition[1]},null)
    },
    (error) => {
      // console.log("error");
      // console.log(error);
      //ios
      if (error.code == 1) {
        // Toast.center("用户没有开启定位权限")
      }
      else if (error.code == 2) {
        Toast.showShortCenter("地理位置服务不可用")
      }
      else if (error.code == 3) {
        Toast.showShortCenter("请求超时")
      }
      callback(null,error)

    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );


    // this.watchID = navigator.geolocation.watchPosition((position) => {
    //   var w = JSON.stringify(position);
    //   var q = JSON.parse(w);
    //
    //   console.log("lastPosition");
    //   console.log(q.coords.longitude);
    //   console.log(q.coords.accuracy);
    //
    //   var lastPosition=coordtransform.wgs84togcj02(q.coords.longitude, q.coords.accuracy);
    //   console.log(lastPosition);
    // });

  }else{
    if (listener) {
      listener.remove()
      listener = null
    }
    let that = this;
    listener = AMapLocation.addEventListener((data) => {
      if (data["errorCode"] > 0 && data["errorCode"] != 12) {
        //http://lbs.amap.com/api/android-location-sdk/guide/utilities/errorcode/
        Toast.showShortCenter("获取位置报错："+data["errorInfo"])
        callback(null,data)
      }
      else {

        callback(data,null)
      }
      // console.log('gaodedata', data);
      AMapLocation.stopLocation()
    } );
    AMapLocation.startLocation({
      accuracy: 'HighAccuracy',
      killProcess: true,
      needDetail: false,
    });
  }

}
