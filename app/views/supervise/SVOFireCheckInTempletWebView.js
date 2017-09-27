/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, WebView } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */


class SVOFireCheckInTempletWebView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      url:null
    }
    this._onMessage = this._onMessage.bind(this);
  }

  componentDidMount(){
    this.setState({loading:true})
    InteractionManager.runAfterInteractions(()=>{
      if(this.props.url){
        this.setState({url:this.props.url})
      }else{
        this.setState({loading:false})
      }
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, url } = this.state;

    return(
      <View style={styles.container}>
        {this.renderWeb(url)}
        <ProgressView show={loading} />
      </View>
    )
  }

  renderWeb(url){
    if(!url) return null;

    return(
      <WebView
        scalesPageToFit={true}
        javaScriptEnabled={true}
        source={{uri:url}}
        style={{flex: 1}}
        onNavigationStateChange={this._onNavigationStateChange}
        startInLoadingState={true}
        onMessage={this._onMessage}
        onLoadEnd={() => this.setState({loading:false}) }/>
    )
  }

  /** Private Method **/
  _onNavigationStateChange(navState){
    console.log('ApplyContract onNavigationStateChange -->> navState: ', navState);
  }

  _onMessage(event){
    console.log(' execute onMessage and the event data -->> ', event.nativeEvent.data);
    if(this.props.callback) this.props.callback('3', '模板二', event.nativeEvent.data)
    Actions.popTo('svoFireCheckIn')
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(SVOFireCheckInTempletWebView);

module.exports.SVOFireCheckInTempletWebView = ExportView
