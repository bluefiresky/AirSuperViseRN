/**
* Created by wuran on 17/06/26.
* 网上预约-新机场车辆通行证申办Home
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, DeviceEventEmitter } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 30;
const ItemH = 90;
const ItemContentW = 200;

const ApplyIcon = require('./image/icon-certificate-apply.png');
const DetailIcon = require('./image/icon-check-detail.png');
const HistoryIcon = require('./image/icon-apply-history.png');

class APCertificateApplyHomeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: null,
      num: null,
    }
  }

  componentDidMount(){
    DeviceEventEmitter.addListener('refreshAPCertificateApplyHomeView', this._onRefresh.bind(this))
    this._onRefresh();
  }

  render(){
    let { loading, data, num } = this.state;

    return(
      <View style={styles.container}>
        {this.renderEntry(data, num)}
        <ProgressView show={loading}/>
      </View>
    )
  }

  renderEntry(data, num){
    if(!data) return null;
    let checker = (data == '06');
    if(checker){
      return (
        <View style={{marginTop:10}}>
          {this.renderItem(DetailIcon, '审核证件信息', 'transparent', 2, num)}
        </View>
      );
    }else{
      return (
        <View style={{marginTop:10}}>
          {this.renderItem(ApplyIcon, '证件申请', borderColor, 1)}
          {this.renderItem(HistoryIcon, '历史申请记录', 'transparent', 3)}
        </View>
      );
    }
  }

  renderItem(icon, label, bc, type, num){
    return (
      <TouchableOpacity onPress={this._onItemPress.bind(this, type)} activeOpacity={0.8} style={{height:ItemH, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
        <View style={{flexDirection:'row', alignItems:'center', width:ItemContentW}}>
          <Image source={icon} style={{height:30, width:30, resizeMode:'contain'}} />
          <Text style={{color:mainTextColor, fontSize:18, marginLeft:20}}>{label}</Text>
          {(num || num == 0)? <Text style={{color:'red', fontSize:16}}>{`（${num}）`}</Text> : null}
        </View>
        <View style={{backgroundColor:bc, height:1, position:'absolute', bottom:0, left:PaddingHorizontal, right:PaddingHorizontal}} />
      </TouchableOpacity>
    );
  }

  _onItemPress(type){
    if(type == 1){
      Actions.apSelectPartment();
    }else if(type == 2){
      Actions.apCertificateCheckRecords();
    }else if(type == 3){
      Actions.apCertificateApplyHistory();
    }
  }

  /** Method **/
  _verifyEntryRole(source, targetList){
    if(source && source.length > 0){
      for(let i=0; i<source.length; i++){
        let r = source[i];
        if(targetList.indexOf(r.roleNum) != -1) return r;
      }

      return false;
    }else{
      return false;
    }
  }

  _onRefresh(refresh){
    if(global.profile){
      let role = this._verifyEntryRole(global.profile.roleNums, ['06'])
      if(role) {
        this.setState({data:'06', loading:true})
        this.props.dispatch(create_service(Contract.POST_GET_AIRPORTCARD_ISEXISTS_APPROVE_LISTS_COUNT, {}))
          .then( res => {
            if(res) this.setState({loading:false, num:res.entity.counts})
            else this.setState({loading:false})
          })
      }
      else this.setState({data:'00'})
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(APCertificateApplyHomeView);

module.exports.APCertificateApplyHomeView = ExportView;
