/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const TitleH = Platform.select({ android: 50, ios: 70 });
const TitleMarginTop = Platform.select({ android: 0, ios: 20 });
const PaddingHorizontal = 10;
const HeaderH = 100;
const HeaderSubH =70;
const HeaderImageW = (HeaderH - HeaderSubH)*2;
const HeaderImageL = (W - HeaderImageW)/2;
const HeaderImageRadius = (HeaderImageW)/2;

const HeaderSubW = (W - PaddingHorizontal)
const HeaderSubPaddingTop = HeaderImageW/2 + 5;

const EntryItemH = 50;

const ArrowRight = require('./image/icon-arrow-right.png');

class PersonalTab extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: null
    }
  }

  componentDidMount(){
    this.setState({loading: true})
    let self = this;
    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading:false, data:{name:'你猜'}})
      }, 1000);
    })
  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        {this.renderTitle()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderHeader(data)}
          <View style={{height:10}} />
          {this.renderEntryItem(null, '我的检查单')}
          {this.renderEntryItem(null, '证件审核记录')}
          {this.renderEntryItem(null, '证件扣分记录')}
          {this.renderEntryItem(null, '消防网上预约记录')}
          {this.renderEntryItem(null, '新机场入场单位资质审核记录')}
          {this.renderEntryItem(null, '空防新入场单位资质审核记录')}
          {this.renderEntryItem(null, '历史违法举报')}
          {this.renderLoginButton()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderTitle(){
    return(
      <View style={{height:TitleH, backgroundColor:mainColor, justifyContent:'center', alignItems:'center', paddingHorizontal:PaddingHorizontal, paddingTop:TitleMarginTop}}>
        <Text style={{fontSize:20, color:'white'}}>个人中心</Text>
      </View>
    )
  }

  renderHeader(data){
    return(
      <View style={{height:HeaderH}}>
        <View style={{flex:1, backgroundColor:mainColor}} />
        <View style={{height:30}} />
        <View style={{position:'absolute', bottom:0, left:PaddingHorizontal, right:PaddingHorizontal, backgroundColor:'white', height:HeaderSubH, borderRadius:5, alignItems:'center', paddingTop:HeaderSubPaddingTop}}>
          <Text style={{fontSize:16, color:mainTextGreyColor}}>{data?data.name:null}</Text>
        </View>
        <View style={{position:'absolute', width:HeaderImageW, height:HeaderImageW, left:HeaderImageL, borderRadius:HeaderImageRadius, backgroundColor:'lightskyblue'}}>
        </View>
      </View>
    )
  }

  renderEntryItem(icon, title){
    return(
      <TouchableOpacity activeOpacity={0.8} style={{backgroundColor:'white'}}>
        <View style={{height:EntryItemH, flexDirection:'row', paddingHorizontal:PaddingHorizontal, alignItems:'center'}}>
          <View style={{marginLeft:20, width:30, height:30, backgroundColor:'lightskyblue'}} />
          <Text style={{marginLeft:20, fontSize:16, color:mainTextGreyColor, flex:1}}>{title}</Text>
          <Image source={ArrowRight} style={{width:14, height:14, resizeMode:'contain'}} />
        </View>
        <View source={ArrowRight} style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginLeft:PaddingHorizontal+40+30}} />
      </TouchableOpacity>
    )
  }

  renderLoginButton(){
    return(
      <View style={{marginVertical:10, height:100, alignItems:'center', justifyContent:'center', backgroundColor:'white'}}>
        <XButton onPress={this._logout.bind(this)} title={'退出登录'} style={{height:40, width:W-100, borderRadius:20}} />
      </View>
    )
  }

  /** 私有方法 */
  _logout(){
    this.setState({loading:true})
    this.props.dispatch( create_service(Contract.POST_USER_LOGOUT, {}))
      .then( res => {
        this.setState({loading:false});
        Actions.login({type:'reset'});
      })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(PersonalTab);

module.exports.PersonalTab = ExportView;
