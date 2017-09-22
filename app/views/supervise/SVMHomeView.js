/**
* Created by wuran on 17/06/26.
* 安全监管首页-商户(Merchant)
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

const HeaderH = H/3;
const PaddingHorizontal = 10;
const HeaderIconW = W/3 - 60;
const EntryItemIconW = 40;
const EntryItemH = 80;

const Icon1 = require('./image/icon-to-feedback.png')
const Icon2 = require('./image/icon-generate-check-record.png')
const Icon3 = require('./image/icon-done.png')
const Icon4 = require('./image/icon-sending.png')

class SVMHomeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: {}
    }

    this._getProfile = this._getProfile.bind(this);
  }

  componentDidMount(){
    let self = this;
    self.setState({loading:true})

    InteractionManager.runAfterInteractions(() => {
      this._getProfile();
    })
  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderHeader(data)}
          {this.renderEntry()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderHeader(data){
    return(
      <View style={{backgroundColor:mainColor, height:HeaderH}}>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style={{height:HeaderIconW, width:HeaderIconW, borderRadius:HeaderIconW/2, backgroundColor:'white'}} />
          </View>
          <View style={{flex:2, justifyContent:'center', paddingRight:20}}>
            <Text style={styles.headerTextMain}>姓名：{data.userName}</Text>
            <Text style={[styles.headerTextMain, {marginTop:5}]}>商户名称：{data.userCompanyName}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row', paddingVertical:15}}>
          <Text style={styles.headerTextSub}>{data.userMonthCounts}<Text style={styles.headerTextSubTitle}>{'\n'}本月被检查</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{data.userYearCounts}<Text style={styles.headerTextSubTitle}>{'\n'}年度被检查</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{data.userModifyCounts}<Text style={styles.headerTextSubTitle}>{'\n'}待反馈</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{data.userReviewCounts}<Text style={styles.headerTextSubTitle}>{'\n'}待复查</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{data.userNotPassCounts}<Text style={styles.headerTextSubTitle}>{'\n'}审核不通过</Text></Text>
        </View>
      </View>
    )
  }

  renderEntry(){
    return (
      <View style={{backgroundColor:'white', marginTop:10}}>
        <View style={{flexDirection:'row'}}>
          {this.renderEntryItem(Icon1, '待反馈', 1)}
          <View style={{width:1, backgroundColor:borderColor}} />
          {this.renderEntryItem(Icon2, '待复查', 2)}
        </View>
        <View style={{height:1, backgroundColor:borderColor}} />
        <View style={{flexDirection:'row'}}>
          {this.renderEntryItem(Icon3, '已完结', 3)}
          <View style={{width:1, backgroundColor:borderColor}} />
          {this.renderEntryItem(Icon4, '抄送', -1)}
        </View>
      </View>
    );
  }

  renderEntryItem(icon, label, type){
    return (
      <TouchableOpacity onPress={this._onPress.bind(this, type, label)} activeOpacity={0.8} style={{flex:1, height:EntryItemH, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
        <Image source={icon} style={{width:EntryItemIconW, height:EntryItemIconW, resizeMode:'contain'}}/>
        <Text style={{marginLeft:20, fontSize:18, color:mainTextGreyColor}}>{label}</Text>
      </TouchableOpacity>
    );
  }

  /** Private **/
  _onPress(checkListStatus, title){
    Actions.svmCheckedIn({checkListStatus, title})
  }

  _getProfile(){
    this.props.dispatch( create_service(Contract.POST_GET_SUPERVISE_USER_INFO, {}))
      .then( res => {
        if(res){
          this.setState({loading:false, data:res.entity})
        }else{
          this.setState({loading:false})
        }
      })
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
    fontSize:18
  },
  headerTextSub:{
    flex:1,
    color:'white',
    fontSize:16,
    textAlign:'center',
    lineHeight:20
  },
  headerTextSubTitle:{
    fontSize:13
  }
});

const ExportView = connect()(SVMHomeView);

module.exports.SVMHomeView = ExportView
