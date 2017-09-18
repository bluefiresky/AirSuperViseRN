/**
* Created by wuran on 17/06/26.
* 证件管理-临时证件挂失
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, Input } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const LabelW = 100;
const InputH = 50;
const SubmitButtonW = W - (30 * 2);
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;

const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');

class CFTempCertificateLostView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      reason: null,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
    }
  }

  render(){
    let { loading, reason, pickerPhotos } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label={'姓名：'} value={'张三'} labelWidth={LabelW} placeholder={'请输入姓名'} noBorder={true} style={{height:InputH}}/>
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          <Input label={'证件编号：'} value={'010-674786257'} labelWidth={LabelW} placeholder={'请输入证件编号'} noBorder={true} style={{height:InputH}}/>
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          {this.renderAutoGrowing(reason)}
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          {this.renderPhotoPicker(pickerPhotos)}
          {this.renderSubmitButton()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderAutoGrowing(reason){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={{width: 150, color: inputLeftColor, fontSize: 16 }}>被检查简介：</Text>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={reason}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入挂失理由'}
          placeholderTextColor={placeholderColor}
          onChangeText={this._onIntroductionTextChange}
          minHeight={AutoGrowingInputMinH}
        />
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={{color:inputLeftColor, fontSize:16}}>照片采集：</Text>
        {this._renderPhotoPickerItem(data)}
      </View>
    )
  }

  _renderPhotoPickerItem(data){
    return(
      <View style={{flexDirection:'row', marginTop:10}}>
        {data.map((item, index) => {
            return(
              <View key={index} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity activeOpacity={0.8} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor, borderColor, borderWidth:1, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                  {
                    !item.photo?<Image source={CameraIcon} style={{width:30, height:25, resizeMode:'contain'}} />:
                    <Image source={item.photo} style={{width:PhotoW, height:PhotoW, resizeMode:'contain', backgroundColor:'lightskyblue'}} />
                  }

                </TouchableOpacity>
              </View>
            )
          })}
      </View>
    )
  }

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center'}}>
        <XButton title='提交' onPress={this._submit} style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }

  /** Private **/
  _submit(){
    Actions.success({successType:'certificateLost', modalCallback:()=>{
      Actions.pop();
    }});
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  autoTextInput:{
    marginTop:15,
    fontSize:15,
    padding:5,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:borderColor,
    backgroundColor:'#FBFBFE',
    includeFontPadding:false,
    textAlign:'left',
    textAlignVertical:'top'
  }
});

const ExportView = connect()(CFTempCertificateLostView);

module.exports.CFTempCertificateLostView = ExportView
