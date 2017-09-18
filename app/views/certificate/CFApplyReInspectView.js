/**
* Created by wuran on 17/06/26.
* 证件管理-申请复议
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 10;
const SubmitButtonW = W - (30 * 2);
const InputH = 45;

class CFApplyReInspectView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      reason: null
    }
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, reason } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderAutoGrowing(reason)}
          {this.renderSubmitButton()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderAutoGrowing(reason){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15, backgroundColor:'white'}}>
        <Text style={{width: 150, color: inputLeftColor, fontSize: 16 }}>请输入申请理由：</Text>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={reason}
          underlineColorAndroid={'transparent'}
          placeholder={''}
          placeholderTextColor={placeholderColor}
          onChangeText={this._onIntroductionTextChange}
          minHeight={120}
        />
      </View>
    )
  }

  renderSubmitButton(){
    return(
      <View style={{flexDirection:'row', height:80, alignItems:'center', justifyContent:'center'}}>
        <XButton onPress={this._submit} title='提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
      </View>
    )
  }

  /** Private **/
  _submit(){
    Actions.success({successType:'applyReInspect', modalCallback:()=>{
      Actions.popTo('cfScoreManager');
    }})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  autoTextInput:{
    marginTop:15,
    fontSize:15,
    padding:5,
    marginHorizontal:7,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:borderColor,
    backgroundColor:'#FBFBFE',
    includeFontPadding:false,
    textAlign:'left',
    textAlignVertical:'top',
    marginBottom:10,
  }
});

const ExportView = connect()(CFApplyReInspectView);

module.exports.CFApplyReInspectView = ExportView
