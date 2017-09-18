/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, placeholderColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 10;
const ItemH = 100;
const ItemTitleH = 40;
const SeparatorH = 10;

const ExampleList = [
  {title:'AAAAA', date:'2012-06-12 00:00', num:'12345', status:'预约成功', statusColor:'green'},
  {title:'AAAAA', date:'2012-06-12 00:00', num:'12345', status:'未按期办理', statusColor:'red'},
  {title:'AAAAA', date:'2012-06-12 00:00', num:'12345', status:'已完结', statusColor:'blue'}
];

class APHistoryListView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data:null
    }
  }

  componentDidMount(){
    this.setState({loading: true})
    let self = this;
    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false, data:ExampleList})
      }, 1000);
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        {this.renderEmpty(data)}
        {this.renderHistoryList(data)}
        <ProgressView show={loading} />
      </View>
    )
  }

  renderEmpty(data){
    if(data && data.length === 0){
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:16, color:mainTextGreyColor}}>暂无历史数据</Text>
      </View>
    }
  }

  renderHistoryList(data){
    if(data && data.length > 0){
      return(
        <FlatList
          data={data}
          style={{marginTop:10, marginHorizontal:PaddingHorizontal}}
          keyExtractor={(item, index) => index }
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ( {length: (ItemH+SeparatorH), offset: (ItemH+SeparatorH) * index, index} )}
          ItemSeparatorComponent={()=>  <View style={{backgroundColor:mainBackColor, height:SeparatorH}} /> }
          renderItem={this._renderHistoryItem.bind(this)}
        />
      );
    }
  }

  _renderHistoryItem({item, index}){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, height:ItemH, backgroundColor:'white'}}>
        <View style={{flexDirection:'row', height:ItemTitleH, alignItems:'center'}}>
          <Text style={{fontSize:16, color:mainTextColor, includeFontPadding:false, flex:1}} numberOfLines={1}>{item.title}</Text>
          <View style={{marginRight:10, backgroundColor:item.statusColor, height:16, borderRadius:8, paddingHorizontal:5, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'white', includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.status}</Text>
          </View>
        </View>
        <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        <View style={{flex:1, justifyContent:'center'}}>
          <Text style={{fontSize:14, color:placeholderColor, includeFontPadding:false, textAlign:'justify', textAlignVertical:'center'}}>
            预约时间：{item.date}
          </Text>
          <Text style={{fontSize:14, color:mainColor, includeFontPadding:false, textAlign:'justify', textAlignVertical:'center', marginTop:5}}>
            预约号：{item.num}
          </Text>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(APHistoryListView);

module.exports.APHistoryListView = ExportView
