/**
* Created by wuran on 17/06/26.
* 错误提示页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, Animated } from "react-native";

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor } from '../../configs/index.js';/** 自定义配置参数 */

import {Actions} from "react-native-router-flux";

const OptionH = 50;

const CloseIcon = require('./image/icon-close.png');
const DeleteIcon = require('./image/icon-delete.png');

const MarginTop = Platform.select({android:20, ios:0})

class BigImageView extends React.Component {

  constructor(props){
    super (props);
    this.state = {
        offset: new Animated.Value(H),
        source: props.source,
        operation: props.operation,
        imageH: props.operation? (H - OptionH - MarginTop) : (H - MarginTop)
    };

    this._closeCallback = this._closeCallback.bind(this);
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
        <TouchableOpacity activeOpacity={1} style={{width:W, height:this.state.imageH}} onPress={this._closeModal.bind(this)}>
          <Image source={this.state.source} style={{width:W, height:this.state.imageH, resizeMode:'contain'}} />
        </TouchableOpacity>
        {this.renderOperation(this.state.operation)}
      </Animated.View>
    );
  }

  renderOperation(operation){
    if(!operation) return null;

    return(
      <View style={{width:W, height:OptionH, flexDirection:'row'}}>
        <TouchableOpacity onPress={this._closeModal.bind(this)}  activeOpacity={0.8} style={{height:OptionH, width:OptionH, alignItems:'center', justifyContent:'center'}}>
          <Image source={CloseIcon} style={{height:20, width:20, resizeMode:'contain', tintColor:'white'}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._centerPress.bind(this, operation.rePick)}  activeOpacity={0.8} style={{height:OptionH, flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'white', fontSize:16}}>重拍</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._rightPress.bind(this, operation.clear)} activeOpacity={0.8} style={{height:OptionH, width:OptionH, alignItems:'center', justifyContent:'center'}}>
          <Image source={DeleteIcon} style={{height:20, width:20, resizeMode:'contain', tintColor:'white'}}/>
        </TouchableOpacity>
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

 _rightPress(callback){
   if(callback) callback();
   this._closeModal();
 }

 _centerPress(callback){
   if(callback) callback();
   this._closeModal();
 }

}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:"rgba(52,52,52,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
});

module.exports.BigImageView = BigImageView;
