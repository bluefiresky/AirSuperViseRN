/**
* Created by wuran on 17/06/26.
* 网上预约大厅-空防新入场单位资质审核
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { CheckBox } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, inputLeftColor, inputRightColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, Input, XButton, form_connector, ValidateMethods, InputAutoGrowing } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 100;
const PaddingHorizontal = 20;
const InputH = 50;
const PhotoViewW = (W - PaddingHorizontal*2)/3
const PhotoW = PhotoViewW - 20;
const SubmitButtonW = W - (30 * 2);

const CameraIcon = require('./image/camera.png');
const AddIcon = require('./image/icon-add.png');
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

const CertificateTypes = [
  {label:'申请办理首都机场控制区通行证函件（包括:申请函，组织筹建、保卫机构设置及运营情况说明，拟申请办证人员及区域情况报告，并加盖申请单位公章）', code:1},
  {label:'与机场管理机构签订的合同及安全协议（包括但不限于服务结算协议、房屋租赁合同等，原件及复印件，加盖申请单位公章）', code:2},
  {label:'企业法人营业执照及副本（原件及复印件，加盖申请单位公章）', code:3},
  {label:'营业许可证（原件及复印件，加盖申请单位公章）', code:4},
  {label:'航空运营人许可证（原件及复印件，加盖申请单位公章）', code:5},
  {label:'航线批复许可（原件及复印件，加盖申请单位公章）', code:6},
  {label:'合约商与甲方签订的合同（原件及复印件，加盖申请单位公章）', code:7},
  {label:'本单位制定的通行证管理规定（加盖申请单位公章）', code:8},
  {label:'空防安全承诺书（加盖申请单位公章）', code:9},
  {label:'其他说明材料', code:10}
];

// const DefaultCertificateTypeCodes = [1,2,3,4,6,7,9]
const DefaultCertificateTypeCodes = []

class APAirMerchantCheckView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      currentCertificateTypeCodes:[
        CertificateTypes[0].code, CertificateTypes[1].code, CertificateTypes[2].code,
        CertificateTypes[3].code, CertificateTypes[7].code, CertificateTypes[8].code],
      pickerPhotos: [{photo:null},{photo:null},{photo:'add'}],
    }

    this.currentPhotoIndex;
    this._deletePhotoCallback = this._deletePhotoCallback.bind(this);
    this._rePickCallback = this._rePickCallback.bind(this);
    this._submit = this._submit.bind(this);
  }

  render(){
    let { loading, currentCertificateTypeCodes, pickerPhotos } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderInput()}
          {this.renderCertificateTypes(currentCertificateTypeCodes)}
          {this.renderLine()}
          {this.renderPhotoPicker(pickerPhotos)}
          {this.renderSubmitButton()}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderInput(){
    let { enterpriseName, corporateName, contactName, contactWay, applyReason, companyAddr } = this.props.fields;

    return(
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Input label={'企业名称（全称）'} {...enterpriseName} maxLength={50} labelWidth={150} placeholder={'请输入企业名称'} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
        <Input label={'企业法人'} {...corporateName} maxLength={20} labelWidth={LabelW} placeholder={'请输入企业法人'} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
        <InputAutoGrowing label={'申请事由：'} {...applyReason} labelWidth={LabelW} placeholder={'请输入申请事由'} noBorder={true} style={{paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
        <InputAutoGrowing label={'公司地址：'} {...companyAddr} labelWidth={LabelW} placeholder={'请输入公司地址'} noBorder={true} style={{paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
        <Input label={'联系人姓名'} {...contactName} maxLength={20} labelWidth={LabelW} placeholder={'请输入联系人姓名'} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
        <Input label={'联系方式'} {...contactWay} maxLength={11} keyboardType='numeric' labelWidth={LabelW} placeholder={'请输入联系方式'} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        {this.renderLine()}
      </View>
    )
  }

  renderCertificateTypes(current){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', paddingBottom:10, minHeight:InputH, paddingTop:5}}>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:5}}>
          <Text style={[styles.starStyle]}><Text style={styles.labelStyle}>需提交材料（可勾选）</Text></Text>
        </View>
        {this._renderCertificateTypesItem(current)}
      </View>
    )
    // <Text style={{paddingHorizontal:15, paddingVertical:5, color:mainColor, fontSize:16}} onPress={()=>{ Toast.showShortCenter('还没有Url') }}>{`各材料填写说明>`}</Text>
  }

  _renderCertificateTypesItem(current){
    return(
      <View style={{flex:1, paddingTop:5}}>
        {CertificateTypes.map((item, index) => {
          let checked = current.indexOf(item.code) != -1;
          return(
            <CheckBox key={index} title={item.label} onPress={this._changeCertificateType.bind(this, item)} checked={checked} containerStyle={styles.checkbox} textStyle={{marginLeft:5, marginRight:15, color: mainTextGreyColor}} checkedColor={mainColor} uncheckedColor={mainColor} />
          )
        })}
      </View>
    )

    // <TouchableOpacity onPress={this._changeCertificateType.bind(this, item)} key={index} activeOpacity={0.8} style={{height:26, paddingHorizontal:8, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10, marginTop:10}}>
    //   <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
    // </TouchableOpacity>

  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}><Text style={styles.labelStyle}>证件照片</Text></Text>
        {this._renderPhotoPickerItem(data)}
      </View>
    )
  }

  _renderPhotoPickerItem(data){
    return(
      <View style={{flexDirection:'row', marginTop:10, flexWrap:'wrap'}}>
        {data.map((item, index) => {
            return(
              <View key={index} style={{width:PhotoViewW, height:PhotoViewW, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={this._pickPhoto.bind(this, item, index, false)} activeOpacity={0.8} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor, borderColor, borderWidth:1, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                  {
                    !item.photo?<Image source={CameraIcon} style={{width:30, height:25, resizeMode:'contain'}} />:
                    item.photo != 'add'?<Image source={item.photo} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />:
                    <Image source={AddIcon} style={{width:30, height:30, resizeMode:'contain'}} />
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
      <View style={{height:80, alignItems:'center', justifyContent:'center', marginTop:30}}>
        <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
        <Text style={{color:placeholderColor, fontSize:14, marginTop:20}} onPress={this._goHistory}>历史记录查询</Text>
      </View>
    )
  }


  renderLine(){
    return(
      <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:PaddingHorizontal}} />
    )
  }

  /** Private **/
  _submit(){
    if (!this.props.form.validate()) {
      Toast.showShortCenter(this.props.form.getErrors()[0]);
    }else {
      this.setState({loading:true})
      let { currentCertificateTypeCodes, pickerPhotos } = this.state;
      let { enterpriseName, corporateName, contactName, contactWay, applyReason, companyAddr } = this.props.form.getData();
      let params = {
        enterpriseName, corporateName, contactName, contactWay, applyReason, companyAddr,
        certificateTypes:JSON.stringify(currentCertificateTypeCodes),
        certificatePhotos:this._convertPhotosUri(pickerPhotos)
      }
      this.props.dispatch( create_service(Contract.POST_AIRPORTCARD_APPLY, params))
        .then( res => {
          this.setState({loading:false})
          if(res) Actions.success({successType:'airportcardApply', modalCallback:Actions.pop})
        })
    }

  }

  _changeCertificateType(item, index){
    let code = item.code;
    if(DefaultCertificateTypeCodes.indexOf(code) != -1) return;

    let { currentCertificateTypeCodes } = this.state;
    let codeIndex = this.state.currentCertificateTypeCodes.indexOf(code);
    if(codeIndex != -1){
      currentCertificateTypeCodes.splice(codeIndex, 1);
    }else{
      currentCertificateTypeCodes.push(code);
    }

    this.setState({currentCertificateTypeCodes:currentCertificateTypeCodes})
  }

  _goHistory(){
    Actions.apAirMerchantCheckHistory();
  }

  _pickPhoto(item, index, rePick){
    if(item.photo && item.photo != 'add' && !rePick){
      this.currentPhotoIndex = index;
      Actions.bigImage({source:item.photo, operation:{rePick:this._rePickCallback, clear:this._deletePhotoCallback}})
    }else{
      ImagePicker.showImagePicker(PhotoOption, (response) => {
        if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
          // console.log(' CFTempCertificateLostView _pickPhoto and the response -->> ', response);
          item.photo = {uri:`data:image/jpeg;base64,${response.data}`, isStatic:true}
          let { pickerPhotos } = this.state;
          if(index != 0 && index != 1 && index < 11) pickerPhotos.push({photo:'add'});
          this.setState({pickerPhotos});
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

  _convertPhotosUri(photos){
    let submit = [];
    for(let i=0; i<photos.length; i++){
      let p = photos[i];
      if(p.photo && p.photo != 'add') submit.push(p.photo.uri.replace('data:image/jpeg;base64,',''))
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
    width:200
  },
  labelStyle:{
    color:inputLeftColor,
    fontSize:16
  },
  checkbox: {
    margin: 1,
    marginLeft: 1,
    marginRight: 1,
    marginTop:5,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 1,
    borderRadius: 1,
  },
});

/** post-提交所需数据配置 */
const fields = ['enterpriseName', 'corporateName', 'applyReason', 'companyAddr', 'contactName', 'contactWay']
const validate = (assert, fields) => {
  assert("enterpriseName", ValidateMethods.required(), '请输入企业名称')
  assert("corporateName", ValidateMethods.required(), '请输入企业法人')
  assert("contactName", ValidateMethods.required(), '请输入联系人姓名')
  assert("applyReason", ValidateMethods.required(), '请输入申请事由')
  assert("companyAddr", ValidateMethods.required(), '请输入公司地址')
  assert("contactWay", ValidateMethods.required(), '请输入联系方式')
  assert("contactWay", ValidateMethods.min_length(11), '输入的联系方式必须为11位')
}

const ExportView = connect()(form_connector(APAirMerchantCheckView, fields, validate));

module.exports.APAirMerchantCheckView = ExportView
