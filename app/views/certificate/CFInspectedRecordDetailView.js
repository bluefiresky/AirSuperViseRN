/**
* Created by wuran on 17/06/26.
* 证件管理-
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
const PhotoWT = (W - PaddingHorizontal*4 - 20)/3;
const PhotoW = PhotoWT > 100? 100 : PhotoWT;

class CFInspectedRecordDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: null
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false, data:'abc'})
      }, 100);
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderResult(data)}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderResult(data){
    if(!data) return null;

    return(
      <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>查看扣分详情</Text>
        <Text style={{position:'absolute', top:17, right:40, color:mainColor}} >处理通知单</Text>
        <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        <View style={{paddingHorizontal:PaddingHorizontal}}>
          {this.renderResultItem('创建时间：', '2012年12月21 06:06:06')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('监察员：', '张三')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('被检查人：', '李四')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('联系方式：', '187937987592')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('扣分内容：', '你猜猜吧')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('状态：', '已扣分')}
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
      <View style={{paddingVertical:15}}>
        <Text style={{color:mainTextColor, fontSize:16, width:150}}>现场照片采集：</Text>
        <View style={{flexDirection:'row', marginTop:15}} >
          <Image style={{width:PhotoW, height:PhotoW, resizeMode:'contain', backgroundColor:'lightskyblue'}} />
          <View style={{width:10}} />
          <Image style={{width:PhotoW, height:PhotoW, resizeMode:'contain', backgroundColor:'lightskyblue'}} />
          <View style={{width:10}} />
          <Image style={{width:PhotoW, height:PhotoW, resizeMode:'contain', backgroundColor:'lightskyblue'}} />
        </View>
      </View>
    )
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(CFInspectedRecordDetailView);

module.exports.CFInspectedRecordDetailView = ExportView
