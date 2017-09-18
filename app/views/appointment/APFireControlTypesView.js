/**
* Created by wuran on 17/06/26.
* 消防网上预约办理
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

const PaddingHorizontal = 20;
const ArrowRight = require('./image/icon-arrow-right-blue.png');

class APFireControlTypesView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentDidMount(){
    this.setState({loading:true});
    let self = this;
    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false})
      }, 1000);
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:'white'}}>
          <View style={{height:10, backgroundColor:mainBackColor}} />
          {this.renderTypesItem('建设工程消防设计审核')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:PaddingHorizontal}} />
          {this.renderTypesItem('建设工程竣工验收消防备案指南')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:PaddingHorizontal}} />
          {this.renderTypesItem('建设工程消防设计审核')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:PaddingHorizontal}} />
          {this.renderTypesItem('公众聚集场所使用，营业前消防安全检查指南')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:PaddingHorizontal}} />
          {this.renderTypesItem('建设工程消防设计审核')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:PaddingHorizontal}} />
          {this.renderTypesItem('建设工程验收指南')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:PaddingHorizontal}} />
          {this.renderTypesItem('公众聚集场所使用，营业前消防安全检查指南')}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderTypesItem(title, border){
    return(
      <TouchableOpacity onPress={this._goToTempletInfo} activeOpacity={0.8} style={styles.mainEntryItem} >
        <View style={styles.mainEntryItemImage} />
        <Text style={styles.mainEntryItemText}>{title}</Text>
        <Image source={ArrowRight} style={styles.mainEntryItemArrow} />
      </TouchableOpacity>
    )
  }

  /** Private **/
  _goToTempletInfo(){
    Actions.apFireControlTemplet();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  mainEntryItem:{
    height:50,
    flexDirection:'row',
    paddingHorizontal:PaddingHorizontal,
    alignItems:'center'
  },
  mainEntryItemImage:{
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor:mainColor,
  },
  mainEntryItemText:{
    marginLeft:15,
    fontSize:15,
    color:mainTextColor,
    flex:1
  },
  mainEntryItemArrow:{
    width:20,
    height:20,
    resizeMode:'contain'
  },
});


const ExportView = connect()(APFireControlTypesView);
ExportView.rightTitle='历史预约'
ExportView.onRight = (props) => {
  Actions.apHistoryList();
}
module.exports.APFireControlTypesView = ExportView
