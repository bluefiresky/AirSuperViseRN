/**
* Created by wuran on 17/06/26.
* 群众监管
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

class PeopelReportPostingView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      illegalDetails: null,
      location: props.location,
    }

    this._onIllegalDetailTextChanged = this._onIllegalDetailTextChanged.bind(this);
    this._convertToSubmit = this._convertToSubmit.bind(this);
    this._submit = this._submit.bind(this);
  }

  render(){
    let { loading, location, illegalDetails } = this.state;
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} >
          {this.renderImportance(location.address, illegalDetails)}
          {this.renderUnimportance()}
          {this.renderSubmitButton()}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderImportance(address, illegalDetails){
    return(
      <View style={{marginTop:10, backgroundColor:'white'}}>
        {this.renderAutoGrowing(illegalDetails)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderCurrentAddress(address)}
      </View>
    )
  }

  renderAutoGrowing(content){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={[styles.starStyle, {width:150}]}>*<Text style={styles.labelStyle}>填写反映信息：</Text></Text>
        </View>
        <AutoGrowingTextInput
          style={[styles.autoTextInput, {color:inputRightColor}]}
          value={content}
          underlineColorAndroid={'transparent'}
          placeholder={'请输入详细的违法信息'}
          placeholderTextColor={placeholderColor}
          minHeight={AutoGrowingInputMinH}
          onChangeText={this._onIllegalDetailTextChanged}
          maxHeight={100}
        />
      </View>
    )
  }

  renderCurrentAddress(address){
    return(
      <View style={{flexDirection:'row', paddingHorizontal:PaddingHorizontal, paddingVertical:15, alignItems:'center'}}>
        <Text style={[styles.starStyle]}>*<Text style={styles.labelStyle}>举报地点：</Text></Text>
        <Text style={{color:inputRightColor, fontSize:16, flex:1, paddingRight:15}}>{address}</Text>
      </View>
    )
  }

  /**
  * 选填
  */
  renderUnimportance(){
    let { reporterName, reporterId } = this.props.fields;

    return(
      <View style={{backgroundColor:'white'}}>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人姓名：'} {...reporterName} star={true} labelWidth={140} placeholder={'请输入举报人姓名'} maxLength={10} noBorder={true} style={{height:InputH, paddingLeft:20}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人身份证号：'} {...reporterId} star={true} labelWidth={140} placeholder={'请输入举报人身份证号'} maxLength={18} noBorder={true} style={{height:InputH, paddingLeft:20}}/>
      </View>
    )
  }

  renderSubmitButton(){
    return(
      <View style={{height:80, alignItems:'center', justifyContent:'center', marginTop:20}}>
        <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
        <Text style={{color:mainColor, fontSize:16, padding:10}} onPress={Actions.peopelReportHistory}>历史记录</Text>
      </View>
    )
  }


  /** Private **/
  _submit(){
    let params = this._convertToSubmit();
    if(params){
      this.setState({loading:true});
      this.props.dispatch( create_service(Contract.POST_REPORT_SUBMIT_SUPERVISE, params))
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

  _onIllegalDetailTextChanged(text){
    this.setState({illegalDetails:text})
  }

  _convertToSubmit(){
    let { illegalDetails, location } = this.state;
    if(!illegalDetails) Toast.showShortCenter('请输入举报的信息');
    else if (!this.props.form.validate()) {
      Toast.showShortCenter(this.props.form.getErrors()[0]);
    }else {
      let { reporterName, reporterId } = this.props.form.getData();

      let params = {
        phoneNum:global.profile.phoneNum, illegalDetails, reportAddress:location.address,
        longitude:location.longitude, latitude:location.latitude, reporterName, reporterId
      }

      console.log(' the _convertToSubmit params -->> ', params);
      return params;
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
  assert("reporterName", ValidateMethods.required(), '请输入举报人姓名')
  assert("reporterId", ValidateMethods.required(), '请输入举报人身份证号')
  assert("reporterId", ValidateMethods.min_length(18), '请输入正确举报人身份证号')
}

const ExportView = connect()(form_connector(PeopelReportPostingView, fields, validate));

module.exports.PeopelReportPostingView = ExportView
