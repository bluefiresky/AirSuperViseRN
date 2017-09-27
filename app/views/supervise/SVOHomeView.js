/**
* Created by wuran on 17/06/26.
* 安全监管首页-官方(Official)
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const HeaderH = H/3;
const PaddingHorizontal = 10;
const HeaderIconW = W/3 - 60;
const EntryItemH = 70;
const EntryItemIconW = 40;

const MainIcon1 = require('./image/icon-check-data.png')
const MainIcon2 = require('./image/icon-generate-check-record.png')
const MainIcon3 = require('./image/icon-history.png')

class SVOHomeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: {}
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      this._getProfile();
    })
  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderHeader(data)}
          {this.renderEntry()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderHeader(data){
    return(
      <View style={{backgroundColor:mainColor, height:HeaderH}}>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style={{height:HeaderIconW, width:HeaderIconW, borderRadius:HeaderIconW/2, backgroundColor:'white'}} />
            <View style={{marginTop:-5, height:16, backgroundColor:'rgb(255, 166, 77)', borderRadius:8, paddingHorizontal:8, justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontSize:12, color:'white', includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>民警</Text>
            </View>
          </View>
          <View style={{flex:2, justifyContent:'center', paddingRight:20}}>
            <Text style={styles.headerTextMain}>警员姓名：{data.policeName}</Text>
            <Text style={[styles.headerTextMain, {marginTop:10}]}>警员编号：{data.phoneNum}</Text>
            <Text style={[styles.headerTextMain, {marginTop:10}]}>所属部门：{data.policeDeptName}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row', paddingVertical:15}}>
          <Text style={styles.headerTextSub}>{data.policeMonthCounts}<Text style={styles.headerTextSubTitle}>{'\n'}本月提交总数</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{data.policeYearCounts}<Text style={styles.headerTextSubTitle}>{'\n'}年度提交总数</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{data.policeReviewCounts}<Text style={styles.headerTextSubTitle}>{'\n'}待复查数</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{data.policeModifyCounts}<Text style={styles.headerTextSubTitle}>{'\n'}待整改数</Text></Text>
        </View>
      </View>
    )
  }

  renderEntry(){
    return(
      <View style={{margin:PaddingHorizontal, backgroundColor:'white'}}>
        {this.renderEntryItem(MainIcon1, '查看数据表', 0)}
        <View style={{height:1, backgroundColor:borderColor, marginHorizontal:30}} />
        {this.renderEntryItem(MainIcon2, '生成检查记录单', 1)}
        <View style={{height:1, backgroundColor:borderColor, marginHorizontal:30}} />
        {this.renderEntryItem(MainIcon3, '历史检查记录', 2)}
      </View>
    )
  }

  renderEntryItem(icon, title, type){
    return(
      <TouchableOpacity onPress={this._onPress.bind(this, type)} activeOpacity={0.8} style={{flexDirection:'row', height:EntryItemH, alignItems:'center', justifyContent:'center'}}>
        <Image source={icon} style={{width:EntryItemIconW, height:EntryItemIconW, resizeMode:'contain'}} />
        <Text style={{marginLeft:20, fontSize:18, color:mainTextGreyColor, width:150}}>{title}</Text>
      </TouchableOpacity>
    )
  }

  /** Private **/
  _onPress(type){
    if(type === 0){
      Toast.showShortCenter('待开发')
    }else if(type === 1){
      this.setState({loading:true});
      NativeModules.BaiduMapModule.location().then(res => {
        this.setState({loading:false})
        console.log(' the BaiduMapModule location res -->> ', res);
        if(res && res.address){
          Actions.svoInspectedMerchant({location:res})
        }else{
          Toast.showShortCenter('定位失败')
        }
      })
    }else if(type === 2){
      Actions.svoHistoryCheckIn()
    }
  }

  _getProfile(){
    if(global.superviseProfile){
      this.setState({loading:false, data:global.superviseProfile})
    }else{
      this.props.dispatch( create_service(Contract.POST_GET_SUPERVISE_USER_INFO, {}))
        .then( res => {
          if(res){
            this.setState({loading:false, data:res.entity})
          }else{
            this.setState({loading:false})
          }
        })
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  },
  headerTextMain:{
    color:'white',
    fontSize:18
  },
  headerTextSub:{
    flex:1,
    color:'white',
    fontSize:16,
    textAlign:'center',
    lineHeight:20
  },
  headerTextSubTitle:{
    fontSize:12
  }
});

const ExportView = connect()(SVOHomeView);

module.exports.SVOHomeView = ExportView
