/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableOpacity,Platform,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import SignatureCapture from 'react-native-signature-capture';
import {Actions} from "react-native-router-flux";
import Orientation from 'react-native-orientation';

import { W, H, mainColor, mainBackColor} from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const MarginTitle = Platform.select({ android: 0, ios: 22 });
const IsIos = Platform.OS === 'ios';
const ButtonW = (W - 60)/3

const isIos = Platform.select({ android:false, ios:true })

class SignatureView extends Component {

  constructor(props){
    super(props);
    this.state = {
      viewMode: 'landscape',
      show:false,
    }

    this.signData = null;
    this._onSaveEvent = this._onSaveEvent.bind(this);
    this._orientationDidChange = this._orientationDidChange.bind(this);
    this._onBackEvent = this._onBackEvent.bind(this);

  }

  componentWillMount(){
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentDidMount(){
    if(isIos){
      Orientation.lockToLandscapeRight();
    }else{
      this.setState({show:true})
    }
  }

  componentWillUnmount(){
    this._onBackEvent();
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingHorizontal:15, paddingVertical:10, marginTop:MarginTitle}}>
          <TouchableHighlight activeOpacity={0.8} style={styles.buttonStyle} onPress={() => { this._goBack() }} underlayColor={'transparent'}>
            <Text style={{color:mainColor, fontSize: 14}}>返回</Text>
          </TouchableHighlight>
          <View style={{width: 15}} />
          <TouchableHighlight activeOpacity={0.8} style={styles.buttonStyle} onPress={() => { this._resetSign() }} underlayColor={'transparent'}>
            <Text style={{color:mainColor, fontSize: 14}}>重置</Text>
          </TouchableHighlight>
          <View style={{flex:1}} />
          <TouchableHighlight activeOpacity={0.8} style={styles.buttonStyle} onPress={() => { this._saveSign() }} underlayColor={'transparent'}>
            <Text style={{color:mainColor, fontSize: 14}}>保存</Text>
          </TouchableHighlight>
        </View>

        {
          !this.state.show? <View style={{flex:1, backgroundColor:mainBackColor}} /> :
          <SignatureCapture
            style={{flex: 1}}
            ref={(ref)=>{ this.ref = ref }}
            onSaveEvent={this._onSaveEvent}
            saveImageFileInExtStorage={true}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={'landscape'}/>
        }

      </View>
    );
  }

  /** Private **/
  _orientationDidChange(orientation){
    // console.log('execute _orientationDidChange and the orientation -->> ', orientation);
    if (orientation === 'LANDSCAPE') {
      this.setState({show:true})
    }
  }

  _saveSign() {
    this.ref.saveImage();
  }

  _resetSign() {
    this.ref.resetImage();
  }

  _goBack() {
    this._onBackEvent();
    Actions.pop();
  }

  _onSaveEvent(result){
    if(this.signData) return;
    // console.log('SignatureView and the result -->> ', result);

    if(result && result.encoded) {
      this.signData = result.encoded;
      // this.signData = result.pathName;
      if(this.props.callback) this.props.callback(this.signData);
      this._onBackEvent();
      Actions.pop();
    }
  }

  _onBackEvent(){
    Orientation.removeOrientationListener(this._orientationDidChange)
    Orientation.lockToPortrait();
    console.log(' SignatureView execute _onBackEvent and has lockToPortrait');
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackColor,
  },
  buttonStyle:{
    height: 40,
    width: ButtonW,
    borderColor: mainColor,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const ExportView = connect()(SignatureView);

module.exports.SignatureView = ExportView
