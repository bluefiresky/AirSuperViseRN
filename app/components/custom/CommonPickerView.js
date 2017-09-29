/**
* Created by wuran on 17/06/26.
* 错误提示页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, Animated, InteractionManager } from "react-native";

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

import {Actions} from "react-native-router-flux";
import Picker from 'react-native-wheel-picker'

const MarginTop = W/3;
const ComponentW = W - 100;
const ComponentH = 0.4*H;
const ButtonPadding = 15;
const ButtonW = (ComponentW - 50)/2;
const ButtonH = 33;
const PickerH = ComponentH - ButtonH - ButtonPadding - 20;
const PickerW = ComponentW - 20;

class CommonPickerView extends React.Component {

  constructor(props){
    super (props);
    this.state = {
        offset: new Animated.Value(H),
        data: props.data,
        selectedIndex:props.selectedIndex? props.selectedIndex : 0,
    };

    this._closeCallback = this._closeCallback.bind(this);
    this._confirm = this._confirm.bind(this);
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
    let { offset, selectedIndex, data } = this.state;

    return (
      <Animated.View style={[styles.container, {transform: [{translateY: offset}]}]}>
        <View style={{width:ComponentW, height:ComponentH, marginTop:MarginTop, backgroundColor:'white', borderRadius:10}}>

          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Picker
              style={{width:PickerW, height:PickerH}}
              selectedValue={selectedIndex}
              itemStyle={{color:mainTextGreyColor, fontSize:16}}
              onValueChange={(index) => this.setState({selectedIndex:index}) }>
              {data.map((value, i) => (
                <Picker.Item label={value} value={i} key={i}/>
              ))}
            </Picker>
          </View>

          <View style={{justifyContent:'center', paddingBottom:ButtonPadding, flexDirection:'row'}} >
            <XButton title={'取消'} onPress={this._closeModal.bind(this, this._closeCallback)} style={{width:ButtonW, height:ButtonH, backgroundColor:'transparent', borderColor:borderColor, borderWidth:StyleSheet.hairlineWidth}} textStyle={{color:mainColor}}/>
            <XButton title={'确认'} onPress={this._closeModal.bind(this, this._confirm)} style={{width:ButtonW, height:ButtonH, marginLeft:10}}/>
          </View>
        </View>
      </Animated.View>
    );
  }

  /** 私有方法 */
  _closeModal(callback) {
    Animated.timing(this.state.offset, {
      duration: 200,
      toValue: H
    }).start(callback);
  }

 _closeCallback(){
   Actions.pop();
 }

 _confirm(){
   Actions.pop();
   if(this.props.modalCallback) this.props.modalCallback(this.state.data[this.state.selectedIndex], this.state.selectedIndex);
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

module.exports.CommonPickerView = CommonPickerView;
