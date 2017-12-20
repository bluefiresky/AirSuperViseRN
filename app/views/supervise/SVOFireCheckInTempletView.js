/**
* Created by wuran on 17/06/26.
* 安全监管首页-官方(Official)
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { HOST, W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const ItemH = 120;

class SVOFireCheckInTempletView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
    }

    this._goSelectTemplet = this._goSelectTemplet.bind(this);
  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <View style={{flexDirection:'row'}}>
          {this.renderItem('2', '模板一', '消防监督检查记录', `https://${HOST}/airport-web-api/fire-onereport1.html`)}
          {this.renderItem('3', '模板二', '消防监督检查记录', `https://${HOST}/airport-web-api/fire-report.html`, '(其他形式消防监督检查适用)')}
        </View>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderItem(type, name, label, url, subLabel){
    return (
      <TouchableOpacity onPress={this._goSelectTemplet.bind(this, type, name, url)} activeOpacity={0.8} style={{flex:1, height:ItemH, paddingVertical:15, paddingHorizontal:10}}>
        <View style={{flex:1, backgroundColor:'white', borderColor:borderColor, borderWidth:StyleSheet.hairlineWidth, borderRadius:5, alignItems:'center', justifyContent:'center', paddingHorizontal:15}}>
          <Text style={{color:mainTextGreyColor, fontSize:18}}>{label}</Text>
          {
            !subLabel? null:
            <Text style={{color:placeholderColor, fontSize:12, marginTop:5}}>{subLabel}</Text>
          }
        </View>
      </TouchableOpacity>
    );
  }

  /** Private **/
  _goSelectTemplet(type, name, url){
    Actions.svoFireCheckInTempletWeb({url, moduleName:name, callback:this.props.callback, moduleType:type})
    // Actions.pop();
    // if(this.props.callback) this.props.callback(type, name, JSON.stringify({name:'nicai', age:'woqu'}))
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(SVOFireCheckInTempletView);

module.exports.SVOFireCheckInTempletView = ExportView;
