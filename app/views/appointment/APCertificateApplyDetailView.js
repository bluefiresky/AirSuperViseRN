/**
* Created by wuran on 17/06/26.
* 网上预约-历史申请详情
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 10;
const SignW = W - PaddingHorizontal*2;
const SignH = 80;

const OwnerType = {'1':'个人', '2':'企业'}
const CarType = {'1':'小型客车', '2':'中型客车', '3':'大型客车', '4':'小型货车', '5':'中型货车', '6':'重型货车', '7':'专项作业车'}
const CarUsingWay = {'1':'运营', '2':'非运营'}
const CarMerchantRelation = {'1':'自由', '2':'租赁'}
const ApplyType = {'1':'首次申领', '2':'补换发', '3':'失效重新申领'}
const IDTypes = {'1':'C类（施工现场）'}
const ApprveStatus = {
  '01':{text:'待专办员审核', color:'rgb(255,176,92)'},
  '11':{text:'待保卫干部审核', color:'rgb(255,176,92)'},
  '21':{text:'待民警审核', color:'rgb(14,140,229)'},
  '10':{text:'专办员审核不通过', color:'rgb(255,95,129)'}, '20':{text:'保卫干部审核不通过', color:'rgb(255,95,129)'},  '30':{text:'民警审核不通过', color:'rgb(255,95,129)'},
  '31':{text:'民警审核通过', color:'rgb(0,215,149)'},
}

const Checker = {
  '10':{text:'专办员'},
  '20':{text:'保卫干部'},
  '30':{text:'民警'}
}

class APCertificateApplyDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      recordId: props.record.formId,
      recordFlowId: props.record.flowId,
      data: null,
    }


  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      let { recordId, recordFlowId } = self.state;
      self.props.dispatch( create_service(Contract.POST_GET_AIRPORTCARD_APPROVE_HISTORY_DETAIL, {formId:recordId, flowId:recordFlowId}) )
        .then( res => {
          if(res) self.setState({loading:false, data:res.entity})
          else self.setState({loading:false})
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
          {this.renderDetail(data)}
          {this.renderCheckResult(data)}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading}/>
      </View>
    )
  }

  /** 详情 **/
  renderDetail(data){
    if(!data) return null;

    return (
      <View style={{backgroundColor:'white', marginTop:10}}>
        {this.renderDetailItem('所属企业：', data.approveUnitName)}
        {this.renderDetailItem('所有人类型：', OwnerType[data.ownerType])}
        {this.renderPersonal(data)}
        {this.renderDetailItem('牌照号码：', data.licenseNo)}
        {this.renderDetailItem('车辆类型：', CarType[data.vehicleType])}
        {this.renderDetailItem('车辆使用性质：', CarUsingWay[data.vehicleUseProperty])}
        {this.renderDetailItem('车辆识别代码：', data.vin)}
        {this.renderDetailItem('交强险保单号：', data.insurancePolicyNumber)}
        {this.renderDetailItem('交强险起止日期：', data.insuranceValidityStartDay + '  至  ' + data.insuranceValidityEndDay)}
        {this.renderDetailItem('年检日期：', data.annualInspectionPeriodEndDay)}
        {this.renderDetailItem('车辆与申请单位类型：', CarMerchantRelation[data.relationshipBetweenVehicleAndApplyUnit])}
        {this.renderDetailItem('申请类型：', ApplyType[data.applyType])}
        {this.renderDetailItem('联系人姓名：', data.linkName)}
        {this.renderDetailItem('联系方式：', data.linkWay)}
        {this.renderDetailItem('申请部门或单位：', data.applyDeptOrUnit)}
        {this.renderDetailItem('证件类别：', IDTypes[data.IDType])}
        {this.renderDetailItem('申请事由：', data.applyReason)}
        {this.renderPhotoItem(data.photoList)}

      </View>
    );
  }

  renderPersonal(data){
    let { ownerType, ownerName, ownerIdCard, ownerPhoneNo, placeOfHouseholdRegistration, ownCompanyName } = data;
    if(ownerType == '1'){
      return (
        <View>
          {this.renderDetailItem('姓名：', ownerName)}
          {this.renderDetailItem('身份证号：', ownerIdCard)}
          {this.renderDetailItem('手机号：', ownerPhoneNo)}
          {this.renderDetailItem('户籍地：', placeOfHouseholdRegistration)}
        </View>
      );
    }else{
      return this.renderDetailItem('企业名称：', ownCompanyName);
    }
  }


  renderDetailItem(label, content, personal){
    return (
      <View style={{flexDirection:'row', height:40, alignItems:'center', paddingHorizontal:PaddingHorizontal}}>
        <Text style={{color:mainTextColor, fontSize:16}}>{label}</Text>
        <Text styled={{color:mainTextGreyColor, fontSize:16, flex:1}}>{content}</Text>
      </View>
    );
  }

  renderPhotoItem(photos){
    if(photos){
      return(
        <View style={{paddingVertical:15, paddingHorizontal:PaddingHorizontal}}>
          <Text style={{color:mainTextColor, fontSize:16, width:150}}>证件照片：</Text>
            <View style={{flexDirection:'row', marginTop:10, flexWrap:'wrap'}}>
              {photos.map((item, index) => {
                return(
                  <TouchableOpacity key={index} onPress={this._checkBigImage.bind(this, {uri:item.dataUrl})} activeOpacity={0.8} style={{paddingRight:10, paddingTop:10}}>
                    <Image source={{uri:item.dataUrl}} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />
                  </TouchableOpacity>
                )
              })}
            </View>
        </View>
      )
    }
  }

  /** 审核详情 **/
  renderCheckResult(data){
    if(!data) return null;
    else if(data.approveStatus == '01') return null;

    return (
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Text style={{color:mainTextColor, fontSize:18, alignSelf:'center', paddingVertical:15}}>审核进度</Text>
        {this.renderCheckResultItem1(data)}
        {this.renderCheckResultItem2(data)}
        {this.renderCheckResultItem3(data)}
        {this.renderCheckResultFailItem(data)}
      </View>
    );
  }

  renderCheckResultItem1(data){
    let { approveStatus, zbySignPhoto, zbyName, zbyPhone } = data;
    if(zbySignPhoto){
      return (
        <View style={{padding:PaddingHorizontal}}>
          <Text style={{color:mainColor, fontSize:16}}>●<Text style={{color:mainTextColor, fontSize:16}}>{'\t专办员审核'}</Text></Text>
          <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>审核专办员：<Text style={{color:mainTextGreyColor, fontSize:16}}>{zbyName}</Text></Text>
          <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>联系方式：<Text style={{color:mainTextGreyColor, fontSize:16}}>{zbyPhone}</Text></Text>
          <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>专办员签字：</Text>
          <Image source={{uri:zbySignPhoto.dataUrl, isStatic:true}} style={{width:SignW, height:SignH, resizeMode:'contain', marginTop:10}}/>
        </View>
      )
    }
  }

  renderCheckResultItem2(data){
    let { approveStatus, bwgbSignPhoto, bwgbName, bwgbPhone } = data;
    if(bwgbSignPhoto){
      return (
        <View style={{padding:PaddingHorizontal}}>
          <Text style={{color:mainColor, fontSize:16}}>●<Text style={{color:mainTextColor, fontSize:16}}>{'\t保卫干部审核'}</Text></Text>
          <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>审核保卫干部：<Text style={{color:mainTextGreyColor, fontSize:16}}>{bwgbName}</Text></Text>
          <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>联系方式：<Text style={{color:mainTextGreyColor, fontSize:16}}>{bwgbPhone}</Text></Text>
          <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>保卫干部签字：</Text>
          <Image source={{uri:bwgbSignPhoto.dataUrl, isStatic:true}} style={{width:SignW, height:SignH, resizeMode:'contain', marginTop:10}}/>
        </View>
      )
    }
  }

  renderCheckResultItem3(data){
    let { approveStatus, applyAdviceText } = data;
    if(approveStatus == '21'){
      return (
        <View style={{padding:PaddingHorizontal}}>
          <Text style={{color:mainColor, fontSize:16}}>●<Text style={{color:mainTextColor, fontSize:16}}>{'\t'+'民警审核通过'}</Text></Text>
        </View>
      )
    }
  }


  renderCheckResultFailItem(data){
    let { approveStatus, applyAdviceText, zbyName, zbyPhone, zbySignPhoto, bwgbName, bwgbPhone, bwgbSignPhoto } = data;
    if(approveStatus == '10' || approveStatus == '20' || approveStatus == '30'){
      let checker = Checker[approveStatus].text;

      let name, phone, signImage;
      if(approveStatus == '10'){
        name = zbyName;
        phone = zbyPhone;
        signImage = zbySignPhoto;
      }else if(approveStatus == '20') {
        name = bwgbName;
        phone = bwgbPhone;
        signImage = bwgbSignPhoto;
      }

      return (
        <View style={{padding:PaddingHorizontal}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:mainColor, fontSize:16}}>●<Text style={{color:mainTextColor, fontSize:16}}>{'\t'+checker+'审核'}</Text></Text>
            <Text style={{color:'red', fontSize:16, marginLeft:20}}>审核不通过</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>审核不通过理由：</Text>
            <Text style={{color:mainTextGreyColor, fontSize:16, flex:1, marginTop:15, lineHeight:20}}>{applyAdviceText}</Text>
          </View>
          {this._renderCheckResultFailItemSign(approveStatus, checker, name, phone, signImage)}
        </View>
      )
    }
  }

  _renderCheckResultFailItemSign(status, checker, name, phone, signImage){
    if(status == '30') return null;
    let image = signImage? {uri:signImage.dataUrl, isStatic:true} : null;
    return (
      <View>
        <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>{`审核${checker}：`}<Text style={{color:mainTextGreyColor, fontSize:16}}>{name}</Text></Text>
        <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>联系方式：<Text style={{color:mainTextGreyColor, fontSize:16}}>{phone}</Text></Text>
        <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>{`${checker}签字：`}</Text>
        <Image source={image} style={{width:SignW, height:SignH, resizeMode:'contain', marginTop:10}}/>
      </View>
    );
  }


  /** Private **/
  _checkBigImage(source){
    Actions.bigImage({source})
  }

}

const Line = (props) => {
  return (
    <View style={[{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}, props.style]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(APCertificateApplyDetailView);

module.exports.APCertificateApplyDetailView = ExportView
