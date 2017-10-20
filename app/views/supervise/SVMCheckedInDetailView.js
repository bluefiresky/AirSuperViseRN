/**
* Created by wuran on 17/06/26.
* 安全监管-商户-历史检查记录详情
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
const PhotoW = ((W - PaddingHorizontal*2)/3) - 30;
const SubmitButtonW = W - (30 * 2);
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

class SVMCheckedInDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      checkListNum: props.record.checkListNum,
      checkListStatus: props.checkListStatus,
      statusName: null,
      merchantLinkName: null,
      merchantLinkWay: null,
      data: null,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      measure: null
    }

    this._onMeasureTextChange = this._onMeasureTextChange.bind(this);
    this._deletePhotoCallback = this._deletePhotoCallback.bind(this);
    this._rePickCallback = this._rePickCallback.bind(this);
    this._submit = this._submit.bind(this);
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

  render(){
    let { loading, data, measure, pickerPhotos, checkListStatus, statusName, merchantLinkName, merchantLinkWay } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderResult(data, statusName, merchantLinkName, merchantLinkWay)}
          {this.renderSumitData1(data, measure, pickerPhotos, checkListStatus)}
          {this.renderSumitData2(data, checkListStatus)}
          {this.renderCheckResult(data, checkListStatus)}
          {this.renderSubmitButton(data, checkListStatus)}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderResult(data, statusName, merchantLinkName, merchantLinkWay ){
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
          {this.renderResultItem('被检查商户：', data.companyName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('商户联系人：', merchantLinkName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('联系方式：', merchantLinkWay)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderHeightResultItem('情况描述：', data.checkDetails)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderPhotoItem(data.policePhotoList)}
        </View>
      </View>
    )
  }

  renderSumitData1(data, measure, pickerPhotos, checkListStatus){
    if(!data) return null;
    else if(checkListStatus == '1') {
      return(
        <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
          <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>商户反馈</Text>
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          <View style={{paddingHorizontal:PaddingHorizontal}}>
            {this.renderResultItem('提交人：', global.superviseProfile.userName)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderResultItem('联系方式：', global.superviseProfile.phoneNum)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderAutoGrowing(measure)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderPhotoPicker(pickerPhotos)}
          </View>
        </View>
      )
    }
  }

  renderSumitData2(data, checkListStatus){
    if(!data) return null;
    else if(checkListStatus != '1') {
      return(
        <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
          <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>商户反馈</Text>
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          <View style={{paddingHorizontal:PaddingHorizontal}}>
            {this.renderResultItem('提交人：', global.superviseProfile.userName)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderResultItem('联系方式：', global.superviseProfile.phoneNum)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderHeightResultItem('整改措施：', data.modifyDetails)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderPhotoItem(data.companyPhotoList)}
          </View>
        </View>
      )
    }
  }

  renderCheckResult(data, checkListStatus){
    if(!data) return null;
    else if(checkListStatus != '1' && checkListStatus != '2' && data.finalAuditStatus == '2'){
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
        <Text style={{color:mainTextGreyColor, fontSize:16}}>{content}</Text>
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

  renderAutoGrowing(content){
    return(
      <View style={{paddingVertical:15, backgroundColor:'white'}}>
        <Text style={{width: 150, color: inputLeftColor, fontSize: 16 }}><Text style={{color:'red', fontSize:16}}>*</Text>整改措施：</Text>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={content}
          underlineColorAndroid={'transparent'}
          placeholder={''}
          placeholderTextColor={placeholderColor}
          onChangeText={this._onMeasureTextChange}
          minHeight={AutoGrowingInputMinH}
        />
      </View>
    )
  }


  renderPhotoPicker(data){
    return(
      <View style={{paddingVertical:15, backgroundColor:'white'}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}><Text style={styles.labelStyle}>现场照片</Text></Text>
        {this._renderPhotoPickerItem(data)}
      </View>
    )
  }

  _renderPhotoPickerItem(data){
    return(
      <View style={{flexDirection:'row', marginTop:10}}>
        {data.map((item, index) => {
            return(
              <View key={index} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={this._pickPhoto.bind(this, item, index, false)} activeOpacity={0.8} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor, borderColor, borderWidth:1, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                  {
                    !item.photo?<Image source={CameraIcon} style={{width:30, height:25, resizeMode:'contain'}} />:
                    <Image source={item.photo} style={{width:PhotoW, height:PhotoW}} />
                  }

                </TouchableOpacity>
              </View>
            )
          })}
      </View>
    )
  }

  renderSubmitButton(data, checkListStatus){
    if(!data) return null;
    else if(checkListStatus != '1') return null;
    else{
      return(
        <View style={{alignItems:'center', justifyContent:'center', paddingVertical:20}}>
          <XButton onPress={this._submit} title='确认提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
        </View>
      )
    }
  }

  /** Private **/
  _pickPhoto(item, index, rePick){
    if(item.photo && !rePick){
      this.currentPhotoIndex = index;
      Actions.bigImage({source:item.photo, operation:{rePick:this._rePickCallback, clear:this._deletePhotoCallback}})
    }else{
      ImagePicker.showImagePicker(PhotoOption, (response) => {
        if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
          // console.log(' CFTempCertificateLostView _pickPhoto and the response -->> ', response);
          item.photo = {uri:`data:image/jpeg;base64,${response.data}`, isStatic:true}
          this.forceUpdate();
        }
      });
    }
  }

  _deletePhotoCallback(){
    let item = this.state.pickerPhotos[this.currentPhotoIndex];
    item.photo = null;
    this.forceUpdate();
  }

  _rePickCallback(){
    let item = this.state.pickerPhotos[this.currentPhotoIndex];
    this._pickPhoto(item, this.currentPhotoIndex, true);
  }

  _checkBigImage(source){
    Actions.bigImage({source})
  }

  _onMeasureTextChange(text){
    this.setState({measure:text})
  }

  _submit(){
    let params = this._convertToSubmitParams();
    if(params){
      this.setState({loading:true})
      this.props.dispatch( create_service(Contract.POST_GET_SUPERVISE_SUBMIT_FEEDBACK, params))
        .then( res => {
          this.setState({loading:false})
          if(res) Actions.success({
            successType:'submit1',
            modalCallback:()=>{
              DeviceEventEmitter.emit('refreshSVMHome');
              Actions.popTo('svmHome')
            }
          });
        })
    }
  }

  _convertToSubmitParams(){
    let params = null;
    if(!this.state.measure){
      Toast.showShortCenter('整改措施不能为空');
    }else {
      let { pickerPhotos, measure, checkListNum } = this.state;
      params = {
        checkListNum,
        photoList:this._convertPhotosUri(pickerPhotos),
        modifyDetails:measure
      }
    }
    return params;
  }

  _convertPhotosUri(photos){
    let submit = [];
    for(let i=0; i<photos.length; i++){
      let p = photos[i];
      if(p.photo) submit.push({photoData:p.photo.uri.replace('data:image/jpeg;base64,',''), photoType:'3'})
    }
    return JSON.stringify(submit);
  }

  _convertStatus({checkResult, checkResultName, finalAuditStatus, finalAuditStatusName, checkListStatus, checkListStatusName}){
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

const ExportView = connect()(SVMCheckedInDetailView);

module.exports.SVMCheckedInDetailView = ExportView
