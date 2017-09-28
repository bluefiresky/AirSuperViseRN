/**
* Created by wuran on 17/06/26.
* 网上预约-新机场证件申请Home
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 30;
const ItemH = 90;
const ItemContentW = 150;

class APCertificateApplyHomeView extends Component {

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
        <View style={{height:10}} />
        {this.renderItem(null, '证件申请')}
        {this.renderItem(null, '审核证件信息')}
        {this.renderItem(null, '历史申请记录')}
        <ProgressView show={loading}/>
      </View>
    )
  }

  renderItem(icon, label){
    return (
      <TouchableOpacity activeOpacity={0.8} style={{height:ItemH, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
        <View style={{flexDirection:'row', alignItems:'center', width:ItemContentW}}>
          <Image source={icon} style={{height:35, width:35, resizeMode:'contain', backgroundColor:'lightskyblue'}} />
          <Text style={{color:mainTextColor, fontSize:18, marginLeft:20}}>{label}</Text>
        </View>
        <View style={{backgroundColor:borderColor, height:1, position:'absolute', bottom:0, left:PaddingHorizontal, right:PaddingHorizontal}} />
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(APCertificateApplyHomeView);

module.exports.APCertificateApplyHomeView = APCertificateApplyHomeView
