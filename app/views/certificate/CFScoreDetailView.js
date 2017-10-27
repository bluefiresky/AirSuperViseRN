/**
* Created by wuran on 17/06/26.
* 证件管理-扣分详情
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const ItemH = 50;
const PhotoWT = (W - PaddingHorizontal*4 - 20)/3;
const PhotoW = PhotoWT > 100? 100 : PhotoWT;
const SubmitButtonW = W - (30 * 2);

const CheckStatusName = {
  '1':{label:'已扣分', color:mainTextGreyColor, id:'1'},
  '2':{label:'复议审核中', color:'red', id:'2'},
  '3':{label:'复议成功', color:'red', id:'3'},
  '9':{label:'复议失败', color:'red', id:'9'}
}

class CFScoreDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      recordID: props.record.id,
      data: null,
    }

    this._submit = this._submit.bind(this);
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.props.dispatch( create_service(Contract.POST_GET_CERTIFICATE_DEDUCTION_DETAIL, {id:self.state.recordID}))
        .then( res => {
          if(res){
            let { holderName, checkStatus, resultImgUrl, createdTime, contactWay, checkerName, id, livePhotos, legalProvisionContents } = res.entity;
            this.setState({
              loading:false,
              data:{...res.entity,
                    checkStatus:CheckStatusName[checkStatus],
                    legalProvisionContents:this._convertLawToText(legalProvisionContents),
                    livePhotos:this._convertPhotos(livePhotos),
                  }
            })
          }else {
            self.setState({loading:false})
          }
        })
    })
  }


  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderResult(data)}
          {this.renderSubmitButton(data)}
          {this.renderReApplyReason(data)}
          {this.renderReApplyFailReason(data)}
          <View style={{height:10}} />
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
        <Text style={{position:'absolute', top:17, right:40, color:mainColor}} onPress={this._goCheckResult.bind(this, data.resultImgUrl)}>处理通知单</Text>
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
          {this.renderCheckStatusResultItem('状态：', data.checkStatus.label, data.checkStatus.color)}
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
        <Text style={{color:mainTextGreyColor, fontSize:16, flex:1}}>{content}</Text>
      </View>
    )
  }

  renderHeightResultItem(label, content){
    return(
      <View style={{paddingVertical:15, flexDirection:'row'}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>{label}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16, flex:1}}>{content}</Text>
      </View>
    )
  }

  renderCheckStatusResultItem(label, content, contentColor){
    return(
      <View style={{height:ItemH, flexDirection:'row', alignItems:'center'}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>{label}</Text>
        <Text style={{color:contentColor, fontSize:16, flex:1}}>{content}</Text>
      </View>
    )
  }


  renderPhotoItem(photos){
    if(photos){
      return(
        <View style={{paddingVertical:15}}>
          <Text style={{color:mainTextColor, fontSize:16, width:150}}>现场照片采集：</Text>
            <View style={{flexDirection:'row', marginTop:10}}>
              {photos.map((item, index) => {
                return(
                  <TouchableOpacity key={index} onPress={this._checkBigImage.bind(this, item.source)} activeOpacity={0.8} style={{flex:1, height:PhotoW, justifyContent:'center', alignItems:'center'}}>
                    <Image source={item.source} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />
                  </TouchableOpacity>
                )
              })}
            </View>
        </View>
      )
    }
  }

  renderSubmitButton(data){
    if(!data) return null;
    else if(data.checkStatus.id == '1'){
      return(
        <View style={{alignItems:'center', justifyContent:'center', paddingVertical:20}}>
          <XButton onPress={this._submit} title='申请复议' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
          <Text style={{color:'red', fontSize:14, marginTop:30}}>注：申请复议时，申请信息将同步发送给直属相关领导</Text>
        </View>
      )
    }
  }

  renderReApplyReason(data){
    if(!data) return null;
    else if(data.checkStatus.id != '1'){
      return (
        <View style={{paddingVertical:15, flexDirection:'row', alignItems:'center', backgroundColor:'white', paddingHorizontal:PaddingHorizontal, marginTop:10}}>
          <Text style={{color:mainTextColor, fontSize:16, width:150}}>申请复议理由：</Text>
          <Text style={{color:mainTextGreyColor, fontSize:16, flex:1}}>{data.reconsiderReason}</Text>
        </View>
      );
    }
  }

  renderReApplyFailReason(data){
    if(!data) return null;
    else if(data.checkStatus.id == '9'){
      return (
        <View style={{backgroundColor:'white', paddingHorizontal:PaddingHorizontal}}>
          <View style={{height:1, backgroundColor:borderColor}} />
          <View style={{paddingVertical:15, flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:mainTextColor, fontSize:16, width:150}}>审核不通过理由：</Text>
            <Text style={{color:mainTextGreyColor, fontSize:16, flex:1}}>{data.reconsiderReply}</Text>
          </View>
        </View>
      );
    }
  }

  /** Private **/
  _submit(){
    Actions.cfApplyReInspect({record:this.state.data, refreshScoreList:this.props.refreshScoreList});
  }

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
      // Actions.bigImage({source:{uri:url, isStatic:true}})
      Actions.commonWeb({url, title:'处理通知单'})
    }else{
      Toast.showShortCenter('未生成处理通知单')
    }
  }

  _checkBigImage(source){
    Actions.bigImage({source})
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(CFScoreDetailView);

module.exports.CFScoreDetailView = ExportView
