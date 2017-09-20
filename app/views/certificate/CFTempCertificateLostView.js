/**
* Created by wuran on 17/06/26.
* 证件管理-临时证件挂失
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ImagePicker from 'react-native-image-picker';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, Input } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const LabelW = 100;
const InputH = 50;
const SubmitButtonW = W - (30 * 2);
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;

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

class CFTempCertificateLostView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      profile: {realname:global.certificateProfile.realname, serialNumber:global.certificateProfile.serialNumber},
      reason: null,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
    }

    this.currentPhotoIndex;
    this._deletePhotoCallback = this._deletePhotoCallback.bind(this);
    this._rePickCallback = this._rePickCallback.bind(this);
    this._onReasonTextChange = this._onReasonTextChange.bind(this);
    this._submit = this._submit.bind(this);
  }

  render(){
    let { loading, reason, pickerPhotos, profile } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input label={'姓名：'} value={profile.realname} labelWidth={LabelW} placeholder={'请输入姓名'} noBorder={true} style={{height:InputH}} editable={false}/>
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          <Input label={'证件编号：'} value={profile.serialNumber} labelWidth={LabelW} placeholder={'请输入证件编号'} noBorder={true} style={{height:InputH}} editable={false}/>
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          {this.renderAutoGrowing(reason)}
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          {this.renderPhotoPicker(pickerPhotos)}
          {this.renderSubmitButton()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderAutoGrowing(reason){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={{width: 150, color: inputLeftColor, fontSize: 16 }}><Text style={{color:'red', fontSize:16}}>*</Text>被检查简介：</Text>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={reason}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入挂失理由'}
          placeholderTextColor={placeholderColor}
          onChangeText={this._onReasonTextChange}
          minHeight={AutoGrowingInputMinH}
        />
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={{color:inputLeftColor, fontSize:16}}>照片采集：</Text>
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

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center'}}>
        <XButton title='提交' onPress={this._submit} style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }

  /** Private **/
  _submit(){
    if(!this.state.reason){
      Toast.showShortCenter('请输入挂失理由')
    }else{
      this.setState({loading:true})
      let { profile, reason, pickerPhotos } = this.state;
      let photos = [];
      for(let i=0; i<pickerPhotos.length; i++){
        let p = pickerPhotos[i];
        if(p.photo) photos.push(p.photo.uri.replace('data:image/jpeg;base64,',''))
      }
      this.props.dispatch( create_service(Contract.POST_CERTIFICATE_REPORT_LOSS, {paperworkSerialNumber:profile.serialNumber, reportLossReason:reason, photos:JSON.stringify(photos)}))
        .then( res => {
          this.setState({loading:false})
          if(res){
            Actions.success({successType:'certificateLost', modalCallback:Actions.pop});
          }
        })
    }
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

  _onReasonTextChange(text){
    this.setState({reason:text})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  autoTextInput:{
    marginTop:15,
    fontSize:15,
    padding:5,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:borderColor,
    backgroundColor:'#FBFBFE',
    includeFontPadding:false,
    textAlign:'left',
    textAlignVertical:'top'
  }
});

const ExportView = connect()(CFTempCertificateLostView);

module.exports.CFTempCertificateLostView = ExportView
