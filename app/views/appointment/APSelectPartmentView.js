/**
* Created by wuran on 17/06/26.
* 网上预约-选择工程项目部门
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const ItemH = 50;

const ArrowIcon = require('./image/icon-arrow-right.png');

class APSelectPartmentView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      partment: null,
      merchant: null,
    }
  }

  render(){
    let { loading, partment, merchant } = this.state;

    return(
      <View style={styles.container}>
        <View style={{height:10}} />
        {this.renderItem('工程部门：', partment? partment : '请选择工程部门', 1)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
        {this.renderItem('单位名称：', merchant? merchant : '请选择单位名称', 2)}
        <ProgressView show={loading}/>
      </View>
    )
  }

  renderItem(label, content, type){
    return (
      <TouchableOpacity onPress={this._onItemPress.bind(this, type)} activeOpacity={0.8} style={{paddingHorizontal:PaddingHorizontal, height:ItemH, alignItems:'center', backgroundColor:'white', flexDirection:'row'}}>
        <Text style={{fontSize:16, color:mainTextColor}}>{label}</Text>
        <Text style={{fontSize:16, color:mainTextGreyColor, paddingLeft:10, flex:1}}>{content}</Text>
        <Image source={ArrowIcon} style={{width:16, height:16, resizeMode:'contain'}} />
      </TouchableOpacity>
    );
  }

  /** Private **/
  _onItemPress(type){
    if(type == 1){

    }else if(type == 2){

    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(APSelectPartmentView);

module.exports.APSelectPartmentView = APSelectPartmentView
