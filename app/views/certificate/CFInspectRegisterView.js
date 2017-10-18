/**
* Created by wuran on 17/06/26.
* 证件管理-违规登记
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, DeviceEventEmitter } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { CheckBox } from 'react-native-elements';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ImagePicker from 'react-native-image-picker';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, inputRightColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 80;
const PaddingHorizontal = 10;
const SubmitButtonW = W - (30 * 2);
const InputH = 45;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const SignW = W - PaddingHorizontal*2 - 60 - 20;
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

class CFInspectRegisterView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      law: null,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      refuse: false,
      signImage: null,
      score: null,
      searchProfile: props.searchProfile,
    }

    this.currentPhotoIndex;
    this._deletePhotoCallback = this._deletePhotoCallback.bind(this);
    this._rePickCallback = this._rePickCallback.bind(this);
    this._submit = this._submit.bind(this);
    this._onRefuseCheck = this._onRefuseCheck.bind(this);
    this._goSelectLaw = this._goSelectLaw.bind(this);
    this._convertPhotosUri = this._convertPhotosUri.bind(this);
    this._convertToSubmitParams = this._convertToSubmitParams.bind(this);
    this._goSign = this._goSign.bind(this);
  }

  componentDidMount(){
  }

  render(){
    let { loading, law, pickerPhotos, refuse, score, signImage } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderLawSelect(law)}
          {this.renderScore(score)}
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          {this.renderPhotoPicker(pickerPhotos)}
          <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
          {this.renderSign(signImage, refuse)}
          {this.renderSubmitButton()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderLawSelect(law){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white'}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={styles.starStyle}>*<Text style={styles.labelStyle}>法律条文</Text></Text>
          <TouchableOpacity onPress={this._goSelectLaw} activeOpacity={0.8} style={{flex:1, justifyContent:'center'}}>
            <Text style={{color:'red', fontSize:16}}>{law?'重新选择':'请选择检查依据的法律条文'}</Text>
          </TouchableOpacity>
        </View>
        {
          !law? null :
          <AutoGrowingTextInput
            style={[styles.autoTextInput, {color:placeholderColor}]}
            value={law.text}
            underlineColorAndroid={'transparent'}
            placeholder={''}
            placeholderTextColor={placeholderColor}
            minHeight={AutoGrowingInputMinH}
          />
        }
      </View>
    )
  }

  renderScore(score){
    if(!score) return null;

    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={[styles.starStyle]}>*<Text style={[styles.labelStyle]}>扣分分值</Text></Text>
          <Text style={{color:mainTextGreyColor, fontSize:14}}>{score}</Text>
        </View>
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}>*<Text style={styles.labelStyle}>现场照片</Text></Text>
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

  renderSign(signImage, checked){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={[styles.starStyle, {width:120}]}>*<Text style={styles.labelStyle}>被检查人签名</Text></Text>
        <View style={{flexDirection:'row', paddingLeft:7, alignItems:'center', marginTop:10}}>
          {
            checked?null:
            <TouchableOpacity onPress={this._goSign} activeOpacity={0.8}>
              {
                !signImage? <View style={{width:SignW, height:60, backgroundColor:mainBackColor}} />:
                <Image source={signImage} style={{width:SignW, height:60, resizeMode:'contain'}} />
              }
            </TouchableOpacity>
          }
          <CheckBox onPress={this._onRefuseCheck} checked={checked} containerStyle={styles.checkbox} textStyle={{marginLeft:5, marginRight:1, color: mainTextGreyColor}} title='拒签' checkedColor={mainColor} uncheckedColor={mainColor} />
        </View>
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
  _goSelectLaw(){
    Actions.lawWeb({
      url:'https://test.zhongchebaolian.com/airport-web-api/certify.html',
      lawCallback:(law) => {
        let lawText = '';
        let score = 0;
        for(let i=0; i<law.length; i++){
          let l = law[i];
          lawText += l.value+'\n'
          score += parseInt(l.num)
        }

        this.setState({law:{text:lawText, entity:law}, score})
      }
    });
  }

  _onRefuseCheck(){
    this.setState({refuse:!this.state.refuse});
  }

  _submit(){
    let params = this._convertToSubmitParams();
    if(params){
      this.setState({loading:true})
      this.props.dispatch( create_service(Contract.POST_CERTIFICATE_CHECK, params))
        .then( res => {
          this.setState({loading:false})
          if(res){
            Actions.success({successType:'submit1', modalCallback:()=>{
              Actions.popTo('cfHome')
              DeviceEventEmitter.emit('refreshCFHome');
            }});
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

  _convertToSubmitParams(){
    let params = null;
    if(!this.state.law){
      Toast.showShortCenter('请选择法律条文');
    }else if (!this.state.score) {
      Toast.showShortCenter('总扣分数不能为空');
    }else if (!this.state.refuse && !this.state.signImage) {
      Toast.showShortCenter('请签名')
    }else {
      let { searchProfile, refuse, score, pickerPhotos, law, signImage } = this.state;
      params = {
        paperworkSerialNumber:searchProfile.serialNumber,
        signFlag:refuse? 0 : 1,
        totalDeductionScore:score,
        signImg:signImage?signImage.uri.replace('data:image/jpeg;base64,',''):'',
        legalProvisionNumbers:law.entity[0].code,
        livePhotos:this._convertPhotosUri(pickerPhotos)
      }
    }

    console.log( ' the submit params -->> ', params);
    return params;
  }

  _convertPhotosUri(photos){
    let submit = [];
    for(let i=0; i<photos.length; i++){
      let p = photos[i];
      if(p.photo) submit.push(p.photo.uri.replace('data:image/jpeg;base64,',''))
    }
    return JSON.stringify(submit);
  }

  _convertLawToSubmit(law){
    let params = [];
    for(let i=0; i<law.length; i++){
      params.push(law[i].code)
    }

    return JSON.stringify(params);
  }

  _goSign(){
    Actions.signature({
      callback:(signData) => {
        this.setState({signImage:{uri:`data:image/jpeg;base64,${signData}`, isStatic:true}})
      }
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
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
  checkbox: {
    margin: 1,
    marginLeft: 1,
    marginRight: 1,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 1,
    borderRadius: 1,
    width:60,
    height:30,
    marginLeft:10
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

const ExportView = connect()(CFInspectRegisterView);

module.exports.CFInspectRegisterView = ExportView
