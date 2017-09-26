/**
* Created by wuran on 17/06/26.
* 消防网上预约办理
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, WebView } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Swiper from 'react-native-swiper';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const AppointmentH = 70;
const ButtonH = 36;
const Headers = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36'
}

class APFireControlTempletView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      url:null,
      date:null,
    }
  }

  componentDidMount(){
    this.setState({loading:true});
    let self = this;
    InteractionManager.runAfterInteractions(() => {
      self.setState({url:'https://www.baidu.com'})
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, url, date } = this.state;

    return(
      <View style={styles.container}>
        <View style={{flex:1}}>
          {this.renderWeb(url)}
        </View>
        {this.renderAppointment(date)}
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
        source={{uri:url, headers:Headers}}
        style={{flex: 1}}
        onNavigationStateChange={this._onNavigationStateChange}
        startInLoadingState={true}
        onLoadEnd={() => this.setState({loading:false}) }/>
    )
  }

  renderAppointment(date){
    let show = date? {value:date, text:mainTextGreyColor} : {value:'请选择预约日期', text:placeholderColor}
    return(
      <View style={{height:AppointmentH, flexDirection:'row', paddingHorizontal:PaddingHorizontal, alignItems:'center'}}>
        <TouchableOpacity activeOpacity={0.8} style={{flex:1, height:ButtonH, borderRadius:ButtonH/2, backgroundColor:'white', justifyContent:'center'}}>
          <Text style={{paddingLeft:10, fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{show.value}</Text>
        </TouchableOpacity>
        <View style={{width:10}} />
        <XButton title='预约' style={{width:100, height:ButtonH, borderRadius:ButtonH/2}} />
      </View>
    )
  }

  /** Private **/

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
});


const ExportView = connect()(APFireControlTempletView);

module.exports.APFireControlTempletView = ExportView
