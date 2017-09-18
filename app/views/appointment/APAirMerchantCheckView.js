/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, inputLeftColor, inputRightColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, Input, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 100;
const PaddingHorizontal = 20;
const InputH = 45;
const PhotoViewW = (W - PaddingHorizontal*2)/3
const PhotoW = PhotoViewW - 20;
const SubmitButtonW = W - (30 * 2);

const CameraIcon = require('./image/camera.png');

const CertificateTypes = [{label:'营业执照', code:'0'},{label:'纳税证明', code:'1'},{label:'证件3', code:'2'},{label:'证件4', code:'3'},{label:'证件5', code:'4'}];

class APAirMerchantCheckView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      currentCertificateTypeCodes:[CertificateTypes[0].code],
      pickerPhotos: [{photo:null},{photo:null},{photo:null},{photo:null},{photo:null},{photo:null}],
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false})
      }, 1000);
    })
  }

  render(){
    let { loading, currentCertificateTypeCodes, pickerPhotos } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderInput()}
          {this.renderCertificateTypes(currentCertificateTypeCodes)}
          {this.renderLine()}
          {this.renderPhotoPicker(pickerPhotos)}
          {this.renderSubmitButton()}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderInput(){
    return(
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Input label={'企业名称'} labelWidth={LabelW} placeholder={'请输入企业名称'} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
        <Input label={'企业法人'} labelWidth={LabelW} placeholder={'请输入企业法人'} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
        <Input label={'联系人姓名'} labelWidth={LabelW} placeholder={'请输入联系人姓名'} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
        <Input label={'联系方式'} labelWidth={LabelW} placeholder={'请输入联系方式'} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
      </View>
    )
  }

  renderCertificateTypes(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, backgroundColor:'white', paddingBottom:10, minHeight:InputH}}>
        <Text style={[styles.starStyle,{marginTop:12}]}><Text style={styles.labelStyle}>证件类型</Text></Text>
        {this._renderCertificateTypesItem(current)}
      </View>
    )
  }

  _renderCertificateTypesItem(current){
    return(
      <View style={{flexDirection:'row', flex:1, flexWrap:'wrap'}}>
        {CertificateTypes.map((item, index) => {
          let show = (current.indexOf(item.code) != -1)? {back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor};
          return(
            <TouchableOpacity onPress={this._changeCertificateType.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, paddingHorizontal:8, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10, marginTop:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}><Text style={styles.labelStyle}>证件照片</Text></Text>
        {this._renderPhotoPickerItem(data)}
      </View>
    )
  }

  _renderPhotoPickerItem(data){
    return(
      <View style={{flexDirection:'row', marginTop:10, flexWrap:'wrap'}}>
        {data.map((item, index) => {
            return(
              <View key={index} style={{width:PhotoViewW, height:PhotoViewW, alignItems:'center', justifyContent:'center'}}>
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
      <View style={{height:80, alignItems:'center', justifyContent:'center', marginTop:30}}>
        <XButton title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
        <Text style={{color:placeholderColor, fontSize:14, marginTop:20}} onPress={this._goHistory}>历史记录查询</Text>
      </View>
    )
  }


  renderLine(){
    return(
      <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:PaddingHorizontal}} />
    )
  }

  /** Private **/
  _changeCertificateType(item, index){
    let code = item.code;
    let { currentCertificateTypeCodes } = this.state;
    let codeIndex = this.state.currentCertificateTypeCodes.indexOf(code);
    if(codeIndex != -1){
      currentCertificateTypeCodes.splice(codeIndex, 1);
    }else{
      currentCertificateTypeCodes.push(code);
    }

    this.setState({currentCertificateTypeCodes:currentCertificateTypeCodes})
  }

  _goHistory(){
    Actions.apAirMerchantCheckHistory();
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  starStyle:{
    color:'red',
    fontSize:14,
    width:LabelW
  },
  labelStyle:{
    color:inputLeftColor,
    fontSize:16
  },
});

const ExportView = connect()(APAirMerchantCheckView);

module.exports.APAirMerchantCheckView = ExportView
