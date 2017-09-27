/**
* Created by wuran on 17/06/26.
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules } from "react-native";

import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import {Actions} from "react-native-router-flux";

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { XButton, ProgressView, InputWithIcon, Input, form_connector, ValidateMethods } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const SubmitButtonW = (W - 100)
const MainBackIconH = W*714/1125;
const MainIconW = 100;
const MainBackH = MainBackIconH + MainIconW/2;
const CodeTextW = 120;
const CodeInputW = W - 30*2 - CodeTextW;

const MainBackIcon = require('./image/icon-main-back.png');
const MainIcon = require('./image/icon-main.png');
const MobileIcon = require('./image/icon-mobile-input.png');
const PasswordIcon = require('./image/icon-password-input.png');

const InitSeconds = 61;

const AppType = Platform.select({android:1, ios:2})

class LoginView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      submiting: false,
      codeButton: {text:'获取验证码', seconds:InitSeconds, color:mainColor}
    }

    this._onGetVerifyCode = this._onGetVerifyCode.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentWillUnmount(){
    this.timer && clearInterval(this.timer);
  }

  render(){
    let { loading, submiting, codeButton } = this.state;
    let { mobile, code } = this.props.fields;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderMainBack()}
          {this.renderInput(mobile, code, codeButton)}
          {this.renderSubmit()}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderInput(mobile, code, codeButton){
    return(
      <View style={{paddingHorizontal:30, marginTop:50}}>
        <InputWithIcon {...mobile} labelWidth={30} maxLength={11} keyboardType='numeric' style={{height:40, backgroundColor:'transparent', paddingLeft:10}} noBorder={true} icon={MobileIcon} placeholder={'请输入您的手机号'}/>
        <View style={{height:1, backgroundColor:borderColor}} />
        {this.renderCodeInput(code, codeButton)}
        <View style={{height:1, backgroundColor:borderColor}} />
      </View>
    )
  }

  renderCodeInput(code, codeButton){
    return(
      <View style={{flexDirection:'row', marginTop:20}}>
        <InputWithIcon {...code} labelWidth={30} maxLength={6} keyboardType='numeric' style={{height:40, width:CodeInputW, backgroundColor:'transparent', paddingLeft:10}} noBorder={true} icon={PasswordIcon} placeholder={'请输入短信验证码'}/>
        <TouchableOpacity onPress={this._onGetVerifyCode} activeOpacity={0.8} style={{height:40, width:CodeTextW, alignItems:'flex-end', justifyContent:'center'}}>
          <Text style={{fontSize: 14, color:codeButton.color}}>{codeButton.text}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderMainBack(){
    return(
      <View style={{height:MainBackH}}>
        <Image source={MainBackIcon} style={{width:W, height:MainBackIconH, resizeMode:'contain'}}/>
        <View style={{position:'absolute', bottom:0, alignItems:'center', width:W}}>
          <Image source={MainIcon} style={{width:MainIconW, height:MainIconW, resizeMode:'contain'}} />
        </View>
      </View>
    )
  }

  renderSubmit(){
    return(
      <View style={{alignItems:'center', marginTop:50}}>
        <XButton onPress={this._onSubmit} title={'登录'} onPress={this._onSubmit} style={{width:SubmitButtonW, height:40, borderRadius:20}}/>
        <Text style={{color:placeholderColor, fontSize:13, marginTop:20}}>点击登录代表您已经阅读并同意
          <Text style={{color:mainColor}}>《协议和声明》
          </Text>
        </Text>
      </View>
    )
  }

  /** 私有方法 */
  _onSubmit(){
    if (!this.props.form.validate()) {
      Toast.showShortCenter(this.props.form.getErrors()[0]);
    }else {
      this.setState({loading:true})
      let { mobile, code } = this.props.form.getData();
      this.props.dispatch( create_service(Contract.POST_USER_LOGIN_ACCOUNT, {phoneNum:mobile, smsCode:code, deviceId:'uerqpiueonvuqh378r93h9uhn', appType:AppType}))
        .then( res => {
          this.setState({loading:false})
          if(res){
            Actions.main({type:'reset'})
          }
        })
    }
  }

  _onGetVerifyCode(){
    if(this.state.codeButton.seconds != InitSeconds) return;

    let mobile = this.props.fields.mobile.value;
    if(mobile && mobile.length === 11){
      if (this.state.codeButton.seconds === InitSeconds) {
        this.setState({loading:true})
        this.props.dispatch( create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE, {phoneNum: mobile, smsType: '1'}) )
          .then(res => {
            if(res){
              this.setState({loading:false, codeButton:{text:`${InitSeconds-1}秒后可重发`, seconds:InitSeconds-1, color:placeholderColor}})
              this.timer = setInterval(() => {
                let t = this.state.codeButton.seconds - 1;
                if (t === 0) {
                  this.timer && clearInterval(this.timer);
                  this.setState({codeButton:{text:'获取验证码', seconds:InitSeconds, color:mainColor}})
                }else{
                  this.setState({codeButton:{text:`${t}秒后可重发`, seconds:t, color:placeholderColor}})
                }
              }, 1000);

            }else{
              this.setState({loading:false})
            }
          })
      }
    }else{
      Toast.showShortCenter('请输入正确手机号');
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  input: {
    borderRadius: 5,
    marginTop: 20,
    height: 40
  }
});

/** post-提交所需数据配置 */
const fields = ['mobile', 'code']
const validate = (assert, fields) => {
  assert("mobile", ValidateMethods.required(), '请输入手机号')
  assert("mobile", ValidateMethods.min_length(11), '请输入正确手机号')
  assert("mobile", ValidateMethods.max_length(11), '请输入正确手机号')
  assert("code", ValidateMethods.required(), '请输入验证码')
  assert("code", ValidateMethods.min_length(6), '验证码必须在6到24位')
  assert("code", ValidateMethods.max_length(6), '验证码必须在6到24位')
}

const ExportView = connect()(form_connector(LoginView, fields, validate));

module.exports.LoginView = ExportView;
