/**
* Created by wuran on 17/06/26.
* 证件管理-违规登记
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { CheckBox } from 'react-native-elements';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, inputRightColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 80;
const PaddingHorizontal = 10;
const SubmitButtonW = W - (30 * 2);
const InputH = 45;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const SignW = W - PaddingHorizontal*2 - 60 - 20;
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');

class CFInspectRegisterView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      law: null,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      refuse: false,
      scroe: null
    }

    this._onRefuseCheck = this._onRefuseCheck.bind(this);
    this._goSelectLaw = this._goSelectLaw.bind(this);
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false})
      }, 100);
    })
  }

  render(){
    let { loading, law, pickerPhotos, refuse, score } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderLawSelect(law)}
          {this.renderScore(score)}
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          {this.renderPhotoPicker(pickerPhotos)}
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          {this.renderSign(null, refuse)}
          {this.renderSubmitButton()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderLawSelect(law){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white'}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={styles.starStyle}>*<Text style={styles.labelStyle}>法律条文</Text></Text>
          <TouchableOpacity onPress={this._goSelectLaw} activeOpacity={0.8} style={{flex:1, justifyContent:'center'}}>
            <Text style={{color:'red', fontSize:16}}>{law?'重新选择':'请选择检查依据的法律条文'}</Text>
          </TouchableOpacity>
        </View>
        {
          !law? null :
          <AutoGrowingTextInput
            style={[styles.autoTextInput, {color:placeholderColor}]}
            value={law}
            underlineColorAndroid={'transparent'}
            placeholder={''}
            placeholderTextColor={placeholderColor}
            minHeight={AutoGrowingInputMinH}
            maxHeight={100}
          />
        }
      </View>
    )
  }

  renderScore(score){
    if(!score) return null;

    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={[styles.starStyle]}>*<Text style={[styles.labelStyle]}>扣分分值</Text></Text>
          <Text style={{color:mainTextGreyColor, fontSize:14}}>{score}</Text>
        </View>
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
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

  renderSign(signImage, checked){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
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
        <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }


  /** Private **/
  _goSelectLaw(){
    // Actions.cfLawRecordsView();
    this.setState({law:'123', score:'15'})
  }

  _onRefuseCheck(){
    this.setState({refuse:!this.state.refuse});
  }

  _submit(){
    Actions.success({modalCallback:()=>{
      Actions.popTo('cfHome')
    }});
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  },
  starStyle:{
    color:'transparent',
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
    marginHorizontal:7,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:borderColor,
    backgroundColor:'#FBFBFE',
    includeFontPadding:false,
    textAlign:'left',
    textAlignVertical:'top',
    marginBottom:10,
  }
});

const ExportView = connect()(CFInspectRegisterView);

module.exports.CFInspectRegisterView = ExportView
