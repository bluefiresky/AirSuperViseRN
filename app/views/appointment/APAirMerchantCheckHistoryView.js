/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 15;
const ItemH = 120;
const EmptyW = (2*W)/3;
const EmptyImageW = W/3;
const EmptyMarginTop = W/10;

const ExampleList = [
  {status:'待审核', statusColor:'rgb(255, 176, 91)', merchant:'肯德基', applyer:'张三', date:'2012年12月21 06:06:06'},
  {status:'审核通过', statusColor:'rgb(42, 215, 143)', merchant:'肯德基', applyer:'张三', date:'2012年12月21 06:06:06'},
  {status:'审核不通过', statusColor:'red', merchant:'肯德基', applyer:'张三', date:'2012年12月21 06:06:06'},
];

const ArrowRight = require('./image/icon-arrow-right-blue.png');

class APAirMerchantCheckHistoryView extends Component {

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
      self.timer = setTimeout(function () {
        self.setState({loading: false, data:ExampleList})
      }, 1000);
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
          <Text style={{fontSize:16, color:mainTextColor, flex:1}}>{item.merchant}</Text>
          <View style={{marginRight:10, backgroundColor:item.statusColor, height:18, borderRadius:9, paddingHorizontal:8, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'white', includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.status}</Text>
          </View>
        </View>

        <View style={{backgroundColor:borderColor, height:1}} />

        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:14, color:mainTextGreyColor}}>创建时间：{item.date}</Text>
            <Text style={{fontSize:14, color:mainTextGreyColor, marginTop:10}}>申请人：{item.applyer}</Text>
          </View>
          <Image source={ArrowRight} style={{width:25, height:25, resizeMode:'contain'}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderEmptyView(data){
    if(data && data.length === 0){
      return(
        <View style={{alignSelf:'center', width:EmptyW, alignItems:'center', marginTop:EmptyMarginTop}}>
          <View style={{backgroundColor:'lightskyblue', width:EmptyImageW, height:EmptyImageW}} />
          <Text style={{fontSize:18, color:mainTextColor, marginTop:30}}>暂无数据</Text>
        </View>
      )
    }
  }

  /** private **/
  _goDetail(item, index){
    Actions.apAirMerchantCheckDetail();
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(APAirMerchantCheckHistoryView);

module.exports.APAirMerchantCheckHistoryView = ExportView
