/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const Icon = require('./image/icon-submit-success.png');
const IconW = W/3;
const ButtonW = W - 60;

class AppointmentSuccessView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: props.record,
    }
  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        <Image source={Icon} style={{width:IconW, height:IconW, resizeMode:'contain', marginTop:30}} />
        <Text style={{color:mainTextColor, fontSize:18}}>您已预约成功！</Text>
        <Text style={{color:'red', fontSize:18, marginTop:15}}>预约号：{data.reservationNo}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16, marginTop:30, textAlign:'center', lineHeight:30}}>
          {`请您按时到现场后出示预约号即可\n通过绿色通道进行办理。\n若您无故爽约，将对后续业务办理产生影响。`}
        </Text>
        <XButton onPress={this._onPress} title='返回' style={{width:ButtonW, height:40, marginTop:50}} />
        <View style={{flex:1}} />
        <Text style={{color:mainTextGreyColor, fontSize:16, lineHeight:30, textAlign:'center', marginBottom:30}}>{`开始办理时间：\n工作日上午8:00-11:00  下午13:00-16:30`}</Text>
        <ProgressView show={loading} />
      </View>
    )
  }

  /** Private **/
  _onPress(){
    Actions.pop();
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
    alignItems:'center'
  }
});

const ExportView = connect()(AppointmentSuccessView);

module.exports.AppointmentSuccessView = ExportView
