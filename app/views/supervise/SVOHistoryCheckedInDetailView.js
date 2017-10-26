/**
* Created by wuran on 17/06/26.
* 安全监管-民警-历史检查记录详情
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, DeviceEventEmitter } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ImagePicker from 'react-native-image-picker';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, inputLeftColor, inputRightColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 80;
const PaddingHorizontal = 20;
const ItemH = 50;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const SubmitButtonW = (W - (30 * 2) - 20)/2;
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');
const PhotoOption = {
  title: '选择照片', //选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', //调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: '从手机相册选择', //调取相册的按钮，可以设置为空使用户不可选择相册照片
  mediaType: 'photo',
  maxWidth: 750,
  maxHeight: 1000,
  quality: 0.5,
  storageOptions: { cameraRoll:true, skipBackup: true, path: 'images' }
}

class SVOHistoryCheckedInDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      checkListNum:props.record.checkListNum,
      statusName: null,
      merchantLinkName: null,
      merchantLinkWay: null,
      data: null,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      measure: null
    }

  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch( create_service(Contract.POST_GET_SUPERVISE_CHECK_DETAIL, {checkListNum:this.state.checkListNum}))
        .then( res => {
          if(res){
            let merchantLink = this._convertMerchantLink(res.entity);
            this.setState({loading:false, data:res.entity, statusName:this._convertStatus(res.entity), ...merchantLink})
          }else{
            this.setState({loading:false})
          }
        })
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, data, measure, pickerPhotos, statusName, merchantLinkName, merchantLinkWay } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderResult(data, statusName, merchantLinkName, merchantLinkWay)}
          {this.renderSumitData1(data)}
          {this.renderSumitData2(data)}
          {this.renderCheckResult(data)}
          {this.renderSubmitButton(data)}
          <View style={{height:10}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderResult(data, statusName, merchantLinkName, merchantLinkWay){
    if(!data) return null;

    return(
      <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>检查情况</Text>
        <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        <View style={{paddingHorizontal:PaddingHorizontal}}>
          {this.renderResultTypeItem('检查类型：', data.listTypeName, statusName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('创建时间：', data.createTime)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('创建民警：', data.policeName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('警员编号：', data.policeNum)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderHeightResultItem('被检查商户：', data.companyName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderHeightResultItem('商户联系人：', merchantLinkName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderHeightResultItem('联系方式：', merchantLinkWay)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderHeightResultItem('情况描述：', data.checkDetails)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderPhotoItem(data.policePhotoList)}
        </View>
      </View>
    )
  }

  renderSumitData1(data, measure, pickerPhotos){
    if(!data) return null;
    if(data.checkListStatus == '1' && data.signRecordList && data.signRecordList.length > 0){
      return(
        <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10, paddingVertical:15}}>
          {data.signRecordList.map((item, index) => {
            return (
              <View key={index} style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, marginTop:5}}>
                <Text style={{color:mainColor, fontSize:16}}>{item.signUserName}</Text>
                <Text style={{color:mainTextGreyColor, fontSize:16, marginLeft:10, flex:1}}>{item.signDetails}</Text>
              </View>
            );
          })}
        </View>
      )
    }
  }

  renderSumitData2(data){
    if(!data) return null;
    else if(data.checkListStatus != '1' && data.checkResult == '2'){
      return(
        <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
          <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>商户反馈</Text>
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          <View style={{paddingHorizontal:PaddingHorizontal}}>
            {this.renderResultItem('提交人：', data.processorName)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderResultItem('联系方式：', data.processorPhone)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderHeightResultItem('整改措施：', data.modifyDetails)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderPhotoItem(data.companyPhotoList)}
          </View>
        </View>
      )
    }
  }

  renderCheckResult(data){
    if(!data) return null;
    else if(data.checkListStatus == '3' && data.finalAuditStatus == '2'){
      return (
        <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
          <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>审核不通过原因</Text>
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
            <Text style={{color:mainTextGreyColor, fontSize:15}}>{data.auditDetails}</Text>
          </View>
        </View>
      );
    }
  }

  renderResultTypeItem(label, content, type){
    return(
      <View style={{height:ItemH, flexDirection:'row', alignItems:'center'}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>{label}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16, flex:1}}>{content}</Text>
        <View style={{height:30, justifyContent:'center', paddingHorizontal:15, borderColor:'red', borderRadius:15, borderWidth:StyleSheet.hairlineWidth}}>
          <Text style={{color:'red', fontSize:16}}>{type}</Text>
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
        <Text style={{color:mainTextColor, fontSize:16, width:100, lineHeight:20}}>{label}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16, flex:1, lineHeight:20}}>{content}</Text>
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
                  <TouchableOpacity key={index} onPress={this._checkBigImage.bind(this, {uri:item.photoUrl})} activeOpacity={0.8} style={{flex:1, height:PhotoW, justifyContent:'center', alignItems:'center'}}>
                    <Image source={{uri:item.photoUrl}} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />
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
    else if(data.checkListStatus == '2'){
      return(
        <View style={{alignItems:'center', justifyContent:'center', paddingVertical:20, flexDirection:'row'}}>
          <XButton onPress={this._submit.bind(this, 1)} title='审核通过' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
          <View style={{width:15}} />
          <XButton onPress={this._submit.bind(this, 2)} title='审核不通过' textStyle={{color:mainColor}} style={{backgroundColor:'white', width:SubmitButtonW, height:40, borderRadius:20, borderWidth:1, borderColor:mainColor}} />
        </View>
      )
    }
  }

  /** Private **/
  _submit(type){
    if(type === 1){
      this.setState({loading:true})
      let params = {checkListNum:this.state.checkListNum, auditStatus:'1', auditDetails:''}
      this.props.dispatch( create_service(Contract.POST_SUPERVISE_SUBMIT_AUDIT, params))
        .then( res => {
          this.setState({loading:false})
          if(res) Actions.success({successType:'superviseCheck', modalCallback:()=>{
            DeviceEventEmitter.emit('refreshSVOHome');
            Actions.popTo('svoHome');
          }});
        })
    }else{
      Actions.svoCheckReason({checkListNum:this.state.checkListNum})
    }
  }

  _convertStatus({checkResult, checkResultName, finalAuditStatus, finalAuditStatusName, checkListStatus, checkListStatusName, circulationType}){
    if(checkResult == '2'){
      if(checkListStatus == '3'){
        return finalAuditStatusName;
      }else{
        return checkListStatusName;
      }
    }else{
      return checkResultName;
    }
  }

  _checkBigImage(source){
    Actions.bigImage({source})
  }

  _convertMerchantLink({companyUserList}){
    let merchantLinkName = [];
    let merchantLinkWay = [];
    for(let i=0; i<companyUserList.length; i++){
      let cu = companyUserList[i];
      merchantLinkName.push(cu.companyUserName);
      merchantLinkWay.push(cu.companyUserPhone);
    }

    return { merchantLinkName:merchantLinkName.toString().replace(/,/g, '、'), merchantLinkWay:merchantLinkWay.toString().replace(/,/g, '、') };
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  starStyle:{
    color:'transparent',
    fontSize:14,
    width:LabelW
  },
  labelStyle:{
    color:inputLeftColor,
    fontSize:16
  },
  autoTextInput:{
    marginTop:10,
    fontSize:15,
    padding:5,
    marginHorizontal:7,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:borderColor,
    backgroundColor:'#FBFBFE',
    includeFontPadding:false,
    textAlign:'left',
    textAlignVertical:'top',
    marginBottom:10,
  }

});

const ExportView = connect()(SVOHistoryCheckedInDetailView);

module.exports.SVOHistoryCheckedInDetailView = ExportView
