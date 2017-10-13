/**
* Created by wuran on 17/06/26.
* 证件申请历史记录
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 15;
const ItemH = 100;
const EmptyW = (2*W)/3;
const EmptyImageW = W/3;
const EmptyMarginTop = W/10;

// const ExampleList = [
//   {name:'张三', phone:'010-1223344', merchant:'A单位', status:'已审核通过', statusColor:'rgb(0,215,149)'},
//   {name:'李四', phone:'010-345234', merchant:'B单位', status:'等待领导审核', statusColor:'rgb(14,140,229)'},
//   {name:'王五', phone:'010-345234', merchant:'C单位', status:'等待保卫干部审核', statusColor:'rgb(255,176,92)'},
//   {name:'曹六', phone:'010-345234', merchant:'D单位', status:'审核不通过', statusColor:'rgb(255,95,129)'}
// ];

const ApprveStatus = {
  '01':{text:'待专办员审核', color:'rgb(255,176,92)'},
  '11':{text:'待保卫干部审核', color:'rgb(255,176,92)'},
  '21':{text:'待民警审核', color:'rgb(14,140,229)'},
  '10':{text:'专办员审核不通过', color:'rgb(255,95,129)'}, '20':{text:'保卫干部审核不通过', color:'rgb(255,95,129)'},  '30':{text:'民警审核不通过', color:'rgb(255,95,129)'},
  '31':{text:'民警审核通过', color:'rgb(0,215,149)'},
}

const ArrowRight = require('./image/icon-arrow-right-blue.png');

class APCertificateApplyHistoryView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: null,
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.props.dispatch( create_service(Contract.POST_GET_AIRPORTCARD_HISTORY_APPROVE_LIST, {}))
        .then( res => {
          if(res) this.setState({loading:false, data:res.entity.applyRecordList})
          else this.setState({loading:false})
        })
    })
  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        {this.renderList(data)}
        {this.renderEmptyView(data)}
        <ProgressView show={loading} />
      </View>
    )
  }

  renderList(data){
    if(data && data.length > 0){
      return(
        <FlatList
          data={data}
          style={{marginTop:10}}
          keyExtractor={(item, index) => index }
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ( {length: ItemH, offset: ItemH * index, index} )}
          ItemSeparatorComponent={()=>  <View style={{height:10}} /> }
          renderItem={this._renderListItem.bind(this)}
        />
      );
    }
  }

  _renderListItem({item, index}){
    return(
      <TouchableOpacity onPress={this._goDetail.bind(this, item, index)} activeOpacity={0.8} style={{height:ItemH, paddingHorizontal:PaddingHorizontal, backgroundColor:'white'}}>
        <View style={{height:50, flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontSize:16, color:mainTextColor}}>{`申请人：${item.ownerName}`}</Text>
          <Text style={{fontSize:16, color:placeholderColor, flex:1, paddingLeft:10}}>{item.ownerPhoneNo}</Text>
          <View style={{paddingHorizontal:5, height:18, borderRadius:9, backgroundColor:ApprveStatus[item.approveStatus].color, justifyContent:'center'}}>
            <Text style={{fontSize:14, color:'white', textAlign:'justify', textAlignVertical:'center', includeFontPadding:false}}>{ApprveStatus[item.approveStatus].text}</Text>
          </View>
        </View>

        <View style={{backgroundColor:borderColor, height:1}} />

        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:16, color:mainTextGreyColor}}>申请单位：{item.approveUnitName}</Text>
          </View>
          <Image source={ArrowRight} style={{width:20, height:20, resizeMode:'contain'}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderEmptyView(data){
    if(data && data.length === 0){
      return(
        <View style={{alignSelf:'center', width:EmptyW, alignItems:'center', marginTop:EmptyMarginTop}}>
          <Text style={{fontSize:18, color:mainTextColor, marginTop:EmptyImageW}}>暂无数据</Text>
        </View>
      )
    }
  }

  /** Private **/
  _goDetail(item, index){
    Actions.apCertificateApplyDetail({record:item});
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(APCertificateApplyHistoryView);

module.exports.APCertificateApplyHistoryView = ExportView
