/**
* Created by wuran on 17/06/26.
* 选择被检查人-官方
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, formLeftText, commonText, placeholderColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, Input, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 0;
const InputPaddingHorizontal = 20;
const CodeButtonW = 80;
const MobileInputW = W - CodeButtonW - PaddingHorizontal*2 - InputPaddingHorizontal;
const LocationInputW = W - PaddingHorizontal*2 - 20 - InputPaddingHorizontal;
const InputH = 50;
const PointType = [{name:'消防', code:0}, {name:'空防', code:1}, {name:'其他', code:2}];
const ButtonW = (W - PaddingHorizontal*2 - 20*3)/2;
const NavIcon = require('./image/icon-nav.png');
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

class SVOInspectedMerchantView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      CurrentPointTypeCode:0,
      merchant:{},
      introduction:null,
      point:null
    }

    this._search = this._search.bind(this);
    this._onPointTextChange = this._onPointTextChange.bind(this);
    this._onIntroductionTextChange = this._onIntroductionTextChange.bind(this);
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

  componentWillUnmount(){

  }

  render(){
    let { loading, merchant, introduction, point } = this.state;

    return(
      <View style={styles.container}>
        <View style={{flex:1, margin:PaddingHorizontal, backgroundColor:'white'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.renderMerchantInput(merchant.companyName)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderLocationInput()}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            <Input label={'详细地址'} labelWidth={100} placeholder={'请输入详细地址'} noBorder={true} style={{height:InputH}}/>
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderIntroduction(introduction)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderPoint(point)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
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
        <Input value={name} label={'被检查单位'} labelWidth={100} placeholder={'请输入被检查单位'} noBorder={true} style={{width:MobileInputW, height:InputH}}/>
        <TouchableOpacity onPress={this._search} activeOpacity={0.8} style={{height:30, width:CodeButtonW, backgroundColor:'rgb(255, 166, 77)', borderRadius:15, alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize:14, color:'white'}}>{name?'重新选择':'选择'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderLocationInput(){
    return(
      <TouchableOpacity style={{flexDirection:'row', alignItems:'center', paddingRight:InputPaddingHorizontal}}>
        <Input label={'检查地点'} editable={false} labelWidth={100} value={'你再猜猜'} noBorder={true} hasClearButton={false} style={{width:LocationInputW, height:InputH}}/>
        <Image source={NavIcon} style={{height:20, width:20, resizeMode:'contain'}} />
      </TouchableOpacity>
    )
  }

  renderIntroduction(introduction){
    return(
      <View style={{paddingHorizontal:InputPaddingHorizontal, paddingVertical:15}}>
        <Text style={{width: 100, color: formLeftText, fontSize: 16 }}>被检查简介</Text>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={introduction}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入被检查代为简介'}
          placeholderTextColor={placeholderColor}
          onChangeText={this._onIntroductionTextChange}
          minHeight={AutoGrowingInputMinH}
        />
      </View>
    )
  }

  renderPoint(point){
    return(
      <View style={{paddingHorizontal:InputPaddingHorizontal, paddingVertical:15}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{width: 100, color: formLeftText, fontSize: 16, marginTop:5 }}>检查要点</Text>
          {this.renderPointType()}
        </View>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={point}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入检查要点'}
          placeholderTextColor={placeholderColor}
          onChangeText={this._onPointTextChange}
          minHeight={AutoGrowingInputMinH}
        />
      </View>
    )
  }

  renderPointType(){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {PointType.map((pt, index) => {
          let show = this.state.CurrentPointTypeCode === pt.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor}
          return(
            <TouchableOpacity key={index} onPress={this._changePointType.bind(this, pt, index)} activeOpacity={0.8} style={{height:30, width:60, backgroundColor:show.back, borderRadius:15, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text}}>{pt.name}</Text>
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
    Actions.svoAirCheckIn();
  }

  _fireCheckIn(){
    Actions.svoFireCheckIn();
  }

  _resetTextInput() {
   this._textInput.clear();
   this._textInput.resetHeightToMin();
 }

 _changePointType(item, index){
   this.setState({CurrentPointTypeCode:item.code})
 }

 _onIntroductionTextChange(text){
   this.setState({introduction:text})
 }

 _onPointTextChange(text){
   this.setState({point:text})
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

const ExportView = connect()(SVOInspectedMerchantView);

module.exports.SVOInspectedMerchantView = ExportView
