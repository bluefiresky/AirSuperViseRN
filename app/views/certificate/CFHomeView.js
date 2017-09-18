/**
* Created by wuran on 17/06/26.
* 证件管理-首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const HeaderH = 0.27*H;
const PaddingHorizontal = 10;
const HeaderIconW = W/3 - 60;
const EntryPaddingHorizontal = 30;
const EntryImageW = (W - EntryPaddingHorizontal*2)/3 - 60;

const EntryImage1 = require('./image/icon-certificate-entry1.png');
const EntryImage2 = require('./image/icon-certificate-entry2.png');
const EntryImage3 = require('./image/icon-certificate-entry3.png');
const EntryImage4 = require('./image/icon-certificate-entry4.png');
const EntryImage5 = require('./image/icon-certificate-entry5.png');

const CheckRoleNum = '04';

class CFHomeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      role: props.role,
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false})
      }, 100);
    })
  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderHeader()}
          {this.renderCheckEntry()}
          {this.renderMineEntry()}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderHeader(){
    return(
      <View style={{backgroundColor:mainColor, paddingVertical:20}}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style={{height:HeaderIconW, width:HeaderIconW, borderRadius:HeaderIconW/2, backgroundColor:'white'}} />
            <View style={{marginTop:-5, height:16, backgroundColor:'rgb(255, 166, 77)', borderRadius:8, paddingHorizontal:8, justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontSize:12, color:'white', includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>民警</Text>
            </View>
            <View style={{marginTop:5, height:16, backgroundColor:'rgb(0, 215, 149)', borderRadius:8, paddingHorizontal:8, justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontSize:12, color:'white', includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>有效</Text>
            </View>
          </View>
          <View style={{flex:2, justifyContent:'center', paddingRight:20}}>
            <Text style={styles.headerTextMain}>持证人姓名：{'张三'}</Text>
            <Text style={[styles.headerTextMain, {marginTop:7}]}>证件编号：{'010-27789370'}</Text>
            <Text style={[styles.headerTextMain, {marginTop:7}]}>所属单位：{'机场公安分局'}</Text>
            <Text style={[styles.headerTextMain, {marginTop:7}]}>剩余记分：{'8分'}</Text>
            <Text style={[styles.headerTextMain, {marginTop:7}]}>通行区域：{'A/B/区'}</Text>
            <Text style={[styles.headerTextMain, {marginTop:7}]}>证件有效期：{'2018年1月1日到期'}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderCheckEntry(){
    if(!(this.state.role && this.state.role.roleNum == CheckRoleNum)) return null;
    
    return(
      <View style={{paddingVertical:15, marginTop:10, backgroundColor:'white'}}>
        <Text style={{color:mainTextColor, fontSize:16, marginLeft:PaddingHorizontal}}>证件查询</Text>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginTop:15}} />
        <View style={{flexDirection:'row', paddingHorizontal:EntryPaddingHorizontal, paddingTop:20}}>
          <TouchableOpacity onPress={this._entryPress.bind(this, 0)} activeOpacity={0.8} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Image source={EntryImage1} style={styles.entryImage}/>
            <Text style={styles.entryText}>持证人检查</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._entryPress.bind(this, 1)} activeOpacity={0.8} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Image source={EntryImage2} style={styles.entryImage}/>
            <Text style={styles.entryText}>申办单位检查</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._entryPress.bind(this, 2)} activeOpacity={0.8} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Image source={EntryImage3} style={styles.entryImage}/>
            <Text style={styles.entryText}>检查记录</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderMineEntry(){
    return(
      <View style={{paddingVertical:15, marginTop:10, backgroundColor:'white'}}>
        <Text style={{color:mainTextColor, fontSize:16, marginLeft:PaddingHorizontal}}>我的证件</Text>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginTop:15}} />
        <View style={{flexDirection:'row', paddingHorizontal:EntryPaddingHorizontal, paddingTop:20}}>
          <TouchableOpacity onPress={this._entryPress.bind(this, 3)} activeOpacity={0.8} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Image source={EntryImage4} style={styles.entryImage}/>
            <Text style={styles.entryText}>临时证件挂失</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._entryPress.bind(this, 4)} activeOpacity={0.8} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Image source={EntryImage5} style={styles.entryImage}/>
            <Text style={styles.entryText}>记分管理</Text>
          </TouchableOpacity>
          <View style={{flex:1}} />
        </View>
      </View>
    )
  }

  /** Private **/
  _entryPress(type){
    if(type === 0){
      Actions.cfInspect()
    }else if(type === 1){

    }else if(type === 2){
      Actions.cfInspectedRecords()
    }else if(type === 3){
      Actions.cfTempCertificateLost()
    }else if(type === 4){
      Actions.cfScoreManager()
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
},
  headerTextMain:{
    color:'white',
    fontSize:16
  },
  headerTextSub:{
    flex:1,
    color:'white',
    fontSize:16,
    textAlign:'center',
    lineHeight:20
  },
  headerTextSubTitle:{
    fontSize:14
  },
  entryImage:{
    width:EntryImageW,
    height:EntryImageW,
    resizeMode:'contain'
  },
  entryText:{
    marginTop:10,
    color:mainTextGreyColor,
    fontSize:15
  }
});

const ExportView = connect()(CFHomeView);

module.exports.CFHomeView = ExportView
