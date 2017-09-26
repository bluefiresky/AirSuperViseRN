/**
* Created by wuran on 17/06/26.
* 安全监管首页-官方(Official)
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, placeholderColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, InputWithIcon } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */

const ItemH = 50;
const ArrowRight = require('./image/icon-arrow-right.png');

class SVOSearchPoliceView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      airPoliceList: null,
      firePoliceList: null,
    }

  }

  componentDidMount(){
    this.setState({loading:true})
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch( create_service(Contract.POST_GET_SUPERVISE_CHECK_POLICE, {}))
        .then( res => {
          if(res) this.setState({loading:false, airPoliceList:res.entity.airPoliceList, firePoliceList:res.entity.firePoliceList})
          else this.setState({loading:false})
        })
    })
  }

  render(){
    let { loading, airPoliceList, firePoliceList } = this.state;

    return(
      <View style={styles.container}>
        {this.renderItem('空防类民警', airPoliceList)}
        <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        {this.renderItem('消防类民警', firePoliceList)}
        <ProgressView show={loading} />
      </View>
    )
  }

  renderItem(label, data){
    return (
      <TouchableOpacity onPress={this._onItemPress.bind(this, data)} activeOpacity={0.8} style={{backgroundColor:'white', height:ItemH, flexDirection:'row', alignItems:'center', paddingHorizontal:20}}>
        <Text style={{color:mainTextGreyColor, fontSize:16, flex:1}}>{label}</Text>
        <Image source={ArrowRight} style={{height:15, width:15, resizeMode:'contain'}}/>
      </TouchableOpacity>
    );
  }


  /** Private **/
  _onItemPress(data){
    if(!data) return;

    Actions.policeList({
      data,
      modalCallback:(item) => {
        Actions.pop();
        this.props.callback(item);
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

const ExportView = connect()(SVOSearchPoliceView);

module.exports.SVOSearchPoliceView = ExportView;
