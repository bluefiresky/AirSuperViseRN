/**
* Created by wuran on 17/06/26.
* 网上预约-审核证件信息详情
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor  } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 10;
const SignW = W - PaddingHorizontal*2;
const SignH = 80;
const SubmitButtonW = W - (30 * 2);

const CheckResults = [{label:'通过', code:'1'}, {label:'不通过', code:'2'}];

const OwnerType = {'1':'个人', '2':'企业'}
const CarType = {'1':'小型客车', '2':'中型客车', '3':'大型客车', '4':'小型货车', '5':'中型货车', '6':'重型货车', '7':'专项作业车'}
const CarUsingWay = {'1':'运营', '2':'非运营'}
const CarMerchantRelation = {'1':'自由', '2':'租赁'}
const ApplyType = {'1':'首次申领', '2':'补换发', '3':'失效重新申领'}
const IDTypes = {'1':'C类（施工现场）'}

class APCertificateCheckDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      recordId: props.record.formId,
      recordFlowId: props.record.flowId,
      data: null,
      checkResult: {},
      reason: null,
      signImage: null,
    }

    this._goSign = this._goSign.bind(this);
    this._submit = this._submit.bind(this);
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      let { recordId, recordFlowId } = self.state;
      self.props.dispatch( create_service(Contract.POST_GET_AIRPORTCARD_APPROVE_DETAIL, {formId:recordId, flowId:recordFlowId}) )
        .then( res => {
          if(res) self.setState({loading:false, data:res.entity})
          else self.setState({loading:false})
        })
    })
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
        <ProgressView show={loading} />
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
        {this.renderDetailItem('交强险起止日期：', data.insuranceValidityStartDay + '-' + data.insuranceValidityEndDay)}
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

  renderDetailItem(label, content){
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
                  <TouchableOpacity key={index} onPress={this._checkBigImage.bind(this, {uri:item.dataUrl, isStatic:true})} activeOpacity={0.8} style={{paddingRight:10, paddingTop:10}}>
                    <Image source={{uri:item.dataUrl, isStatic:true}} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />
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
    // else if(data.approveStatus == '01') return null;

    return (
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Text style={{color:mainTextColor, fontSize:18, alignSelf:'center', paddingVertical:15}}>审核进度</Text>
        {this.renderCheckResultItem1(data)}
        {this.renderCheckResultItem2(data)}
        {this.renderCheckResultSubmitItem(data)}
      </View>
    );
  }


    renderCheckResultItem1(data){
      let { approveStatus, zbySignPhoto, zbyName, zbyPhone  } = data;
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
      let { approveStatus, bwgbSignPhoto, bwgbName, bwgbPhone  } = data;
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

  renderCheckResultSubmitItem(data){
    let { approveStatus } = data;
    if(approveStatus == '01' || approveStatus == '11'){
      let label = approveStatus == '01'? '专办员审核' : '保卫干部审核';
      let { checkResult, reason, signImage } = this.state;

      return (
        <View style={{padding:PaddingHorizontal}}>
          <Text style={{color:mainColor, fontSize:16}}>●<Text style={{color:mainTextColor, fontSize:16}}>{'\t'+label}</Text></Text>
          <Text style={{color:mainTextColor, fontSize:16, marginTop:15}}>签名</Text>
          <TouchableOpacity onPress={this._goSign} activeOpacity={0.8} style={{marginTop:10}}>
            {
              !signImage? <View style={{width:SignW, height:SignH, backgroundColor:mainBackColor}} />:
              <Image source={signImage} style={{width:SignW, height:SignH, resizeMode:'contain'}} />
            }
          </TouchableOpacity>

          {this.renderRadio('审核结果：', checkResult, CheckResults)}
          {
            checkResult.code != '2'? null :
            <AutoGrowingTextInput
              style={styles.autoTextInput}
              value={reason}
              underlineColorAndroid={'transparent'}
              placeholder={'请输入不通过理由'}
              placeholderTextColor={placeholderColor}
              onChangeText={(text)=>{ this.setState({reason:text}) }}
              minHeight={120}
            />
          }

          <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20, marginTop:20}} />
        </View>
      )
    }
  }

  renderRadio(label, current, data, type){
    return (
      <View style={{flexDirection:'row', paddingBottom:15}}>
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


  /** Private **/
  _submit(){
    let { recordId, signImage, reason, checkResult } = this.state;
    if(!checkResult.code) Toast.showShortCenter('请选择审核结果')
    else{
      if(checkResult.code == '2' && !reason) Toast.showShortCenter('请输入不通过理由')
      else if(!signImage) Toast.showShortCenter('请签名');
      else {
        let params = { formId:recordId, operateType:checkResult.code, signImage:signImage.uri.replace('data:image/jpeg;base64,',''), applyAdviceText:reason }
        Actions.tip({ tipType:'submitConfirm', callback:this._submitCallback.bind(this, params) });
      }
    }
  }

  _submitCallback(params){
    this.setState({loading:true})
    this.props.dispatch( create_service(Contract.POST_AIRPORTCARD_APPROVE_RECORD, params))
      .then( res => {
        this.setState({loading:false})
        if(res) Actions.success({successType:'airportcardCheckDone', modalCallback:()=>{ Actions.popTo('apCertificateApplyHome')}})
      })
  }

  _checkBigImage(source){
    Actions.bigImage({source})
  }

  _onPressRadio(item, index, type){
    this.setState({checkResult:item})
  }

  _goSign(){
    Actions.signature({
      callback:(signData) => {
        this.setState({signImage:{uri:`data:image/jpeg;base64,${signData}`, isStatic:true}})
      }
    })
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  autoTextInput:{
    fontSize:15,
    padding:5,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:borderColor,
    backgroundColor:'#FBFBFE',
    includeFontPadding:false,
    textAlign:'left',
    textAlignVertical:'top',
    marginBottom:10,
  }
});

const ExportView = connect()(APCertificateCheckDetailView);

module.exports.APCertificateCheckDetailView = ExportView
