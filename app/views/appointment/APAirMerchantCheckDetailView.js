/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, inputRightColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const ItemH = 50;
const LabelW = 90;
const PhotoViewW = (W - PaddingHorizontal*2)/3
const PhotoW = PhotoViewW - 20;

const ExamineStatus = {'1':{color:'rgb(255, 176, 91)', text:'待审核'}, '2':{color:'rgb(42, 215, 143)', text:'预审核通过'}, '9':{color:'red', text:'审核不通过'}}
const CertificateTypes = {
  '1':'申请办理首都机场控制区通行证函件（包括:申请函，组织筹建、保卫机构设置及运营情况说明，拟申请办证人员及区域情况报告，并加盖申请单位公章）',
  '2':'与机场管理机构签订的合同及安全协议（包括但不限于服务结算协议、房屋租赁合同等，原件及复印件，加盖申请单位公章）',
  '3':'企业法人营业执照及副本（原件及复印件，加盖申请单位公章）',
  '4':'营业许可证（原件及复印件，加盖申请单位公章）',
  '5':'航空运营人许可证（原件及复印件，加盖申请单位公章）',
  '6':'航线批复许可（原件及复印件，加盖申请单位公章）',
  '7':'合约商与甲方签订的合同（原件及复印件，加盖申请单位公章）',
  '8':'本单位制定的通行证管理规定（加盖申请单位公章）',
  '9':'空防安全承诺书（加盖申请单位公章）',
  '10':'其他说明材料'
};

class APAirMerchantCheckDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      recordId: props.record.id,
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch( create_service(Contract.POST_GET_AIRPORTCARD_APPLY_DETAIL, {id:this.state.recordId}))
        .then( res => {
          if(res) {
            let { certificateTypes, certificatePhotos, corporateName, rejectReason, contactName, contactWay, enterpriseName, examineStatus, applyReason, companyAddr } = res.entity;
            let certificateTypeLabel = '';
            for(let i=0; i<certificateTypes.length; i++){
              let c = certificateTypes[i];
              certificateTypeLabel += (c + '. ' + CertificateTypes[c] + '\n\n');
            }
            let certificatePhotoList = [];
            if(certificatePhotos){
              for(let i=0; i<certificatePhotos.length; i++){
                let c = certificatePhotos[i];
                certificatePhotoList.push({uri:c, isStatic:true})
              }
            }
            this.setState({loading:false, data:{certificatePhotoList, certificateTypeLabel, corporateName, rejectReason, contactName, contactWay, enterpriseName, examineStatus, applyReason, companyAddr}})
          }else{
            this.setState({loading:false})
          }
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
          {this.renderResult(data)}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderDetail(data){
    if(!data) return null;

    return(
      <View style={{backgroundColor:'white', paddingHorizontal:PaddingHorizontal, marginTop:10}}>
        <Text style={{color:mainTextColor, fontSize:18, marginVertical:15, alignSelf:'center'}}>查看扣分详情</Text>
        <View style={{height:1, backgroundColor:borderColor}} />
        {this.renderMerchantName(data.enterpriseName, ExamineStatus[data.examineStatus].text)}
        {this.renderItem('企业法人：', data.corporateName)}
        {this.renderItem('申请事由：', data.applyReason)}
        {this.renderItem('公司地址：', data.companyAddr)}
        {this.renderItem('联系人：', data.contactName)}
        {this.renderItem('联系方式：', data.contactWay)}
        {this.renderItem('需提交材料（可勾选）', data.certificateTypeLabel)}
        {this.renderPhotoPicker(data.certificatePhotoList)}
      </View>
    )
  }

  renderMerchantName(name, status){
    return(
      <View style={{height:60, flexDirection:'row', alignItems:'center'}}>
        <Text style={styles.itemLabel}>企业名称：</Text>
        <Text style={[styles.itemContent, {flex:1}]}>{name}</Text>
        <View style={{height:34, marginLeft:10, paddingHorizontal:10, alignItems:'center', justifyContent:'center', borderColor:'red', borderWidth:StyleSheet.hairlineWidth, borderRadius:17}}>
          <Text style={{color:'red', fontSize:16}}>{status}</Text>
        </View>
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingVertical:15, backgroundColor:'white'}}>
        <Text style={styles.itemLabel}>证件照片：</Text>
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
                <TouchableOpacity onPress={this._checkBigImage.bind(this, item, index)} activeOpacity={0.8} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor, borderColor, borderWidth:1, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                  <Image source={item} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />
                </TouchableOpacity>
              </View>
            )
          })}
      </View>
    )
  }

  // 审查结果
  renderResult(data){
    if(!data) return null;
    else if(data.examineStatus == '9'){
      return(
        <View style={{backgroundColor:'white', paddingHorizontal:PaddingHorizontal, marginTop:10}}>
          <Text style={{color:mainTextColor, fontSize:18, marginVertical:15, alignSelf:'center'}}>审核结果</Text>
          <View style={{height:1, backgroundColor:borderColor}} />
          {this.renderItem('审核结果：', ExamineStatus[data.examineStatus].text)}
          {this.renderItem('审核理由：', data.rejectReason)}
        </View>
      )
    }
  }

  renderItem(label, content){
    return(
      <View style={{paddingVertical:15, flexDirection:'row'}}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={[styles.itemContent, {flex:1}]}>{content}</Text>
      </View>
    )
  }

  /** private **/
  _checkBigImage(source){
    Actions.bigImage({source})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  itemLabel:{
    width:LabelW,
    fontSize:16,
    color:inputLeftColor,
    lineHeight:20
  },
  itemContent:{
    fontSize:16,
    color:inputRightColor,
    lineHeight:20
  }
});

const ExportView = connect()(APAirMerchantCheckDetailView);

module.exports.APAirMerchantCheckDetailView = ExportView
