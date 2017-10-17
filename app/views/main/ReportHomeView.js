/**
* Created by wuran on 17/06/26.
* 违法举报-首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Swiper from 'react-native-swiper';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const ADH = W*320/750;
const EntryItemImageW = (W/3)/3;
const ButtonW = W - 30*2;

const CoverAD = require('./image/cover-home-ad.jpg');
const EntryIcon1 = require('./image/icon-report-posting.png');
const EntryIcon2 = require('./image/icon-report-history.png');
const EntryIcon3 = require('./image/icon-report-order.png');

class ReportHomeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
    }

    this._goPosting = this._goPosting.bind(this);
  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderAD()}
          {this.renderEntry()}
          {this.renderIntroduction()}
          <View style={{height:50}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderAD(){
    return(
      <View style={{height:ADH}}>
        <Swiper showsButtons={false} paginationStyle={{bottom:10}}>
          <Image key={1} style={{width:W,height:ADH}} source={CoverAD}/>
          <Image key={2} style={{width:W,height:ADH}} source={CoverAD}/>
          <Image key={3} style={{width:W,height:ADH}} source={CoverAD}/>
        </Swiper>
      </View>
    )
  }

  renderEntry(){
    return(
      <View style={{backgroundColor:'white', paddingVertical:20, marginTop:10}}>
        <View style={{flexDirection:'row', marginBottom:20}}>
          {this._renderEntryItem(EntryIcon1, '我要举报', this._goPosting)}
          {this._renderEntryItem(EntryIcon2, '历史举报', this._goHistory)}
          {this._renderEntryItem(EntryIcon3, '举报排名', null)}
        </View>
        <View style={{height:1, backgroundColor:borderColor, marginHorizontal:20}} />
        <XButton onPress={this._makePhone110} title='紧急情况，请点击此处，直接拨打110' textStyle={{color:'red'}} style={{height:40, borderColor:'red', width:ButtonW, borderRadius:20, backgroundColor:'transparent', borderWidth:StyleSheet.hairlineWidth, alignSelf:'center', marginTop:20}} />
      </View>
    )
  }

  _renderEntryItem(icon, label, press){
    return(
      <TouchableOpacity onPress={press} activeOpacity={0.8} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Image source={icon} style={{width:EntryItemImageW, height:EntryItemImageW, resizeMode:'contain'}}/>
        <Text style={{color:mainTextColor, fontSize:16, marginTop:10}}>{label}</Text>
      </TouchableOpacity>
    )
  }

  renderIntroduction(){
    return(
      <View style={{height:150, backgroundColor:'white', marginTop:10}}>
      </View>
    )
  }

  /** Private **/
  _goPosting(){
    this.setState({loading:true})
    NativeModules.BaiduMapModule.location().then(res => {
      this.setState({loading:false})
      // console.log(' the BaiduMapModule location res -->> ', res);
      if(res && res.address){
        Actions.reportPosting({location:res})
      }else{
        Toast.showShortCenter('定位失败, 请确认手机的定位功能开启')
      }
    })
  }

  _goHistory(){
    Actions.reportHistory();
  }

  _makePhone110(){
    Actions.tip({tipType:'makePhone110'})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(ReportHomeView);

module.exports.ReportHomeView = ExportView
