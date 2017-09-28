/**
* Created by wuran on 17/06/26.
* 安全监管-空防登记记录
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { CheckBox } from 'react-native-elements';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ImagePicker from 'react-native-image-picker';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, inputRightColor, mainTextGreyColor, placeholderColor, Version } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, Input, form_connector, ValidateMethods } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 90;
const PaddingHorizontal = 10;
const Margin = 0;
const AddPoliceButtonW = 40;
const AddPoliceInputW = (W - Margin * 2 - LabelW - AddPoliceButtonW - PaddingHorizontal*2)
const NameW = AddPoliceInputW/3;
const NameTextW = NameW - 20;
const SubmitButtonW = W - (30 * 2);
const InputH = 45;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const SignW = W - PaddingHorizontal*2 - 60 - 20;
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');
const DeleteIcon = require('./image/icon-search-delete.png');
const ArrowRight = require('./image/icon-arrow-right.png');
const AddIcon = require('./image/icon-add.png');

const CheckResults = [{label:'合格', code:'1'},{label:'不合格', code:'2'},{label:'未检查', code:'3'},{label:'不适用', code:'4'}];
const Sendings = [{label:'不流转', code:'2'},{label:'流转', code:'1'}];
const EmergentLevels = [{label:'紧急', code:'1'},{label:'重要', code:'2'},{label:'一般', code:'3'}];

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

class SVOAirCheckInView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      merchant: props.merchant,
      address: props.address,
      location: props.location,
      checkPolices: [{userid:global.superviseProfile.userid, name:global.superviseProfile.policeName}],
      law: null,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      currentCheckResult: {},
      refuse: false,
      currentSending: {},
      notStandStardDetail: null,
      currentEmergentLevel: {},
      changedDate: null,
      sendCopyMerchant: null,
      signImage: null,
    }

    this._onRefuseCheck = this._onRefuseCheck.bind(this);
    this._goSelectLaw = this._goSelectLaw.bind(this);
    this._onNotStandardDetailTextChange = this._onNotStandardDetailTextChange.bind(this);
    this._goSelectPolice = this._goSelectPolice.bind(this);
    this.currentPhotoIndex;
    this._deletePhotoCallback = this._deletePhotoCallback.bind(this);
    this._rePickCallback = this._rePickCallback.bind(this);
    this._goSign = this._goSign.bind(this);
    this._convertStandardParams = this._convertStandardParams.bind(this);
    this._submit = this._submit.bind(this);
    this._sendCopySearch = this._sendCopySearch.bind(this);
    this._goSelectChangeDate = this._goSelectChangeDate.bind(this);
  }

  componentDidMount(){
    let self = this;
    InteractionManager.runAfterInteractions(() => {
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, checkPolices, law, pickerPhotos, currentCheckResult, refuse, currentSending, notStandStardDetail, currentEmergentLevel, changedDate, sendCopyMerchant, signImage } = this.state;
    let { merchantPhone } = this.props.fields;

    return(
      <View style={styles.container}>
        <View style={{flex:1, margin:Margin, backgroundColor:'white'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.renderCheckPolice(checkPolices)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderLawSelect(law)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderPhotoPicker(pickerPhotos)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderCheckResult(currentCheckResult)}
            {this.renderCheckResultNotStandard(notStandStardDetail, currentEmergentLevel, changedDate, sendCopyMerchant)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderSign(signImage, refuse)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            <Input label={'被检查人联系电话'} {...merchantPhone} labelWidth={150} placeholder={'请输入被检查人身份电话'} maxLength={11} noBorder={true} style={{height:InputH, paddingLeft:16}}/>
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
            {this.renderSending(currentSending)}
            <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          </ScrollView>
          <View style={{flex:1}} />
          {this.renderSubmitButton()}
        </View>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderCheckPolice(data){
    return(
      <View style={{flexDirection:'row', paddingVertical:7, alignItems:'center', paddingHorizontal:PaddingHorizontal}}>
        <Text style={styles.starStyle}>*<Text style={styles.labelStyle}>检查民警</Text></Text>
        <View style={{width:AddPoliceInputW, flexWrap:'wrap', flexDirection:'row'}}>
          {
            data.map((item, index) => {
              return(
                <View key={index} style={{flexDirection:'row', height:30, alignItems:'center', justifyContent:'center'}}>
                  <View style={{paddingHorizontal:5, height:20, borderRadius:10, alignItems:'center', justifyContent:'center', backgroundColor:mainBackColor}}>
                    <Text style={{fontSize:14, color:inputRightColor, includeFontPadding:false, textAlign:'justify', textAlignVertical:'center'}}>{item.name}</Text>
                  </View>
                  {
                    index == 0? <View style={{width:20, height:25}} /> :
                    <TouchableOpacity onPress={this._onDeletePolice.bind(this, item, index)} style={{width:20, height:25}} >
                      <Image source={DeleteIcon} style={{width:10, height:10, resizeMode:'contain'}} />
                    </TouchableOpacity>
                  }
                </View>
              )
            })
          }
        </View>
        <TouchableOpacity onPress={this._goSelectPolice} activeOpacity={0.8} style={{width:AddPoliceButtonW, height:AddPoliceButtonW, alignItems:'center', justifyContent:'center'}}>
          <Image source={AddIcon} style={{height:25, width:25, tintColor:mainColor}} />
        </TouchableOpacity>
      </View>
    );
  }

  renderLawSelect(law){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={styles.starStyle}>*<Text style={styles.labelStyle}>法律条文</Text></Text>
          <TouchableOpacity onPress={this._goSelectLaw} activeOpacity={0.8} style={{flex:1, justifyContent:'center'}}>
            <Text style={{color:'red', fontSize:16}}>{law?'重新选择':'选择'}</Text>
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
            maxHeight={100}
            editable={false}
          />
        }
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
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

  renderCheckResult(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>检查结果</Text></Text>
        {this._renderCheckResultItem(current)}
      </View>
    )
  }

  _renderCheckResultItem(current){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {CheckResults.map((item, index) => {
          let show = current.code === item.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor}
          return(
            <TouchableOpacity onPress={this._changeCheckResult.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, width:50, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderSign(signImage, checked){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
        <Text style={[styles.starStyle, {width:120}]}>*<Text style={styles.labelStyle}>被检查人签名</Text></Text>
        <View style={{flexDirection:'row', paddingLeft:7, alignItems:'center', marginTop:10}}>
          <TouchableOpacity onPress={this._goSign} activeOpacity={0.8}>
            {
              !signImage? <View style={{width:SignW, height:60, backgroundColor:mainBackColor}} />:
              <Image source={signImage} style={{width:SignW, height:60, resizeMode:'contain'}} />
            }
          </TouchableOpacity>
          <CheckBox onPress={this._onRefuseCheck} checked={checked} containerStyle={styles.checkbox} textStyle={{marginLeft:5, marginRight:1, color: mainTextGreyColor}} title='拒签' checkedColor={mainColor} uncheckedColor={mainColor} />
        </View>
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

  renderSending(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>是否流转</Text></Text>
        {this._renderSendingItem(current)}
      </View>
    )
  }

  _renderSendingItem(current){
    return(
      <View style={{flexDirection:'row', flex:1}}>
        {Sendings.map((item, index) => {
          let show = current?(current.code === item.code?{back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor}):{back:mainBackColor, text:mainTextGreyColor};
          return(
            <TouchableOpacity onPress={this._changeSending.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, width:50, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderCheckResultNotStandard(notStandStardDetail, currentEmergentLevel, changedDate, sendCopyMerchant){
    if(this.state.currentCheckResult.code == '2'){
      return(
        <View>
          <AutoGrowingTextInput
            style={styles.autoTextInput}
            value={notStandStardDetail}
            underlineColorAndroid={'transparent'}
            placeholder={'请输入详细检查情况'}
            placeholderTextColor={placeholderColor}
            onChangeText={this._onNotStandardDetailTextChange}
            minHeight={AutoGrowingInputMinH}
          />
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this._renderEmergentLevel(currentEmergentLevel)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this._renderChangedDate(changedDate)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this._renderSendingCopySelect(sendCopyMerchant)}
        </View>
      )
    }
  }

  _renderEmergentLevel(current){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>紧急程度</Text></Text>
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
            <TouchableOpacity onPress={this._changeEmergent.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, width:50, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10}}>
              <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  _renderChangedDate(date){
    let show = date? {text:date, textColor:inputRightColor}:{text:'请选择整改时限', textColor:placeholderColor};
    return(
      <TouchableOpacity activeOpacity={0.8} onPress={this._goSelectChangeDate} style={{paddingHorizontal:PaddingHorizontal, flexDirection:'row', height:InputH, alignItems:'center'}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}>*<Text style={styles.labelStyle}>整改时间</Text></Text>
        <Text style={{color:show.textColor, fontSize:16, flex:1}}>{show.text}</Text>
        <Image source={ArrowRight} style={{width:16, height:16, resizeMode:'contain'}} />
      </TouchableOpacity>
    )
  }

  _renderSendingCopySelect(content){
    let show = content? {color:mainTextGreyColor, text:content.nameArray.toString()} : {color:'red', text:'请选择抄送单位'};
    return(
      <View style={{flexDirection:'row', paddingVertical:15, alignItems:'center', paddingHorizontal:PaddingHorizontal}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}>*<Text style={styles.labelStyle}>抄送单位</Text></Text>
        <TouchableOpacity onPress={this._sendCopySearch} activeOpacity={0.8} style={{flex:1, justifyContent:'center'}}>
          <Text style={{color:show.color, fontSize:16}}>{show.text}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** Private **/
  _submit(){
    let params;
    if(this.state.currentCheckResult.code != '2'){
      params = this._convertStandardParams();
    }else{
      params = this._convertNotStandardParams();
    }

    if(params){
      if(this.state.loading) return;

      this.setState({loading:true})
      this.props.dispatch( create_service(Contract.POST_SUPERVISE_SUBMIT_CHECK, params))
        .then( res => {
          this.setState({loading:false})
          if(res) {
            Actions.success({
              successType:'superviseSubmit',
              modalCallback:()=>{
                if(this._verifyEntryRole(global.profile.roleNums, ['02'])) Actions.popTo('svoHome');
                else Actions.popTo('svmHome');
              }
            });
          }
        })
    }
  }

  _goSelectPolice(){
    let self = this;
    Actions.svoSearchPolice({callback:(data) => {
      let { checkPolices } = self.state;
      checkPolices.push(data);
      this.setState({checkPolices})
    }});
  }

  _onDeletePolice(item, index){
    let { checkPolices } = this.state;
    checkPolices.splice(index, 1);
    this.setState({checkPolices})
  }

  _onRefuseCheck(){
    this.setState({refuse:!this.state.refuse});
  }

  _changeCheckResult(item){
    this.setState({currentCheckResult:item})
  }

  _changeSending(item){
    this.setState({currentSending:item})
  }

  _changeEmergent(item){
    this.setState({currentEmergentLevel:item})
  }

  _onNotStandardDetailTextChange(text){
    this.setState({notStandStardDetail:text})
  }

  _goSelectChangeDate(){
    Actions.datePicker({modalCallback:(date)=>{
      this.setState({changedDate:date})
    }})
  }

  _goSelectLaw(){
    Actions.lawWeb({
      url:'https://test.zhongchebaolian.com/airport-web-api/supervisionLaw.html',
      lawCallback:(law) => {
        let lawText = '';
        for(let i=0; i<law.length; i++){
          lawText += law[i].value+'\n\n'
        }
        this.setState({law:{text:lawText, entity:law}})
      }
    });
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

  _goSign(){
    Actions.signature({
      callback:(signData) => {
        this.setState({signImage:{uri:`data:image/jpeg;base64,${signData}`, isStatic:true}})
      }
    })
  }

  _sendCopySearch(){
    Actions.svoCopySearch({searchResult:(merchant) => {
      let { sendCopyMerchant } = this.state;
      if(sendCopyMerchant){
        let { nameArray, entity } = sendCopyMerchant;
        entity.push({ccCompanyNum:merchant.ccCompanyNum, ccCompanyName:merchant.ccCompanyName})
        nameArray.push(merchant.ccCompanyName)
      }else{
        sendCopyMerchant = {nameArray:[merchant.ccCompanyName], entity:[{ccCompanyNum:merchant.ccCompanyNum, ccCompanyName:merchant.ccCompanyName}]}
      }
      this.setState({sendCopyMerchant})
    }});
  }

  _convertStandardParams(){
    let { checkPolices, law, pickerPhotos, currentCheckResult, refuse, signImage, currentSending, address, location } = this.state;
    if(!law){
      Toast.showShortCenter('请选择法律条文');
    }else if(!currentCheckResult.code){
      Toast.showShortCenter('请选择检查结果');
    }else if(!refuse && !signImage){
      Toast.showShortCenter('请签字');
    }else if(!currentSending.code){
      Toast.showShortCenter('请选择是否流转')
    }else{
      let { companyNum, companyName } = this.state.merchant;
      let { merchantPhone } = this.props.form.getData();

      return {
        companyNum, companyName, locationAddress:location.address, inputAddress:address, longitude:location.longitude, latitude:location.latitude,
        listType:'1', checkResult:currentCheckResult.code, signData:signImage?signImage.uri.replace('data:image/jpeg;base64,',''):null, signType:refuse?'2':'1',
        checkPhoneNum:merchantPhone, circulationType:currentSending.code, templateType:'1', appVersion:Version, policeUserList:JSON.stringify(checkPolices),
        lawList:this._convertLawToSubmit(law.entity), photoList:this._convertPhotosUri(pickerPhotos)
      };
    }
  }

  _convertNotStandardParams(){
    let { checkPolices, law, pickerPhotos, currentCheckResult, refuse, signImage, currentSending, address, location, notStandStardDetail, currentEmergentLevel, changedDate, sendCopyMerchant } = this.state;
    if(!law){
      Toast.showShortCenter('请选择法律条文');
    }else if(!currentCheckResult.code){
      Toast.showShortCenter('请选择检查结果');
    }else if(!notStandStardDetail){
      Toast.showShortCenter('请输入详细检查情况');
    }else if(!currentEmergentLevel.code){
      Toast.showShortCenter('请选择紧急程度');
    }else if(!refuse && !signImage){
      Toast.showShortCenter('请签字');
    }else if(!currentSending.code){
      Toast.showShortCenter('请选择是否流转')
    }else{
      let { companyNum, companyName } = this.state.merchant;
      let { merchantPhone } = this.props.form.getData();

      return {
        companyNum, companyName, locationAddress:location.address, inputAddress:address, longitude:location.longitude, latitude:location.latitude,
        listType:'1', checkResult:currentCheckResult.code, signData:signImage?signImage.uri.replace('data:image/jpeg;base64,',''):null, signType:refuse?'2':'1',
        checkPhoneNum:merchantPhone, circulationType:currentSending.code, templateType:'1', appVersion:Version, policeUserList:JSON.stringify(checkPolices),
        lawList:this._convertLawToSubmit(law.entity), photoList:this._convertPhotosUri(pickerPhotos),checkDetails:notStandStardDetail, urgentType:currentEmergentLevel.code,
        timeLimit:changedDate, ccCompanyList:sendCopyMerchant?JSON.stringify(sendCopyMerchant.entity):null,
      };
    }
  }


  _convertLawToSubmit(law){
    let params = [];
    for(let i=0; i<law.length; i++){
      params.push({lawNum:law[i].code})
    }

    return JSON.stringify(params);
  }

  _convertPhotosUri(photos){
    let submit = [];
    for(let i=0; i<photos.length; i++){
      let p = photos[i];
      if(p.photo) submit.push({photoData:p.photo.uri.replace('data:image/jpeg;base64,',''), photoType:'1'})
    }
    return JSON.stringify(submit);
  }

  _verifyEntryRole(source, targetList){
    if(source && source.length > 0){
      for(let i=0; i<source.length; i++){
        let r = source[i];
        if(targetList.indexOf(r.roleNum) != -1) return r;
      }

      return false;
    }else{
      return false;
    }
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
    marginHorizontal:17,
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
const fields = ['merchantPhone']
const validate = (assert, fields) => {
}

const ExportView = connect()(form_connector(SVOAirCheckInView, fields, validate));

module.exports.SVOAirCheckInView = ExportView;
