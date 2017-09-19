/**
* Created by wuran on 17/06/26.
* 安全监管首页-消防登记记录
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { CheckBox } from 'react-native-elements';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, inputRightColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, Input } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 80;
const PaddingHorizontal = 10;
const Margin = 0;
const AddPoliceButtonW = 40;
const AddPoliceInputW = (W - Margin * 2 - LabelW - AddPoliceButtonW - PaddingHorizontal*2)
const NameW = AddPoliceInputW/3;
const NameTextW = NameW - 20;
const SubmitButtonW = W - (30 * 2);
const InputH = 45;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const SignW = W - PaddingHorizontal*2 - 60 - 20;
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');
const DeleteIcon = require('./image/icon-search-delete.png');
const ArrowRight = require('./image/icon-arrow-right.png');

const CheckResults = [{label:'合格', code:'0'},{label:'不合格', code:'1'}];
const Sendings = [{label:'不流转', code:'0'},{label:'流转', code:'1'}];
const EmergentLevels = [{label:'非常紧急', code:'0'},{label:'紧急', code:'1'},{label:'一般', code:'2'}];

class SVOFireCheckInView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      checkPolices: [1,2,3,4],
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      currentCheckResult: CheckResults[0],
      refuse: false,
      currentSending: Sendings[0],
      notStandStardDetail: null,
      currentEmergentLevel: EmergentLevels[2],
      changedDate: null,
      templet: null,
      sendCopyMerchant: null
    }

    this._onRefuseCheck = this._onRefuseCheck.bind(this);
    this._goSelectTemplet = this._goSelectTemplet.bind(this);
    this._onNotStandardDetailTextChange = this._onNotStandardDetailTextChange.bind(this);
    this._sendCopySearch = this._sendCopySearch.bind(this);
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
    let { loading, checkPolices, pickerPhotos, currentCheckResult, refuse, currentSending, notStandStardDetail, currentEmergentLevel, changedDate, templet, sendCopyMerchant  } = this.state;

    return(
      <View style={styles.container}>
        <View style={{flex:1, margin:Margin, backgroundColor:'white'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.renderCheckPolice(checkPolices)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderPhotoPicker(pickerPhotos)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderTempletSelect(templet)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderCheckResult(currentCheckResult)}
            {this.renderCheckResultNotStandard(notStandStardDetail, currentEmergentLevel, changedDate)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderSign(null, refuse)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            <Input label={'被检查人联系电话'} labelWidth={150} placeholder={'请输入被检查人身份电话'} noBorder={true} style={{height:InputH, paddingLeft:16}}/>
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderSendingCopySelect(sendCopyMerchant)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderSending(currentSending)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          </ScrollView>
          <View style={{flex:1}} />
          {this.renderSubmitButton()}
        </View>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderCheckPolice(data){
    return(
      <View style={{flexDirection:'row', paddingVertical:7, alignItems:'center', paddingHorizontal:PaddingHorizontal}}>
        <Text style={styles.starStyle}>*<Text style={styles.labelStyle}>检查民警</Text></Text>
        <View style={{width:AddPoliceInputW, flexWrap:'wrap', flexDirection:'row'}}>
          {
            data.map((item, index) => {
              return(
                <View key={index} style={{flexDirection:'row', height:30, width:NameW, alignItems:'center', justifyContent:'center'}}>
                  <View style={{width:NameTextW, height:20, borderRadius:10, alignItems:'center', justifyContent:'center', backgroundColor:mainBackColor}}>
                    <Text style={{fontSize:14, color:inputRightColor, includeFontPadding:false, textAlign:'justify', textAlignVertical:'center'}}>{'张三风'}</Text>
                  </View>
                  <TouchableOpacity style={{width:20, height:25}} >
                    <Image source={DeleteIcon} style={{width:10, height:10, resizeMode:'contain'}} />
                  </TouchableOpacity>
                </View>
              )
            })
          }
        </View>
        <TouchableOpacity activeOpacity={0.8} style={{width:AddPoliceButtonW, height:AddPoliceButtonW, alignItems:'center', justifyContent:'center'}}>
          <Image style={{height:25, width:25, backgroundColor:'lightskyblue'}} />
        </TouchableOpacity>
      </View>
    );
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}>*<Text style={styles.labelStyle}>现场照片</Text></Text>
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

  renderTempletSelect(content){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={styles.starStyle}>*<Text style={styles.labelStyle}>检查内容</Text></Text>
          <TouchableOpacity onPress={this._goSelectTemplet} activeOpacity={0.8} style={{flex:1, justifyContent:'center'}}>
            <Text style={{color:'red', fontSize:16}}>{content?'模板一：消防检查单':'选择'}</Text>
          </TouchableOpacity>
          {
            !content? null :
            <TouchableOpacity activeOpacity={0.8} style={{justifyContent:'center', paddingHorizontal:10}}>
              <Text style={{color:mainColor, fontSize:16}}>修改</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    )
  }


  renderCheckResult(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>检查结果</Text></Text>
        {this._renderCheckResultItem(current)}
      </View>
    )
  }

  _renderCheckResultItem(current){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {CheckResults.map((item, index) => {
          let show = current.code === item.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor}
          return(
            <TouchableOpacity onPress={this._changeCheckResult.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, width:50, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderSign(signImage, checked){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
        <Text style={[styles.starStyle, {width:120}]}>*<Text style={styles.labelStyle}>被检查人签名</Text></Text>
        <View style={{flexDirection:'row', paddingLeft:7, alignItems:'center', marginTop:10}}>
          <TouchableOpacity activeOpacity={0.8}>
            {
              !signImage? <View style={{width:SignW, height:60, backgroundColor:mainBackColor}} />:
              <Image source={signImage} style={{width:SignW, height:60, resizeMode:'contain'}} />
            }
          </TouchableOpacity>
          <CheckBox onPress={this._onRefuseCheck} checked={checked} containerStyle={styles.checkbox} textStyle={{marginLeft:5, marginRight:1, color: mainTextGreyColor}} title='拒签' checkedColor={mainColor} uncheckedColor={mainColor} />
        </View>
      </View>
    )
  }

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center'}}>
        <XButton title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }

  renderSending(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>是否流转</Text></Text>
        {this._renderSendingItem(current)}
      </View>
    )
  }

  _renderSendingItem(current){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {Sendings.map((item, index) => {
          let show = current?(current.code === item.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor}):{back:mainBackColor, text:mainTextGreyColor};
          return(
            <TouchableOpacity onPress={this._changeSending.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, width:50, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderCheckResultNotStandard(notStandStardDetail, currentEmergentLevel, changedDate){
    if(this.state.currentCheckResult.code == '1'){
      return(
        <View>
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this._renderEmergentLevel(currentEmergentLevel)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this._renderChangedDate(changedDate)}
        </View>
      )
    }
  }

  _renderEmergentLevel(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>紧急程度</Text></Text>
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
            <TouchableOpacity onPress={this._changeEmergent.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, width:70, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  _renderChangedDate(date){
    let show = date? {text:date, textColor:inputRightColor}:{text:'请选择整改时限', textColor:placeholderColor};
    return(
      <TouchableOpacity activeOpacity={0.8} style={{paddingHorizontal:PaddingHorizontal, flexDirection:'row', height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle,{color:'transparent'}]}>*<Text style={styles.labelStyle}>整改时间</Text></Text>
        <Text style={{color:show.textColor, fontSize:16, flex:1}}>{show.text}</Text>
        <Image source={ArrowRight} style={{width:16, height:16, resizeMode:'contain'}} />
      </TouchableOpacity>
    )
  }

  renderSendingCopySelect(content){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={[styles.starStyle, {color:'transparent'}]}>*<Text style={styles.labelStyle}>抄送单位</Text></Text>
          <TouchableOpacity onPress={this._sendCopySearch} activeOpacity={0.8} style={{flex:1, justifyContent:'center'}}>
            <Text style={{color:'red', fontSize:16}}>{content?content:'请选择抄送单位'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  /** Private **/
  _onRefuseCheck(){
    this.setState({refuse:!this.state.refuse});
  }

  _changeCheckResult(item){
    this.setState({currentCheckResult:item})
  }

  _changeSending(item){
    this.setState({currentSending:item})
  }

  _changeEmergent(item){
    this.setState({currentEmergentLevel:item})
  }

  _onNotStandardDetailTextChange(text){
    this.setState({notStandStardDetail:text})
  }

  _goSelectTemplet(){
    Actions.svoFireCheckInTempletWeb({url:'https://test.zhongchebaolian.com/app_test/test.html'})
    // this.setState({templet:'模板一'})
  }

  _sendCopySearch(){
    this.setState({sendCopyMerchant:'肯德基222'})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
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
  checkbox: {
    margin: 1,
    marginLeft: 1,
    marginRight: 1,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 1,
    borderRadius: 1,
    width:60,
    height:30,
    marginLeft:10
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

const ExportView = connect()(SVOFireCheckInView);

module.exports.SVOFireCheckInView = ExportView;
