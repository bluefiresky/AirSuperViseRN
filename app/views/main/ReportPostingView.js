/**
* Created by wuran on 17/06/26.
* 违法举报-我要举报
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ImagePicker from 'react-native-image-picker';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor, inputLeftColor, inputRightColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, Input, form_connector, ValidateMethods } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 100;
const PaddingHorizontal = 20;
const SubmitButtonW = W - (30 * 2);
const InputH = 45;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');

const PostingTypes = [{label:'安全隐患举报', code:'1'},{label:'违法犯罪举报', code:'2'}];
const EmergentLevels = [{label:'非常紧急', code:'1'},{label:'紧急', code:'2'},{label:'一般', code:'3'}];

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

class ReportPostingView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      postingType: {},
      emergentLevel: {},
      illegalDetails: null,
      location: props.location,
    }

    this._onIllegalDetailTextChanged = this._onIllegalDetailTextChanged.bind(this);
    this.currentPhotoIndex;
    this._deletePhotoCallback = this._deletePhotoCallback.bind(this);
    this._rePickCallback = this._rePickCallback.bind(this);
    this._convertToSubmit = this._convertToSubmit.bind(this);
    this._submit = this._submit.bind(this);
  }

  render(){
    let { loading, postingType, emergentLevel, location, pickerPhotos, illegalDetails } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} >
          {this.renderImportance(postingType, emergentLevel, location.address, illegalDetails)}
          {this.renderUnimportance(pickerPhotos)}
          {this.renderSubmitButton()}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderImportance(postingType, emergentLevel, address, illegalDetails){
    return(
      <View style={{marginTop:10, backgroundColor:'white'}}>
        {this.renderTypes(postingType)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderAutoGrowing(illegalDetails)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderEmergentLevel(emergentLevel)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderCurrentAddress(address)}
      </View>
    )
  }

  renderTypes(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>举报类型：</Text></Text>
        {this._renderTypesItem(current)}
      </View>
    )
  }

  _renderTypesItem(current){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {PostingTypes.map((item, index) => {
          let show = current.code === item.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor}
          return(
            <TouchableOpacity onPress={this._changePostingType.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, paddingHorizontal:8, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderAutoGrowing(content){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={[styles.starStyle, {width:150}]}>*<Text style={styles.labelStyle}>填写违法信息：</Text></Text>
        </View>
        <AutoGrowingTextInput
          style={[styles.autoTextInput, {color:inputRightColor}]}
          value={content}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入违法举报信息'}
          placeholderTextColor={placeholderColor}
          minHeight={AutoGrowingInputMinH}
          onChangeText={this._onIllegalDetailTextChanged}
          maxHeight={100}
        />
      </View>
    )
  }

  renderEmergentLevel(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>紧急程度：</Text></Text>
        {this._renderEmergentLevelItem(current)}
      </View>
    )
  }

  _renderEmergentLevelItem(current){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {EmergentLevels.map((item, index) => {
          let show = current.code === item.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor};
          return(
            <TouchableOpacity onPress={this._changeEmergent.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, paddingHorizontal:8, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderCurrentAddress(address){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, paddingVertical:15, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>举报地点：</Text></Text>
        <Text style={{color:inputRightColor, fontSize:16, flex:1}}>{address}</Text>
      </View>
    )
  }

  /**
  * 选填
  */
  renderUnimportance(pickerPhotos){
    let { reporterName, reporterId } = this.props.fields;

    return(
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, marginVertical:15, alignSelf:'center'}}>选填信息</Text>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderPhotoPicker(pickerPhotos)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人姓名：'} {...reporterName} labelWidth={140} placeholder={'请输入举报人姓名'} noBorder={true} style={{height:InputH, paddingLeft:24}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人身份证号：'} {...reporterId} labelWidth={140} placeholder={'请输入举报人身份证号'} maxLength={18} noBorder={true} style={{height:InputH, paddingLeft:24}}/>
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}>*<Text style={styles.labelStyle}>举报照片：</Text></Text>
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
                    <Image source={item.photo} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />
                  }
                </TouchableOpacity>
              </View>
            )
          })}
      </View>
    )
  }

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center'}}>
        <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }


  /** Private **/
  _submit(){
    let params = this._convertToSubmit();
    if(params){
      this.setState({loading:true});
      this.props.dispatch( create_service(Contract.POST_REPORT_SUBMIT_REPORT, params))
        .then( res => {
          this.setState({loading:false})
          if(res){
            Actions.success({successType:'reportPosting', modalCallback:()=>{
              Actions.pop();
            }})
          }
        })
    }
  }

  _changePostingType(item){
    this.setState({postingType:item})
  }

  _changeEmergent(item){
    this.setState({emergentLevel:item})
  }

  _onIllegalDetailTextChanged(text){
    this.setState({illegalDetails:text})
  }

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

  _convertToSubmit(){
    let { postingType, illegalDetails, emergentLevel, pickerPhotos, location } = this.state;
    if(!postingType.code) Toast.showShortCenter('请选择举报类型');
    else if(!illegalDetails) Toast.showShortCenter('请输入违法举报信息');
    else if(!emergentLevel.code) Toast.showShortCenter('请选择紧急程度');
    else {
      let { reporterName, reporterId } = this.props.form.getData();

      let params = {
        phoneNum:global.profile.phoneNum, reportType:postingType.code, illegalDetails, urgentType:emergentLevel.code, reportAddress:location.address,
        longitude:location.longitude, latitude:location.latitude, reporterName, reporterId, photoList:this._convertPhotosUri(pickerPhotos)
      }

      console.log(' the _convertToSubmit params -->> ', params);
      return params;
    }
  }

  _convertPhotosUri(photos){
    let submit = [];
    for(let i=0; i<photos.length; i++){
      let p = photos[i];
      if(p.photo) submit.push({photoData:p.photo.uri.replace('data:image/jpeg;base64,',''), photoType:'1'})
    }
    return JSON.stringify(submit);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  starStyle:{
    color:'red',
    fontSize:14,
    width:LabelW
  },
  labelStyle:{
    color:inputLeftColor,
    fontSize:16
  },
  autoTextInput:{
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

/** post-提交所需数据配置 */
const fields = ['reporterName', 'reporterId']
const validate = (assert, fields) => {
}

const ExportView = connect()(form_connector(ReportPostingView, fields, validate));

module.exports.ReportPostingView = ExportView
