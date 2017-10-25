/**
* Created by wuran on 17/06/26.
* 选择被检查人-选择被检查单位
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, formLeftText, commonText, placeholderColor, mainTextGreyColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, Input, XButton, form_connector, ValidateMethods, InputAutoGrowing } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 0;
const InputPaddingHorizontal = 20;
const CodeButtonW = 80;
const MobileInputW = W - CodeButtonW - PaddingHorizontal*2 - InputPaddingHorizontal;
const LocationInputW = W - PaddingHorizontal*2 - 20 - InputPaddingHorizontal;
const InputH = 50;
const ButtonW = (W - PaddingHorizontal*2 - 20*3)/2;
const NavIcon = require('./image/icon-nav.png');
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const PointName = {'1':'消防', '2':'空防', '3':'其他'}

class SVOInspectedMerchantView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      CurrentPointTypeCode:0,
      merchant:{},
      location:props.location,
    }

    this._search = this._search.bind(this);
    this._airCheckIn = this._airCheckIn.bind(this);
    this._fireCheckIn = this._fireCheckIn.bind(this);
    this._checkSubmitData = this._checkSubmitData.bind(this);
  }

  render(){
    let { loading, merchant, location } = this.state;
    let { address } = this.props.fields;

    return(
      <View style={styles.container}>
        <View style={{flex:1, margin:PaddingHorizontal, backgroundColor:'white'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.renderMerchantInput(merchant.companyName)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderLocationInput(location)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            <InputAutoGrowing label={'详细地址'} {...address} maxLength={50} labelWidth={100} placeholder={'请输入详细地址'} noBorder={true} multiline={true} />
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderIntroduction(merchant.introduction)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:merchant.introduction?borderColor:'transparent'}} />
            {this.renderPoint(merchant.companyCheckList)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:merchant.companyCheckList?borderColor:'transparent'}} />
          </ScrollView>
          <View style={{flex:1}} />
          {this.renderSubmitButton()}
        </View>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderMerchantInput(name){
    return(
      <View style={{flexDirection:'row', alignItems:'center', paddingRight:InputPaddingHorizontal}}>
        <Input value={name} label={'被检查单位'} labelWidth={100} placeholder={'请选择被检查单位'} noBorder={true} style={{width:MobileInputW, height:InputH}} editable={false}/>
        <TouchableOpacity onPress={this._search} activeOpacity={0.8} style={{height:30, width:CodeButtonW, backgroundColor:'rgb(255, 166, 77)', borderRadius:15, alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize:14, color:'white'}}>{name?'重新选择':'选择'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderLocationInput(location){
    return(
      <TouchableOpacity activeOpacity={1} style={{flexDirection:'row', alignItems:'center', paddingRight:InputPaddingHorizontal, paddingVertical:15}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100, marginLeft:20}}>{'检查地点'}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16, flex:1, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{location.address}</Text>
        <Image source={NavIcon} style={{height:20, width:20, resizeMode:'contain'}} />
      </TouchableOpacity>
    )
  }

  renderIntroduction(introduction){
    if(!introduction) return null;

    return(
      <View style={{paddingHorizontal:InputPaddingHorizontal, paddingVertical:15}}>
        <Text style={{width: 100, color: formLeftText, fontSize: 16 }}>被检查简介</Text>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={introduction}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入被检查代为简介'}
          placeholderTextColor={placeholderColor}
          minHeight={AutoGrowingInputMinH}
          editable={false}
        />
      </View>
    )
  }

  renderPoint(points){
    if(!points) return null;
    let point = points[this.state.CurrentPointTypeCode];

    return(
      <View style={{paddingHorizontal:InputPaddingHorizontal, paddingVertical:15}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{width: 100, color: formLeftText, fontSize: 16, marginTop:5 }}>检查要点</Text>
          {this.renderPointType(points)}
        </View>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={point.checkDescribe}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入检查要点'}
          placeholderTextColor={placeholderColor}
          minHeight={AutoGrowingInputMinH}
          editable={false}
        />
      </View>
    )
  }

  renderPointType(points){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {points.map((pt, index) => {
          let show = this.state.CurrentPointTypeCode === index?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor}
          return(
            <TouchableOpacity key={index} onPress={this._changePointType.bind(this, pt, index)} activeOpacity={0.8} style={{height:30, width:60, backgroundColor:show.back, borderRadius:15, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text}}>{PointName[pt.checkType]}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center'}}>
        <XButton onPress={this._airCheckIn} title='空防检查单' style={{backgroundColor:mainColor, width:ButtonW, height:40, borderRadius:20}} />
        <View style={{width:15}} />
        <XButton onPress={this._fireCheckIn} title='消防检查单' style={{backgroundColor:mainColor, width:ButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }

  /** Private **/
  _search(){
    Actions.svoSearch({searchResult:(merchant) => {
      this.setState({merchant})
    }});
  }

  _airCheckIn(){
    let params = this._checkSubmitData();
    if(params) Actions.svoAirCheckIn(params);
  }

  _fireCheckIn(){
    let params = this._checkSubmitData();
    if(params) Actions.svoFireCheckIn(params);
  }

 _changePointType(item, index){
   this.setState({CurrentPointTypeCode:index})
 }

 _checkSubmitData(){
   let { merchant, location } = this.state;
   if(merchant.companyName){
     let { address } = this.props.form.getData();
     return {merchant, address, location};
   }else{
     Toast.showShortCenter('检查单位未选取');
   }
 }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  textInput: {
    paddingTop:0,
    fontSize: 16,
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 0,
    includeFontPadding: false,
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

/** post-提交所需数据配置 */
const fields = ['address']
const validate = (assert, fields) => {
  assert("address", ValidateMethods.required(), '请输入详细地址')
}

const ExportView = connect()(form_connector(SVOInspectedMerchantView, fields, validate));

module.exports.SVOInspectedMerchantView = ExportView
