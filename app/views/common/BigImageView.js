/**
* Created by wuran on 17/06/26.
* 错误提示页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, Animated } from "react-native";

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor } from '../../configs/index.js';/** 自定义配置参数 */

import {Actions} from "react-native-router-flux";

class BigImageView extends React.Component {

  constructor(props){
    super (props);
    this.state = {
        offset: new Animated.Value(H),
        source: props.source ,
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
        <TouchableOpacity activeOpacity={1} style={{width:W, height:H}} onPress={this._closeModal.bind(this)}>
          <Image source={this.state.source} style={{width:W, height:H, resizeMode:'contain'}} />
        </TouchableOpacity>
      </Animated.View>
    );
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
