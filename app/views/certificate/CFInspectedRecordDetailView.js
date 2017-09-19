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

const CheckStatusName = {'1':'已扣分', '2':'复议审核中', '3':'复议成功', '9':'复议失败'}

class CFInspectedRecordDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      recordID: props.record.id,
      data: null,
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch( create_service(Contract.POST_GET_CERTIFICATE_CHECK_DETAIL, {id:self.state.recordID}))
        .then( res => {
          if(res){
            let { checkStatus, checkerName, contactWay, createdTime, holderName, legalProvisionContents, livePhotos, resultImgUrl } = res.entity;
            this.setState({
              loading:false,
              data:{...res.entity,
                    checkStatus:CheckStatusName[checkStatus],
                    legalProvisionContents:this._convertLawToText(legalProvisionContents),
                    livePhotos:this._convertPhotos(livePhotos),
                    resultImgUrl:'http://2t.5068.com/uploads/allimg/161205/68-1612051H503.jpg'
                  }
            })
          }else{
            this.setState({loading:false})
          }
        })
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
        <Text style={{position:'absolute', top:17, right:40, color:mainColor}} onPress={this._goCheckResult.bind(this, data.resultImgUrl)} >处理通知单</Text>
        <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        <View style={{paddingHorizontal:PaddingHorizontal}}>
          {this.renderResultItem('创建时间：', data.createdTime)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('监察员：', data.holderName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('被检查人：', data.checkerName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('联系方式：', data.contactWay)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderHeightResultItem('扣分内容：', data.legalProvisionContents)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('状态：', data.checkStatus)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderPhotoItem(data.livePhotos)}
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

  renderHeightResultItem(label, content){
    return(
      <View style={{paddingVertical:15, flexDirection:'row'}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>{label}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16}}>{content}</Text>
      </View>
    )
  }

  renderPhotoItem(photos){
    if(photos){
      return(
        <View style={{paddingVertical:15}}>
          <Text style={{color:mainTextColor, fontSize:16, width:150}}>现场照片采集：</Text>
          <View style={{flexDirection:'row', flexWrap:'wrap'}} >
            {
              photos.map((item, index) => {
                return(
                  <Image key={index} source={item.source} style={{width:PhotoW, height:PhotoW, resizeMode:'contain', backgroundColor:'lightskyblue', marginRight:10, marginTop:10}} />
                )
              })
            }
          </View>
        </View>
      )
    }
  }

  /** Private **/
  _convertLawToText(contents){
    let content = '';
    for(let i=0; i<contents.length; i++){
      let c = contents[i];
      content+=`${c.content}\n`;
    }
    return content.trim();
  }

  _convertPhotos(photos){
    let r = [];
    for(let i=0; i<photos.length; i++){
      let p = photos[i];
      r.push({source:{uri:p}})
    }
    return r;
  }

  _goCheckResult(url){
    if(url){
      Actions.bigImage({url})
    }else{
      Toast.showShortCenter('未生成处理通知单')
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

const ExportView = connect()(CFInspectedRecordDetailView);

module.exports.CFInspectedRecordDetailView = ExportView
