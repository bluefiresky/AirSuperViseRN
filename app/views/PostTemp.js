/**
* Created by wuran on 17/06/26.
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules } from "react-native";

import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import {Actions} from "react-native-router-flux";

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { XButton, ProgressView, InputPlaceholder, Input, form_connector, ValidateMethods } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const ComponentW = (W - 30);
const CodeButtonW = ComponentW/3;

class LoginView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      submiting: false,
      codeText: '获取验证码',
      codeSecondsLeft: 60,
    }

    this._onGetVerifyCode = this._onGetVerifyCode.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    this.timer && clearInterval(this.timer);
  }

  render(){
    let { loading, submiting, codeText } = this.state;
    let { phoneNumber, code, password } = this.props.fields;

    return(
      <View style={styles.container}>
        <InputPlaceholder placeholder={'手机号'} {...phoneNumber} keyboardType='numeric' noBorder={true} hasClearButton={true} style={styles.input}/>
        <View style={{flexDirection: 'row', width: ComponentW}}>
          <InputPlaceholder placeholder={'验证码'} {...code} keyboardType='numeric' noBorder={true} hasClearButton={true} style={[styles.input, {flex: 1}]}/>
          {this._renderGetCodeButton(codeText, this._onGetVerifyCode)}
        </View>
        <Input label={'密码'} {...password} secure={true} noBorder={true} hasClearButton={true} style={styles.input}/>

        <XButton title={'登录'} onPress={this._onSubmit} loading={submiting} style={{width: ComponentW, marginTop: 20 }}/>
      </View>
    )
  }

  _renderGetCodeButton(content, callback){
    return(
      <TouchableOpacity onPress={callback} activeOpacity={0.8}>
        <View style={{width: CodeButtonW, height: 40, backgroundColor: '#eb426b', marginTop: 20, alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 5, borderBottomRightRadius: 5}}>
          <Text style={{fontSize: 14, color: 'white'}}>{content}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  /** 私有方法 */
  _onSubmit(){
    this.setState({submiting: true})
    this.timer = setTimeout( () => {
      this.setState({submiting: false})
    }, 1000)
  }

  _onGetVerifyCode(){
    if(this.state.codeText != '获取验证码') return;
    let phoneNumber = this.props.fields.phoneNumber.value;
    if(phoneNumber && phoneNumber.length === 11){
      if (this.state.codeSecondsLeft === 60) {
        this.timer = setInterval(() => {
          let t = this.state.codeSecondsLeft - 1;
          if (t === 0) {
            this.timer && clearInterval(this.timer);
            this.setState({codeText: '获取验证码', codeSecondsLeft: 60})
          }else{
            this.setState({codeText: '再次获取(' + t + ')', codeSecondsLeft: t});
          }
        }, 1000);
        // this.props.dispatch( create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE, {mobile: phoneNumber, action: '2', version: '1'}) )
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
    backgroundColor: mainBackColor,
    alignItems: 'center'
  },
  input: {
    width: ComponentW,
    borderRadius: 5,
    marginTop: 20,
    height: 40
  }
});

/** post-提交所需数据配置 */
const fields = ['account', 'password', 'phoneNumber', 'code']
const validate = (assert, fields) => {
  assert("phoneNumber", ValidateMethods.required(), '请输入手机号')
  assert("phoneNumber", ValidateMethods.min_length(11), '请输入正确手机号')
  assert("phoneNumber", ValidateMethods.max_length(11), '请输入正确手机号')
  assert("password", ValidateMethods.required(), '请输入密码')
  assert("password", ValidateMethods.min_length(6), '密码必须在6到24位')
  assert("password", ValidateMethods.max_length(24), '密码必须在6到24位')
}

const ExportView = connect()(form_connector(LoginView, fields, validate));

module.exports.LoginView = ExportView;
