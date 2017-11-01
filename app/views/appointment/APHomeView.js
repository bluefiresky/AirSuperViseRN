/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Swiper from 'react-native-swiper';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const ADH = W*320/750;
const PaddingHorizontal = 10;
const MainEntryItemPadding = W/6;

const CoverAD = require('./image/cover-home-ad.jpg');
const MainIcon1 = require('./image/icon-xiaofang-appointment.png');
const MainIcon2 = require('./image/icon-kongfang-auditing.png');
const MainIcon3 = require('./image/icon-new-apply.png');

class APHomeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
    }
  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderAD()}
          {this.renderMainEntry()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderAD(){
    return(
      <View style={{height:ADH}}>
        <Swiper paginationStyle={{bottom:10}}  autoplay={true} autoplayTimeout={3}>
          <Image key={1} style={{width:W,height:ADH}} source={CoverAD}/>
          <Image key={2} style={{width:W,height:ADH}} source={CoverAD}/>
          <Image key={3} style={{width:W,height:ADH}} source={CoverAD}/>
        </Swiper>
      </View>
    )
  }

  renderMainEntry(){
    return(
      <View style={{backgroundColor:'white', margin:PaddingHorizontal}}>
        <TouchableOpacity activeOpacity={0.8} style={styles.mainEntryItem} onPress={this._mainEntryPress.bind(this, 0)}>
          <Image source={MainIcon1} style={styles.mainEntryItemImage} />
          <Text style={styles.mainEntryItemText}>消防网上预约办理</Text>
        </TouchableOpacity>
        <View style={{height:1, backgroundColor:borderColor, marginHorizontal:20}}/>
        <TouchableOpacity activeOpacity={0.8} style={styles.mainEntryItem} onPress={this._mainEntryPress.bind(this, 1)}>
          <Image source={MainIcon2} style={styles.mainEntryItemImage} />
          <Text style={styles.mainEntryItemText}>空防新入场单位资质审核</Text>
        </TouchableOpacity>
        <View style={{height:1, backgroundColor:borderColor, marginHorizontal:20}}/>
        <TouchableOpacity activeOpacity={0.8} style={styles.mainEntryItem} onPress={this._mainEntryPress.bind(this, 2)}>
          <Image source={MainIcon3} style={styles.mainEntryItemImage} />
          <Text style={styles.mainEntryItemText}>新机场车辆通行证申办</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** Private **/
  _mainEntryPress(type){
    if(type === 0){
      Actions.apFireControlTypes();
    }else if(type === 1){
      Actions.apAirMerchantCheck();
    }else if(type === 2){
      Actions.apCertificateApplyHome();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  mainEntryItem:{
    height:80,
    flexDirection:'row',
    paddingLeft:MainEntryItemPadding,
    alignItems:'center'
  },
  mainEntryItemImage:{
    width:40,
    height:40,
    resizeMode:'contain'
  },
  mainEntryItemText:{
    marginLeft:20,
    fontSize:16,
    color:mainTextColor
  }
});

const ExportView = connect()(APHomeView);

module.exports.APHomeView = ExportView
