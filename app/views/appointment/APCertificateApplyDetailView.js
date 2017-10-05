/**
* Created by wuran on 17/06/26.
* 网上预约-历史申请详情
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 10;
const SignW = W - PaddingHorizontal*2;
const SignH = 80;

class APCertificateApplyDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: props.record,
    }

    console.log(' the APCertificateApplyDetailView data -->> ', this.state.data);
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false})
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
          {this.renderDetail(data)}
          {this.renderCheckResult(data)}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading}/>
      </View>
    )
  }

  /** 详情 **/
  renderDetail(data){
    if(!data) return null;

    return (
      <View style={{backgroundColor:'white', marginTop:10}}>
        {this.renderDetailItem('所属企业：', '')}
        {this.renderDetailItem('所有人类型：', '')}
        {this.renderDetailItem('企业名称：', '')}
        {this.renderDetailItem('牌照号码：', '')}
        {this.renderDetailItem('车辆类型：', '')}
        {this.renderDetailItem('车辆使用性质：', '')}
        {this.renderDetailItem('车辆识别代码：', '')}
        {this.renderDetailItem('交强险保单号：', '')}
        {this.renderDetailItem('交强险起止日期：', '')}
        {this.renderDetailItem('年检日期', '')}
        {this.renderDetailItem('车辆与申请单位类型：', '')}
        {this.renderDetailItem('申请类型：', '')}
        {this.renderDetailItem('联想人姓名：', '')}
        {this.renderDetailItem('联系方式：', '')}
        {this.renderDetailItem('申请部门或单位：', '')}
        {this.renderDetailItem('申请类别：', '')}
        {this.renderDetailItem('申请事由：', '')}
        {this.renderPhotoItem([{},{},{},{},{}])}

      </View>
    );
  }

  renderDetailItem(label, content, personal){
    return (
      <View style={{flexDirection:'row', height:40, alignItems:'center', paddingHorizontal:PaddingHorizontal}}>
        <Text style={{color:mainTextColor, fontSize:16}}>{label}</Text>
        <Text styled={{color:mainTextGreyColor, fontSize:16, flex:1}}>{content}</Text>
      </View>
    );
  }

  renderPhotoItem(photos){
    if(photos){
      return(
        <View style={{paddingVertical:15, paddingHorizontal:PaddingHorizontal}}>
          <Text style={{color:mainTextColor, fontSize:16, width:150}}>证件照片：</Text>
            <View style={{flexDirection:'row', marginTop:10, flexWrap:'wrap'}}>
              {photos.map((item, index) => {
                return(
                  <TouchableOpacity key={index} onPress={this._checkBigImage.bind(this, {uri:item.photoUrl})} activeOpacity={0.8} style={{paddingRight:10, paddingTop:10}}>
                    <Image source={{uri:item.photoUrl}} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />
                  </TouchableOpacity>
                )
              })}
            </View>
        </View>
      )
    }
  }

  /** 审核详情 **/
  renderCheckResult(data){
    if(!data) return null;

    return (
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Text style={{color:mainTextColor, fontSize:18, alignSelf:'center', paddingVertical:15}}>审核进度</Text>
        <Line />
        {this.renderCheckResultItem('专办员审核', '审核专办员：', '专办员签字：', {})}
        <Line />
        {this.renderCheckResultItem('领导审核', '审核领导：', '领导签字：', {})}
      </View>
    );
  }

  renderCheckResultItem(label, checkerLabel, signLabel, data){
    return (
      <View style={{padding:PaddingHorizontal}}>
        <Text style={{color:mainColor, fontSize:16}}>●<Text style={{color:mainTextColor, fontSize:16}}>{'\t'+label}</Text></Text>
        <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>{checkerLabel}<Text style={{color:mainTextGreyColor, fontSize:16}}>{label}</Text></Text>
        <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>联系方式：<Text style={{color:mainTextGreyColor, fontSize:16}}>{label}</Text></Text>
        <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>{signLabel}</Text>
        <Image source={null} style={{width:SignW, height:SignH, backgroundColor:mainBackColor, marginTop:10}}/>
      </View>
    )
  }


  /** Private **/
  _checkBigImage(source){
    Actions.bigImage({source})
  }

}

const Line = (props) => {
  return (
    <View style={[{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}, props.style]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(APCertificateApplyDetailView);

module.exports.APCertificateApplyDetailView = ExportView
