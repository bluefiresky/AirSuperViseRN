/**
* Created by wuran on 17/06/26.
* 证件管理-持证人检查
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, InputPlaceholder, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const SearchButtonW = 80;
const InputW = W - 10*2 - SearchButtonW - 10;
const ItemH = 50;
const SubmitButtonW = W - (30 * 2);
const PhotoW = 100;

class CFInspectView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      searchContent: null,
      result: null,
    }

    this._search = this._search.bind(this);
  }

  render(){
    let { loading, searchContent, result } = this.state;

    return(
      <View style={styles.container}>
        <View style={{flex:1}}>
          {this.renderSearchInput(searchContent)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.renderResult(result)}
          </ScrollView>
          <View style={{flex:1}} />
          {this.renderSubmitButton()}
        </View>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderSearchInput(){
    return(
      <View style={{padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center'}}>
        <InputPlaceholder onChange={this._onSearchTextChanged} style={{paddingLeft:15, height:36, width:InputW, backgroundColor:mainBackColor, borderRadius:18, marginRight:10}} noBorder={true} placeholder={'请输入证件编号'}/>
        <TouchableOpacity onPress={this._search.bind(this, this.state.searchContent)} activeOpacity={0.8} style={{backgroundColor:'rgb(245, 181, 97)', height:36, width:SearchButtonW, borderRadius:18, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'white', fontSize:16}}>查询</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderResult(data){
    if(!data) return null;

    return(
      <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>查询结果</Text>
        <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        <View style={{paddingHorizontal:PaddingHorizontal}}>
          {this.renderResultItem('证件编号：', '758293740527340857')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('持证人员：', '张三')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('联系方式：', '123509809850')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('所属单位：', '公安分局')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('可执勤区域：', 'A/B')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('证件积分：', '8分')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderPhotoItem(null)}
        </View>
      </View>
    )
  }

  renderResultItem(label, content){
    return(
      <View style={{height:ItemH, flexDirection:'row', alignItems:'center'}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>{label}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16}}>{content}</Text>
      </View>
    )
  }

  renderPhotoItem(photo){
    return(
      <View style={{flexDirection:'row', paddingVertical:15}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>证件照片</Text>
        <TouchableOpacity activeOpacity={0.8} >
          <Image style={{width:PhotoW, height:PhotoW, resizeMode:'contain', backgroundColor:'lightskyblue'}} />
        </TouchableOpacity>
      </View>
    )
  }

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center'}}>
        <XButton onPress={this._submit} title='违规登记' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }

  /** Private **/
  _submit(){
    Actions.cfInspectRegister()
  }

  _onSearchTextChanged(text){
    this.setState({searchContent:text})
  }

  _search(content){
    this.setState({result:'123'})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(CFInspectView);

module.exports.CFInspectView = ExportView
