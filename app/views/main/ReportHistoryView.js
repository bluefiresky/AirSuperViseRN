/**
* Created by wuran on 17/06/26.
* 违法举报-举报历史
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
const ItemH = 110;
const EmptyW = (2*W)/3;
const EmptyImageW = W/3;
const EmptyMarginTop = W/10;

const ArrowRight = require('./image/icon-arrow-right-blue.png');

const ExampleList = [
  {level:'紧急', levelColor:'rgb(255, 176, 91)', type:'违法犯罪举报', reporter:'张三', reportContent:'有人违规乱丢垃圾', date:'2012年12月21 06:06:06'},
  {level:'一般', levelColor:'rgb(42, 215, 143)', type:'违法犯罪举报', reporter:'张三', reportContent:'有人违规乱丢垃圾', date:'2012年12月21 06:06:06'},
  {level:'非常紧急', levelColor:'red', type:'违法犯罪举报', reporter:'张三', reportContent:'有人违规乱丢垃圾', date:'2012年12月21 06:06:06'},
];

const UrgentColor = {'1':'red', '2':'rgb(255, 176, 91)', '3':'rgb(42, 215, 143)'};

class ReportHistoryView extends Component {

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
      this.props.dispatch( create_service(Contract.POST_GET_REPORT_HISTORY, {}))
        .then( res => {
          if(res){
            this.setState({loading:false, data:res.entity.reportList})
          }else{
            this.setState({loading:false})
          }
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
          <Text style={{fontSize:16, color:mainTextGreyColor}}>{item.reportTime}</Text>
          <Text style={{fontSize:16, color:mainColor, flex:1, marginLeft:20}}>{item.reportTypeName}</Text>
          <View style={{marginRight:10, backgroundColor:UrgentColor[item.urgentType], height:18, borderRadius:9, paddingHorizontal:8, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'white', includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.urgentTypeName}</Text>
          </View>
        </View>

        <View style={{backgroundColor:borderColor, height:1}} />

        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:14, color:mainTextGreyColor}}>举报人：{item.reporterName}</Text>
            <Text style={{fontSize:14, color:mainTextGreyColor, marginTop:10}} numberOfLines={1} >举报信息：{item.illegalDetails}</Text>
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
          <Text style={{fontSize:18, color:mainTextColor, marginTop:EmptyImageW}}>暂无数据</Text>
        </View>
      )
    }
  }

  /** Private **/
  _goDetail(item, index){
    Actions.reportHistoryDetail({record:item});
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(ReportHistoryView);

module.exports.ReportHistoryView = ExportView
