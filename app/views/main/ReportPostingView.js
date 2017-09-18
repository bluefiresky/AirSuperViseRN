/**
* Created by wuran on 17/06/26.
* 违法举报-我要举报
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor, inputLeftColor, inputRightColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, Input } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 100;
const PaddingHorizontal = 20;
const SubmitButtonW = W - (30 * 2);
const InputH = 45;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');

const PostingTypes = [{label:'安全隐患举报', code:'0'},{label:'违法犯罪举报', code:'1'}];
const EmergentLevels = [{label:'非常紧急', code:'0'},{label:'紧急', code:'1'},{label:'一般', code:'2'}];

class ReportPostingView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      postingType: PostingTypes[0],
      emergentLevel: EmergentLevels[2],
      address:'我勒个去我也不知道'
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
    let { loading, postingType, emergentLevel, address, pickerPhotos } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} >
          {this.renderImportance(postingType, emergentLevel, address)}
          {this.renderUnimportance(pickerPhotos)}
          {this.renderSubmitButton()}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderImportance(postingType, emergentLevel, address){
    return(
      <View style={{marginTop:10, backgroundColor:'white'}}>
        {this.renderTypes(postingType)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderAutoGrowing(null)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderEmergentLevel(emergentLevel)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderCurrentAddress(address)}
      </View>
    )
  }

  renderTypes(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>举报类型：</Text></Text>
        {this._renderTypesItem(current)}
      </View>
    )
  }

  _renderTypesItem(current){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {PostingTypes.map((item, index) => {
          let show = current.code === item.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor}
          return(
            <TouchableOpacity onPress={this._changePostingType.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, paddingHorizontal:8, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderAutoGrowing(content){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={[styles.starStyle, {width:150}]}>*<Text style={styles.labelStyle}>填写违法信息：</Text></Text>
        </View>
        <AutoGrowingTextInput
          style={[styles.autoTextInput, {color:inputRightColor}]}
          value={content}
          underlineColorAndroid={'transparent'}
          placeholder={''}
          placeholderTextColor={placeholderColor}
          minHeight={AutoGrowingInputMinH}
          maxHeight={100}
        />
      </View>
    )
  }

  renderEmergentLevel(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>紧急程度：</Text></Text>
        {this._renderEmergentLevelItem(current)}
      </View>
    )
  }

  _renderEmergentLevelItem(current){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {EmergentLevels.map((item, index) => {
          let show = current.code === item.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor};
          return(
            <TouchableOpacity onPress={this._changeEmergent.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, paddingHorizontal:8, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderCurrentAddress(address){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>举报类型：</Text></Text>
        <Text style={{color:inputRightColor, fontSize:16}}>{address}</Text>
      </View>
    )
  }

  /**
  * 选填
  */
  renderUnimportance(pickerPhotos){
    return(
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, marginVertical:15, alignSelf:'center'}}>选填信息</Text>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderPhotoPicker(pickerPhotos)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人姓名：'} labelWidth={140} placeholder={'请输入举报人姓名'} noBorder={true} style={{height:InputH, paddingLeft:24}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人身份证号：'} labelWidth={140} placeholder={'请输入举报人身份证号'} noBorder={true} style={{height:InputH, paddingLeft:24}}/>
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}>*<Text style={styles.labelStyle}>举报照片：</Text></Text>
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
        <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }


  /** Private **/
  _changePostingType(item){
    this.setState({postingType:item})
  }

  _changeEmergent(item){
    this.setState({emergentLevel:item})
  }

  _submit(){
    Actions.success({successType:'reportPosting', modalCallback:()=>{
      Actions.pop();
    }})
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
  autoTextInput:{
    fontSize:15,
    padding:5,
    marginHorizontal:17,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:borderColor,
    backgroundColor:'#FBFBFE',
    includeFontPadding:false,
    textAlign:'left',
    textAlignVertical:'top',
    marginBottom:10,
  }
});

const ExportView = connect()(ReportPostingView);

module.exports.ReportPostingView = ExportView
