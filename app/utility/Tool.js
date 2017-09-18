/**
 * creat by renhanyi
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    Linking,
    Alert
} from 'react-native';

export default class Tools {
   //判断是否为空字符串
    static isEmpty(strings) {
            //判断不是字符串直接认定为空串
            if (Object.prototype.toString.call(strings) !== "[object String]") {
                return true;
            }
            if (strings.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return true;
            } else {
                return false;
            }
        }
    static callPhoneNum(phoneStr, showTip) {
                if (!this.isEmpty(phoneStr)) {
                    if (!showTip) {
                        Linking.openURL('tel:' + phoneStr)
                    } else {
                        Alert.alert(
                            '提示',
                            '是否要拨打: ' + phoneStr, [{
                                text: '取消',
                                onPress: () => console.log('Cancel Pressed!')
                            }, {
                                text: '确定',
                                onPress: () => Linking.openURL('tel:' + phoneStr)
                            }, ]
                        )
                    }
                }
            }
    static addZero(s) {
      return s < 10 ? '0' + s: s;
    }
    static getTimes(timestamp,type) {
          let times = new Date(parseInt(timestamp) * 1000);
          let time;
          if (arguments.length == 1) {
            time = times.getFullYear()+'年'+this.addZero(times.getMonth()+1)+'月'+this.addZero(times.getDate())+'日';
          } else {
            time =times.getFullYear()+type+this.addZero(times.getMonth()+1)+type+this.addZero(times.getDate());
          }
          return time;
     }
    static getAllTimes(timestamp,type) {
           let times = new Date(parseInt(timestamp) * 1000);
           let time;
           if (arguments.length == 1) {
             time = times.getFullYear()+'年'+this.addZero(times.getMonth()+1)+'月'+this.addZero(times.getDate())+'日';
           } else {
             time =times.getFullYear()+type+this.addZero(times.getMonth()+1)+type+this.addZero(times.getDate());
           }
           time = time + " " + this.addZero(times.getHours()) + ":" + this.addZero(times.getMinutes())+ ":" + this.addZero(times.getSeconds());
           return time;
    }

}
