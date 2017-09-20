/**
* Created by wuran on 17/06/26.
* 错误提示页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, Animated } from "react-native";

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

import {Actions} from "react-native-router-flux";

const MarginTop = W/3
const ComponentW = W - 100;
const ComponentH = (3 * W)/5
const IconH = 0.4 * ComponentH;
const IconW = (3*ComponentW)/4;
const ContentPaddingTop = IconH/2;
const ContentH = ComponentH - ContentPaddingTop;
const ButtonW = ComponentW - 30;
const ShowContent = {
  submit:{ icon:require('./image/icon-submit-success.png'), title:'举报成功', content:'提交成功，请耐心等待审核', textAlign:'left' },
  certificateLost:{ icon:require('./image/icon-submit-success.png'), title:'', content:'您的临时证件挂失申请已经提交成功，相应的证件状态已经变更为挂失', textAlign:'center' },
  applyReInspect:{ icon:require('./image/icon-submit-success.png'), title:'', content:'您的复议申请已经提交成功\n请等待审核', textAlign:'center' },
  reportPosting:{ icon:require('./image/icon-submit-success.png'), title:'', content:'恭喜您！您的违法举报已经提交成功\n感谢您的参与', textAlign:'center' },
  submit1:{ icon:require('./image/icon-submit-success.png'), title:'提交成功', content:'', textAlign:'center' },
}

class SuccessView extends React.Component {

  constructor(props){
    super (props);
    this.state = {
        offset: new Animated.Value(H),
        IconSource: ShowContent[props.successType?props.successType:'submit']
    };

    this._closeCallback = this._closeCallback.bind(this);
  }

  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 200,
      toValue: 0
    }).start();
  }

  componentWillUnmount(){
    // console.log(' SuccessView and execute componentWillUnmount');
  }

  render(){
    let { IconSource } = this.state;

    return (
      <Animated.View style={[styles.container, {transform: [{translateY: this.state.offset}]}]}>
        <View style={{ width:ComponentW, height:ComponentH, alignItems:'center', justifyContent:'flex-end', marginTop:MarginTop}}>
          <View style={{width:ComponentW, height:ContentH, backgroundColor:'white', borderRadius:10, paddingTop:ContentPaddingTop, paddingHorizontal:15}}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontSize:18, color:mainTextColor}}>{IconSource.title}</Text>
              <Text style={{fontSize:15, color:mainTextGreyColor, marginTop:15, textAlign:IconSource.textAlign}}>{IconSource.content}</Text>
            </View>
            <View style={{flex:1, justifyContent:'flex-end', paddingBottom:10}} >
              <XButton title={'确定'} onPress={this._closeModal.bind(this)} style={{alignSelf:'center', width:ButtonW}}/>
            </View>
          </View>
          <Image source={IconSource.icon} style={{width:IconW, height:IconH, resizeMode:'contain', position:'absolute', top:0}} />
        </View>
        </Animated.View>
    );
  }

  /** 私有方法 */
  _closeModal() {
    Animated.timing(this.state.offset, {
      duration: 200,
      toValue: H
    }).start(this._closeCallback);
  }

 _closeCallback(){
   Actions.pop();
   if(this.props.modalCallback) this.props.modalCallback();
 }

}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:"rgba(52,52,52,0.5)",
        alignItems: "center",
    },
});

module.exports.SuccessView = SuccessView;
