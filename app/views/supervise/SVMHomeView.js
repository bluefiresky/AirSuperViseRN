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
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading:true})

    InteractionManager.runAfterInteractions(() => {
      self.setState({loading:false})
    })
  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderHeader()}
          {this.renderEntry()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderHeader(){
    return(
      <View style={{backgroundColor:mainColor, height:HeaderH}}>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style={{height:HeaderIconW, width:HeaderIconW, borderRadius:HeaderIconW/2, backgroundColor:'white'}} />
          </View>
          <View style={{flex:2, justifyContent:'center', paddingRight:20}}>
            <Text style={styles.headerTextMain}>商户名称：{'张三'}</Text>
            <View style={{marginTop:10, flexDirection:'row'}}>
              <Text style={[styles.headerTextMain]}>警员编号：</Text>
              <Text style={[styles.headerTextMain, {flex:1}]}>警员编号警员编号警员编号警员编号警员编号警</Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection:'row', paddingVertical:15}}>
          <Text style={styles.headerTextSub}>{'20\n'}<Text style={styles.headerTextSubTitle}>本月被检查</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{'126\n'}<Text style={styles.headerTextSubTitle}>年度被检查</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{'3\n'}<Text style={styles.headerTextSubTitle}>待反馈</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{'2\n'}<Text style={styles.headerTextSubTitle}>待复查</Text></Text>
          <View style={{width:1, backgroundColor:'white'}} />
          <Text style={styles.headerTextSub}>{'2\n'}<Text style={styles.headerTextSubTitle}>审核不通过</Text></Text>
        </View>
      </View>
    )
  }

  renderEntry(){
    return (
      <View style={{backgroundColor:'white', marginTop:10}}>
        <View style={{flexDirection:'row'}}>
          {this.renderEntryItem(Icon1, '待反馈')}
          <View style={{width:1, backgroundColor:borderColor}} />
          {this.renderEntryItem(Icon2, '待复查')}
        </View>
        <View style={{height:1, backgroundColor:borderColor}} />
        <View style={{flexDirection:'row'}}>
          {this.renderEntryItem(Icon3, '已完结')}
          <View style={{width:1, backgroundColor:borderColor}} />
          {this.renderEntryItem(Icon4, '抄送')}
        </View>
      </View>
    );
  }

  renderEntryItem(icon, label, type){
    return (
      <TouchableOpacity onPress={this._onPress.bind(this, type)} activeOpacity={0.8} style={{flex:1, height:EntryItemH, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
        <Image source={icon} style={{width:EntryItemIconW, height:EntryItemIconW, resizeMode:'contain'}}/>
        <Text style={{marginLeft:20, fontSize:18, color:mainTextGreyColor}}>{label}</Text>
      </TouchableOpacity>
    );
  }

  /** Private **/
  _onPress(type){
    Actions.svmCheckedIn({dataType:type})
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
