/**
* Created by wuran on 17/06/26.
* 证件管理-记分管理
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
const ItemH = 100;
const EmptyW = (2*W)/3;
const EmptyImageW = W/3;
const EmptyMarginTop = W/10;

// const ExampleList = [
//   {status:'已扣分', statusColor:'grey', content:'跨区违规执勤', score:'-3', date:'2012年12月21 06:06:06'},
//   {status:'复议审核中', statusColor:'rgb(255, 176, 91)', content:'跨区违规执勤', score:'-3', date:'2012年12月21 06:06:06'},
//   {status:'复议成功', statusColor:'green', content:'跨区违规执勤', score:'-3', date:'2012年12月21 06:06:06'},
//   {status:'复议失败', statusColor:'red', content:'跨区违规执勤', score:'-3', date:'2012年12月21 06:06:06'},
// ];

const CheckStatusName = {
  '1':{label:'已扣分', color:'grey'},
  '2':{label:'复议审核中', color:'rgb(255, 176, 91)'},
  '3':{label:'复议成功', color:'green'},
  '9':{label:'复议失败', color:'red'}
}

const ArrowRight = require('./image/icon-arrow-right-blue.png');

class CFScoreManagerView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: null,
    }

    this._refresh = this._refresh.bind(this);
  }

  componentDidMount(){
    this.setState({loading:true})
    InteractionManager.runAfterInteractions(() => {
      this._refresh(true);
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
          onRefresh={this._refresh.bind(this, false)}
          refreshing={this.state.loading}
          renderItem={this._renderListItem.bind(this)}
        />
      );
    }
  }

  _renderListItem({item, index}){
    return(
      <TouchableOpacity onPress={this._goDetail.bind(this, item, index)} activeOpacity={0.8} style={{height:ItemH, paddingHorizontal:PaddingHorizontal, backgroundColor:'white'}}>
        <View style={{height:50, flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontSize:16, color:mainTextGreyColor}}>{item.createdTime}</Text>
          <Text style={{fontSize:16, color:'red', flex:1, marginLeft:20}}>{item.deductionScore}</Text>
          <View style={{marginRight:10, backgroundColor:item.checkStatus.color, height:18, borderRadius:9, paddingHorizontal:8, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'white', includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.checkStatus.label}</Text>
          </View>
        </View>

        <View style={{backgroundColor:borderColor, height:1}} />

        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontSize:14, color:mainTextGreyColor, flex:1}}>{item.legalProvisionContents}</Text>
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

  /** private **/
  _goDetail(item, index){
    Actions.cfScoreDetail({record:item, refreshScoreList:this._refresh.bind(this, false)});
  }

  _refresh(init){
    if(!init) this.setState({loading:true})
    let self = this;
    self.props.dispatch( create_service(Contract.POST_GET_CERTIFICATE_DEDUCTION_LIST, {}))
      .then( res => {
        if(res){
          let data = [];
          let list = res.entity;
          for(let i=0; i<list.length; i++){
            let { deductionScore, checkStatus, createdTime, id, legalProvisionContents } = list[i];
            data.push({deductionScore:`-${deductionScore}分`, checkStatus:CheckStatusName[checkStatus], createdTime, id, legalProvisionContents:legalProvisionContents[0].content})
          }
          self.setState({loading:false, data})
        }else{
          self.setState({loading:false})
        }
      })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(CFScoreManagerView);

module.exports.CFScoreManagerView = ExportView
