/**
* Created by wuran on 17/06/26.
* 网上预约-新机场证件
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import ImagePicker from 'react-native-image-picker';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, inputLeftColor, inputRightColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, Input } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const ItemH = 50;
const SubmitButtonW = W - (30 * 2);
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const LabelW = 120;

const ArrowIcon = require('./image/icon-arrow-right.png');
const CameraIcon = require('./image/camera.png');
const Cover1 = require('./image/cover-submit-1.jpg');
const Cover2 = require('./image/cover-submit-2.jpg');
const Cover3 = require('./image/cover-submit-3.jpg');
const Cover4 = require('./image/cover-submit-4.jpg');
const Cover5 = require('./image/cover-submit-5.jpg');

const ApplyerTypes = [{label:'企业', code:'1'}, {label:'个人', code:'2'}];
const CarMerchantRelations = [{label:'自有', code:'1'}, {label:'租赁', code:'2'}];
const ApplyTypes = [{label:'首次申请', code:'1'}, {label:'补、换发', code:'2'}, {label:'失效重新申请', code:'3'}];

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
class APCertificateApplySubmitView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      pickerPhotos: [
        {photo:null, cover:Cover1, label:'行驶证正本', type:'1'},
        {photo:null, cover:Cover2, label:'行驶证副本', type:'2'},
        {photo:null, cover:Cover3, label:'车辆正面', type:'3'},
        {photo:null, cover:Cover4, label:'车辆侧面', type:'4'},
        {photo:null, cover:Cover5, label:'道路运输许可证', type:'5'}
      ],
      applyerType:ApplyerTypes[1],
      idAddress: null, // 户籍地
      carType: null,   // 车辆类型
      carUsingWay: null,  // 车辆使用性质
      startDate: null, // 开始时间
      endDate: null,   // 结束时间
      validDate: null, // 有效期
      carMerchantRelation: {}, // 车辆与申请单位关系
      applyType: {},   // 申请类型,
      certificateType: null,
      applyReason: null,
    }

    this._deletePhotoCallback = this._deletePhotoCallback.bind(this);
    this._rePickCallback = this._rePickCallback.bind(this);
    this._submit = this._submit.bind(this);
    this._submitCallback = this._submitCallback.bind(this);
  }

  render(){
    let { loading, applyerType, pickerPhotos } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:'white'}} >
          {this.renderRadio('所有人类型：', applyerType, ApplyerTypes, 1)}
          {applyerType.code == '1'? null : <Line />}
          {this.renderPersonal(applyerType)}
          <Line />
          {this.renderCommon()}
          <Line />
          {this.renderPhotoPicker(pickerPhotos)}
          <Line />
          {this.renderSubmitButton()}
          <View style={{height:50, backgroundColor:mainBackColor}} />
        </ScrollView>
        <ProgressView show={loading}/>
      </View>
    )
  }

  renderRadio(label, current, data, type){
    return (
      <View style={{flexDirection:'row', paddingBottom:15, paddingHorizontal:PaddingHorizontal}}>
        <Text style={{color:mainTextColor, fontSize:16, width:110, marginTop:15}}>{label}</Text>
        <View style={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>
          {data.map((item, index) => {
            let show = (current.code == item.code)? {back:mainColor, text:'white'}:{back:mainBackColor, text:mainTextGreyColor};
            return(
              <TouchableOpacity key={index} onPress={this._onPressRadio.bind(this, item, index, type)} activeOpacity={0.8} style={{height:26, paddingHorizontal:8, backgroundColor:show.back, borderRadius:13, alignItems:'center', justifyContent:'center', marginRight:10, marginTop:10}}>
                <Text style={{fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    );
  }

  renderPersonal(applyerType){
    if(applyerType.code == '1') return null;

    return (
      <View>
        <Input label={'姓名：'} labelWidth={LabelW} placeholder={'请输入企业名称'} noBorder={true} style={{height:ItemH, paddingLeft:PaddingHorizontal}}/>
        <Line />
        <Input label={'身份证号：'} labelWidth={LabelW} placeholder={'请输入企业名称'} noBorder={true} style={{height:ItemH, paddingLeft:PaddingHorizontal}}/>
        <Line />
        <Input label={'手机号：'} labelWidth={LabelW} placeholder={'请输入企业名称'} noBorder={true} style={{height:ItemH, paddingLeft:PaddingHorizontal}}/>
      </View>
    );
  }

  renderCommon(){
    let { idAddress, carType, carUsingWay, startDate, endDate, validDate, carMerchantRelation, applyType, certificateType, applyReason } = this.state;
    return (
      <View>
        {this.renderPicker('户籍地：', idAddress, '请选择户籍地', [], 1)}
        <Line/>
        {this.renderPicker('牌照号码：', null, '请选择', [], -1)}
        <Line/>
        {this.renderPicker('车辆类型：', carType, '请选择车辆类型', [], 2)}
        <Line/>
        {this.renderPicker('车辆使用性质：', carUsingWay, '请选择车辆使用性质', [], 3)}
        <Line/>
        <Input label={'车辆识别代码：'} labelWidth={LabelW} placeholder={'请输入车流量识别代码'} noBorder={true} style={{height:ItemH, paddingLeft:PaddingHorizontal}}/>
        <Line />
        <Input label={'交强险保单号：'} labelWidth={LabelW} placeholder={'请输入交强险保单号'} noBorder={true} style={{height:ItemH, paddingLeft:PaddingHorizontal}}/>
        <Line />
        {this.renderSectionDate('交强险有效期：', startDate, endDate, 6, 7)}
        <Line/>
        {this.renderPicker('车辆使用性质：', validDate, '请选择车辆使用性质', null, 8)}
        <Line/>
        {this.renderRadio('车辆与申请单位关系：', carMerchantRelation, CarMerchantRelations, 2)}
        <Line/>
        {this.renderRadio('申请类型：', applyType, ApplyTypes)}
        <Line />
        <Input label={'联系人姓名：'} labelWidth={LabelW} placeholder={'请输入联系人姓名'} noBorder={true} style={{height:ItemH, paddingLeft:PaddingHorizontal}}/>
        <Line />
        <Input label={'联系方式：'} labelWidth={LabelW} placeholder={'请输入联系方式'} noBorder={true} style={{height:ItemH, paddingLeft:PaddingHorizontal}}/>
        <Line />
        <Input label={'申请部门或单位：'} labelWidth={LabelW} placeholder={'请输入申请部门或单位'} noBorder={true} style={{height:ItemH, paddingLeft:PaddingHorizontal}}/>
        <Line/>
        {this.renderPicker('证件类别：', certificateType, '请选择证件类别', [], 4)}
        <Line/>
        {this.renderPicker('申请事由：', applyReason, '请选择申请事由', [], 5)}
      </View>
    );
  }

  renderSectionDate(label, start, end, startType, endType){
    return (
      <View style={{paddingTop:15, paddingHorizontal:PaddingHorizontal}}>
        <Text style={{color:mainTextColor, fontSize:16}}>{label}</Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TouchableOpacity onPress={this._onPressDataPicker.bind(this, null, startType)} activeOpacity={0.8} style={{height:ItemH, flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:16, color:start?mainTextGreyColor:placeholderColor}}>{start? start : '请选择开始时间'}</Text>
          </TouchableOpacity>
          <Text style={{color:mainTextColor, fontSize:16, paddingHorizontal:5}}>至</Text>
          <TouchableOpacity onPress={this._onPressDataPicker.bind(this, null, endType)} activeOpacity={0.8} style={{height:ItemH, flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:16, color:end?mainTextGreyColor:placeholderColor}}>{end? end : '请选择结束时间'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderPicker(label, content, tip, data, type){
    let show = content? {content, color:mainTextGreyColor} : {content:tip, color:placeholderColor}
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this._onPressDataPicker.bind(this, data, type)} style={{height:ItemH, flexDirection:'row', alignItems:'center', paddingHorizontal:PaddingHorizontal}}>
        <Text style={{fontSize:16, color:mainTextColor, width:LabelW}}>{label}</Text>
        <Text style={{fontSize:16, color:show.color, flex:1}}>{show.content}</Text>
        <Image source={ArrowIcon} style={{width:15, height:15, resizeMode:'contain'}} />
      </TouchableOpacity>
    );
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
        <Text style={styles.labelStyle}>现场照片</Text>
        {this._renderPhotoPickerItem(data)}
      </View>
    )
  }

  _renderPhotoPickerItem(data){
    return(
      <View style={{flexDirection:'row', flexWrap:'wrap'}}>
        {data.map((item, index) => {
          return(
            <View key={index}>
              <TouchableOpacity onPress={this._pickPhoto.bind(this, item, index, false)} activeOpacity={0.8} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor, borderColor, borderWidth:1, borderRadius:10, marginRight:10, marginTop:10}}>
                {
                  item.photo? <Image source={item.photo} style={{width:PhotoW, height:PhotoW}} /> :
                  <Image source={item.cover} style={{width:PhotoW, height:PhotoW, justifyContent:'center', alignItems:'center'}}>
                    <Image source={CameraIcon} style={{width:30, height:25, resizeMode:'contain'}} />
                  </Image>
                }
              </TouchableOpacity>
              <Text style={{fontSize:13, color:mainTextGreyColor, marginTop:5, alignSelf:'center', marginRight:5}}>{item.label}</Text>
           </View>
          )
          })}
      </View>
    )
  }

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center', marginTop:30, backgroundColor:mainBackColor}}>
        <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }

  /** Private **/
  _submit(){
    Actions.tip({
      tipType:'submitConfirm',
      callback:this._submitCallback
    });
  }

  _submitCallback(){
    let self = this;
    this.setState({loading: true})
    this.timer = setTimeout(function () {
      self.setState({loading: false})
      Actions.success({successType:'certificateApply', modalCallback:()=>{ Actions.popTo('apCertificateApplyHome')}})
    }, 500);
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

  _onPressDataPicker(data, type){
    if(data == null){
      this._onPressDatePicker(type)
      return;
    }

    Actions.commonPicker({
      data,
      modalCallback:(value)=>{
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){

        }else if(type == 4){

        }else if(type == 5){

        }
      }
    })
  }

  _onPressDatePicker(type){
    if(type == 6){
      Actions.datePicker({modalCallback:(date)=>{ this.setState({startDate:date}) }});
    }else if(type == 7){
      Actions.datePicker({modalCallback:(date)=>{ this.setState({endDate:date}) }});
    }else if(type == 8){
      Actions.datePicker({modalCallback:(date)=>{ this.setState({validDate:date}) }});
    }
  }

  _onPressRadio(item, index, type){
    if(type == 1){
      this.setState({applyerType:item})
    }else if(type == 2){
      this.setState({carMerchantRelation:item})
    }else if(type == 3){

    }
  }


}

const Line = (props) => {
  let { marginHorizontal } = props;
  return <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor, marginHorizontal:marginHorizontal?marginHorizontal:PaddingHorizontal}} />;
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
});

const ExportView = connect()(APCertificateApplySubmitView);

module.exports.APCertificateApplySubmitView = ExportView
