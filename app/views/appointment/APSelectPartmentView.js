/**
* Created by wuran on 17/06/26.
* 网上预约-选择工程项目部门
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const ItemH = 50;
const SubmitButtonW = W - (30 * 2);

const ArrowIcon = require('./image/icon-arrow-right.png');

class APSelectPartmentView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      partmentData: null,
      merchantData: null,
      partment: null,
      merchant: null,
    }

    this._getMerchantData = this._getMerchantData.bind(this);
    this._submit = this._submit.bind(this);
  }

  componentDidMount(){
    this.setState({loading: true})
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch( create_service(Contract.POST_AIRPORTCARD_GET_APPROVE_DEPTORUNIT, {deptCode:'all'}))
        .then( res => {
          if(res) this.setState({loading:false, partmentData:res.entity.deptList})
          else this.setState({loading:false})
        })
    })
  }


  render(){
    let { loading, partment, merchant } = this.state;

    return(
      <View style={styles.container}>
        <View style={{height:10}} />
        {this.renderItem('工程部门：', partment? partment.deptName : '请选择工程部门', 1)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth}} />
        {this.renderItem('单位名称：', merchant? merchant.unitName : '请选择单位名称', 2)}
        {this.renderSubmitButton()}
        <ProgressView show={loading}/>
      </View>
    )
  }

  renderItem(label, content, type){
    return (
      <TouchableOpacity onPress={this._onItemPress.bind(this, type)} activeOpacity={0.8} style={{paddingHorizontal:PaddingHorizontal, height:ItemH, alignItems:'center', backgroundColor:'white', flexDirection:'row'}}>
        <Text style={{fontSize:16, color:mainTextColor}}>{label}</Text>
        <Text style={{fontSize:16, color:mainTextGreyColor, paddingLeft:10, flex:1}}>{content}</Text>
        <Image source={ArrowIcon} style={{width:16, height:16, resizeMode:'contain'}} />
      </TouchableOpacity>
    );
  }

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center', marginTop:30}}>
        <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }

  /** Private **/
  _submit(){
    let { partment, merchant } = this.state;
    if(!partment) Toast.showShortCenter('请选择工程部门')
    else if(!merchant) Toast.showShortCenter('请选择单位');
    else Actions.apCertificateApplySubmit({partment, merchant})
  }

  _onItemPress(type){
    if(type == 1){
      let { partmentData } = this.state;
      if(partmentData){
        let data = [];
        for(let i=0; i<partmentData.length; i++){
          data.push(partmentData[i].deptName)
        }
        Actions.commonPicker({data, modalCallback:(deptName, index) => {
          let partment = partmentData[index];
          this.setState({partment, loading:true})
          this._getMerchantData(partment.deptCode)
        }})
      }else{
        Toast.showShortCenter('未获取部门数据，请稍后重试')
      }

    }else if(type == 2){
      let { merchantData } = this.state;
      if(merchantData){
        let data = [];
        for(let i=0; i<merchantData.length; i++){
          data.push(merchantData[i].unitName)
        }
        Actions.commonPicker({data, modalCallback:(deptName, index) => {
          this.setState({merchant:merchantData[index]})
        }})
      }else{
        Toast.showShortCenter('未获取单位数据，请稍后重试')
      }
    }
  }

  _getMerchantData(deptCode){
    this.props.dispatch( create_service(Contract.POST_AIRPORTCARD_GET_APPROVE_DEPTORUNIT, {deptCode}))
      .then( res => {
        if(res) this.setState({loading:false, merchantData:res.entity.unitList})
        else this.setState({loading:false})
      })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(APSelectPartmentView);

module.exports.APSelectPartmentView = ExportView
