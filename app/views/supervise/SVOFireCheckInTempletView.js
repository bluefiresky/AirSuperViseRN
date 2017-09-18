/**
* Created by wuran on 17/06/26.
* 安全监管首页-官方(Official)
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const ComponentW = (W - 30);

class SVOFireCheckInTempletView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentDidMount(){
    // 保证动画加载完成，在进行其他耗时操作
    let self = this;
    InteractionManager.runAfterInteractions(() => {
      self.setState({loading: true})
      self.timer = setTimeout(function () {
        self.setState({loading: false})
      }, 1000);
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <Text style={{fontSize: 20, color: 'black'}} onPress={()=> Actions.login()}>SVOSearchView</Text>
        <ProgressView show={loading} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const ExportView = connect()(SVOFireCheckInTempletView);

module.exports.SVOFireCheckInTempletView = ExportView;
