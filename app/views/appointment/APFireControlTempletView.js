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

class APFireControlTempletView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: props.record,
      url:null,
      date:null,
      time:null
    }

    this._pickDate = this._pickDate.bind(this);
    this._submit = this._submit.bind(this);
  }

  componentDidMount(){
    this.setState({loading:true, url:this.props.url});
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, url, date, time } = this.state;

    return(
      <View style={styles.container}>
        <View style={{flex:1}}>
          {this.renderWeb(url)}
        </View>
        {this.renderAppointment(date, time)}
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
        onLoadEnd={() => this.setState({loading:false}) }/>
    )
  }

  renderAppointment(date, time){
    let show = date? {value:date+' '+time, text:mainTextGreyColor} : {value:'请选择预约日期', text:placeholderColor}
    return(
      <View style={{height:AppointmentH, flexDirection:'row', paddingHorizontal:PaddingHorizontal, alignItems:'center'}}>
        <TouchableOpacity onPress={this._pickDate} activeOpacity={0.8} style={{flex:1, height:ButtonH, borderRadius:ButtonH/2, backgroundColor:'white', justifyContent:'center'}}>
          <Text style={{paddingLeft:10, fontSize:14, color:show.text, includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{show.value}</Text>
        </TouchableOpacity>
        <View style={{width:10}} />
        <XButton onPress={this._submit} title='预约' style={{width:100, height:ButtonH, borderRadius:ButtonH/2}} />
      </View>
    )
  }

  /** Private **/
  _pickDate(){
    Actions.appointmentDatePicker({modalCallback:(date, time) => {
      this.setState({date, time})
    }})
  }

  _submit(){
    let { date, time, data } = this.state;
    if(!date){
      Toast.showShortCenter('请选择日期')
      return;
    }

    if(global.profile){
      this.setState({loading:true})
      let params = { itemId: data.itemId, reservationDueDate: date, dayHalfType: this._convertTime(time), phone:global.profile.phoneNum }
      this.props.dispatch( create_service(Contract.POST_FIRE_FIGHTING_SUBMIT_RESERVATION, params) )
        .then( res => {
          if(res) {
            Actions.appointmentSuccess({type:'replace', title:'提交成功', record:res.entity})
          }else{
            this.setState({loading:false})
          }
        })
    }
  }

  _convertTime(time){
    if(time == '上午') return '1';
    else if(time == '下午') return '2';
  }

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
