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
    this._onSearchTextChanged = this._onSearchTextChanged.bind(this);
    this._submit = this._submit.bind(this);
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
          {this.renderResultItem('证件编号：', data.serialNumber)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('持证人员：', data.realname)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('联系方式：', data.phone)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('所属单位：', data.organizationName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('可执勤区域：', data.passArea)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('证件积分：', data.score)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderPhotoItem(data.headImgUrl)}
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
        <TouchableOpacity activeOpacity={0.8} enabled={false}>
          <Image source={photo} style={{width:PhotoW, height:PhotoW, resizeMode:'contain'}} />
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
    if(this.state.result){
      Actions.cfInspectRegister({searchProfile:this.state.result})
    }else{
      Toast.showShortCenter('请先查询获取被检查人信息')
    }
  }

  _onSearchTextChanged(text){
    this.setState({searchContent:text})
  }

  _search(content){
    if(content) {
      this.setState({loading:true});
      this.props.dispatch( create_service(Contract.POST_GET_CERTIFICATE_USER_INFO_BY_SERIANUMBER, {serialNumber:content}))
        .then( res => {
          if(res){
            let { occupation, paperworkStatus, realname, serialNumber, organizationName, score, passArea, deadline, phone, headImgUrl } = res.entity;
            let image = headImgUrl? {uri:headImgUrl}:null;
            this.setState({loading:false, result:{serialNumber, realname, phone, organizationName, passArea, score, headImgUrl:image}})
          }else{
            this.setState({loading:false})
          }
        })
    }else {
      Toast.showShortCenter('证件编号不能为空')
    }
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
