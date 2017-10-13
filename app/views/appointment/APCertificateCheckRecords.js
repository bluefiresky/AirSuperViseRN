/**
* Created by wuran on 17/06/26.
* 证件审核信息
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

const ApprveStatus = {'01':'待专员审核', '11':'待保卫干部审核', '10':'专员驳回', '21':'待保领导审核', '20':'保卫干部驳回', '31':'领导通过', '30':'领导驳回'}
const ArrowRight = require('./image/icon-arrow-right-blue.png');

class APCertificateCheckRecords extends Component {

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
      self.props.dispatch( create_service(Contract.POST_GET_AIRPORTCARD_APPROVE_LISTS, {}))
        .then( res => {
          if(res) this.setState({loading:false, data:res.entity.toApproveformslist})
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
          <Text style={{fontSize:16, color:mainTextColor}}>{`申请人：${item.ownerName?item.ownerName : item.ownCompanyName}`}</Text>
          <Text style={{fontSize:16, color:mainTextColor, flex:1, paddingLeft:10}}>{item.ownerPhoneNo}</Text>
          <Text style={{fontSize:14, color:'red'}}>{ApprveStatus[item.approveStatus]}</Text>
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
    Actions.apCertificateCheckDetail({record:item});
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(APCertificateCheckRecords);

module.exports.APCertificateCheckRecords = ExportView
