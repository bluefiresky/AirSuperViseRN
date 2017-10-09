/**
* Created by wuran on 17/06/26.
* 消防网上预约办理
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Swiper from 'react-native-swiper';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const ArrowRight = require('./image/icon-arrow-right-blue.png');
const ItemH = 50;
const SeparatorH = StyleSheet.hairlineWidth;

class APFireControlTypesView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: null
    }
  }

  componentDidMount(){
    this.setState({loading:true});
    let self = this;
    InteractionManager.runAfterInteractions(() => {
      self.props.dispatch( create_service(Contract.POST_GET_FIRE_FIGHTING_LIST, {}))
        .then( res => {
          if(res){
            this.setState({loading:false, data:res.entity.itemList})
          }else{
            this.setState({loading:false})
          }
        })
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        {this.renderTypesList(data)}
        {this.renderEmpty(data)}
        <ProgressView show={loading} />
      </View>
    )
  }

  renderTypesList(data){
    if(data && data.length > 0){
      return(
        <FlatList
          data={data}
          style={{marginTop:10}}
          keyExtractor={(item, index) => index }
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ( {length: (ItemH+SeparatorH), offset: (ItemH+SeparatorH) * index, index} )}
          ItemSeparatorComponent={()=>  <View style={{backgroundColor:borderColor, height:SeparatorH}} /> }
          renderItem={this._renderTypesItem.bind(this)}
        />
      );
    }
  }

  _renderTypesItem({item, index}){
    return(
      <TouchableOpacity onPress={this._goToTempletInfo.bind(this, item, index)} activeOpacity={0.8} style={styles.mainEntryItem} >
        <View style={styles.mainEntryItemImage} />
        <Text style={styles.mainEntryItemText}>{item.reservationProjectTypeTitle}</Text>
        <Image source={ArrowRight} style={styles.mainEntryItemArrow} />
      </TouchableOpacity>
    )
  }

  renderEmpty(data){
    if(data && data.length === 0){
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:16, color:mainTextGreyColor}}>暂无数据</Text>
      </View>
    }
  }

  /** Private **/
  _goToTempletInfo(item, index){
    Actions.apFireControlTemplet({url:item.htmlUrl, record:item});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  mainEntryItem:{
    height:ItemH,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:PaddingHorizontal,
    backgroundColor:'white'
  },
  mainEntryItemImage:{
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor:mainColor,
  },
  mainEntryItemText:{
    marginLeft:15,
    fontSize:15,
    color:mainTextColor,
    flex:1
  },
  mainEntryItemArrow:{
    width:20,
    height:20,
    resizeMode:'contain'
  },
});


const ExportView = connect()(APFireControlTypesView);
ExportView.rightTitle='历史预约'
ExportView.onRight = (props) => {
  Actions.apHistoryList();
}
module.exports.APFireControlTypesView = ExportView
