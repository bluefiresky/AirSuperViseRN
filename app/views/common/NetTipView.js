/**
* Created by wuran on 17/06/26.
* 错误提示页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, Animated, Linking } from "react-native";

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */

import {Actions} from "react-native-router-flux";

const ContentW = (W - 40*2);
const ContentH = 150;


const Types = {
  forceUpdate:{content:{color:mainTextGreyColor, fontSize:16, text:''}, right:{label:'立即更新', press:null}},

}
class NetTipView extends React.Component {

  constructor(props){
    super (props);
    this.state = {
        offset: new Animated.Value(H)
    };

    this._closeCallback = this._closeCallback.bind(this);
    this._closeModal = this._closeModal.bind(this);

    this._currentType = this._convertToTypeObj(props.tipType, props.content);
  }

  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 300,
      toValue: 0
    }).start();
  }

  componentWillUnmount(){
    console.log(' ErrorView and execute componentWillUnmount');
  }

  render(){
    return (
      <Animated.View style={[styles.container, {transform: [{translateY: this.state.offset}]}]}>
        <View style={{ width:ContentW, height:ContentH, backgroundColor:"white", borderRadius:10 }}>
          {this.renderContent(this._currentType.content)}
          <View style={{height:1, backgroundColor:borderColor}} />
          {this.renderButton(this._currentType.left, this._currentType.right)}
        </View>
        </Animated.View>
    );
  }

  renderContent(content){
    return(
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text style={{color:content.color, fontSize:content.fontSize}}>{content.text}</Text>
      </View>
    )
  }

  renderButton(left, right){
    return(
      <View style={{flexDirection:'row', height:40}}>
        {this.renderLeftButton(left)}
        <TouchableOpacity onPress={right.press} activeOpacity={0.8} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:mainTextGreyColor, fontSize:15}}>{right.label}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderLeftButton(left){
    if(!left) return null;

    return(
      <View style={{flex:1}} >
        <TouchableOpacity onPress={this.pressEventArray[left.press]} activeOpacity={0.8} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:mainTextGreyColor, fontSize:15}}>{left.label}</Text>
        </TouchableOpacity>
        <View style={{width:1, backgroundColor:borderColor}} />
      </View>
    )
  }

  /** 私有方法 */
  _closeModal() {
    Animated.timing(this.state.offset, {
      duration: 300,
      toValue: H
    }).start(this._closeCallback);
  }

 _closeCallback(){
   Actions.pop();
   if(this.props.callback) this.props.callback();
 }

 // 打开地图：Linking.openURL("geo:37.2122 , 12.222")
 // 打电话：Linking.openURL("tel:123456789552")
 // 打开网站:Linking.openURL("http://www.baidu.com")
 // 发送短信:Linking.openURL("smsto:10086")
 // 发送邮件：Linking.openURL("mailto:**********@qq. com")
 _makePhone(phone){
   Linking.openURL(`tel:${phone}`);
 }

 _goWeb(url){
   Linking.openURL(url)
 }

 _convertToTypeObj(tipType, content){
  let current = Types[tipType];
  if(tipType === 'forceUpdate'){
    current.content.text = content.text;
    current.right.press = this._goWeb.bind(this, content.url);
  }

  return current;
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
        justifyContent: "center",
        alignItems: "center",
    },
});

module.exports.NetTipView = NetTipView;
