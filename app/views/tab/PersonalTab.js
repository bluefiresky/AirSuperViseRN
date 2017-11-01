/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { Version, W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
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

const HeaderIcon = require('./image/icon-header.png');
const ArrowRight = require('./image/icon-arrow-right.png');
const OrdersIcon = require('./image/icon-my-orders.png');
const CertificateIcon = require('./image/icon-my-certificate-records.png');
const ScoreIcon = require('./image/icon-my-score-rcords.png');
const AppointmentIcon = require('./image/icon-my-appointment-records.png');
const AirportIcon = require('./image/icon-my-new-airport-records.png');
const ReportIcon = require('./image/icon-my-report-records.png');
const AirportMerchantIcon = require('./image/icon-my-new-airport-merchant-records.png');


class PersonalTab extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: null
    }
  }

  componentDidMount(){
    // this.setState({loading: true})
    // let self = this;
    // InteractionManager.runAfterInteractions(() => {
    //   self.timer = setTimeout(function () {
    //     self.setState({loading:false, data:{name:'你猜'}})
    //   }, 100);
    // })
  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        {this.renderTitle()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderHeader(data)}
          <View style={{height:10}} />
          {this.renderEntryItem(OrdersIcon, '历史检查记录', 0, ['02'])}
          {this.renderEntryItem(CertificateIcon, '证件审核记录', 1, ['04'])}
          {this.renderEntryItem(ScoreIcon, '证件扣分记录', 2, ['04', '05'])}
          {this.renderEntryItem(AppointmentIcon, '消防网上预约记录', 3, ['01'])}
          {this.renderEntryItem(AirportIcon, '新机场入场单位资质审核', 4, ['06'])}
          {this.renderEntryItem(AirportMerchantIcon, '空防新入场单位资质申请记录', 5, ['01'])}
          {this.renderEntryItem(ReportIcon, '历史我要举报', 6, ['01'])}
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
          <Text style={{fontSize:16, color:mainTextGreyColor}}>{global.profile?global.profile.phoneNum:null}</Text>
        </View>
        <Image source={HeaderIcon} style={{position:'absolute', width:HeaderImageW, height:HeaderImageW, left:HeaderImageL, resizeMode:'contain'}} />
      </View>
    )
  }

  renderEntryItem(icon, title, type, roleNums){
    return(
      <TouchableOpacity onPress={this._onPressEntry.bind(this, type, roleNums)} activeOpacity={0.8} style={{backgroundColor:'white'}}>
        <View style={{height:EntryItemH, flexDirection:'row', paddingHorizontal:PaddingHorizontal, alignItems:'center'}}>
          <Image source={icon} style={{marginLeft:20, width:20, height:20, resizeMode:'contain'}} />
          <Text style={{marginLeft:20, fontSize:16, color:mainTextGreyColor, flex:1}}>{title}</Text>
          <Image source={ArrowRight} style={{width:14, height:14, resizeMode:'contain'}} />
        </View>
        <View source={ArrowRight} style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginLeft:PaddingHorizontal+40+30}} />
      </TouchableOpacity>
    )
  }

  renderLoginButton(){
    return(
      <View style={{marginVertical:10, height:100, alignItems:'center', justifyContent:'center'}}>
        <XButton onPress={this._logout.bind(this)} title={'退出登录'} style={{height:40, width:W-100, borderRadius:20}} />
        <Text style={{color:placeholderColor, fontSize:14, marginTop:10}}>版本号：{Version}</Text>
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

  _onPressEntry(type, roleNums){
    if(!global.profile) return null;

    let role = this._verifyEntryRole(global.profile.roleNums, roleNums)
    if(!role) Toast.showShortCenter('您暂无权限')
    else if(type == 0) Actions.svoHistoryCheckIn();
    else if(type == 1) Actions.cfInspectedRecords();
    else if(type == 2) Actions.cfScoreManager();
    else if(type == 3) Actions.apHistoryList();
    else if(type == 4) Actions.apCertificateCheckRecords();
    else if(type == 5) Actions.apCertificateApplyHistory();
    else if(type == 6)  Actions.reportHistory();
  }

  _verifyEntryRole(source, targetList){
    if(source && source.length > 0){
      for(let i=0; i<source.length; i++){
        let r = source[i];
        if(targetList.indexOf(r.roleNum) != -1) return r;
      }

      return false;
    }else{
      return false;
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

const ExportView = connect()(PersonalTab);

module.exports.PersonalTab = ExportView;
