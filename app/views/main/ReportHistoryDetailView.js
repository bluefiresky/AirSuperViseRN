/**
* Created by wuran on 17/06/26.
* 我要举报-举报历史详情
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, inputRightColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, Input, InputAutoGrowing } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 100;
const PaddingHorizontal = 20;
const SubmitButtonW = W - (30 * 2);
const InputH = 45;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');

class ReportHistoryDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      reportNum: props.record.reportNum,
      data: null,
    }
  }

  componentDidMount(){
    // 保证动画加载完成，在进行其他耗时操作
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch( create_service(Contract.POST_GET_REPORT_DETAIL, {reportNum:this.state.reportNum}))
        .then( res => {
          if(res){
            this.setState({loading:false, data:res.entity})
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
        <ScrollView showsVerticalScrollIndicator={false} >
          {this.renderImportance(data)}
          {this.renderUnimportance(data)}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderImportance(data){
    if(!data) return null;

    return(
      <View style={{marginTop:10, backgroundColor:'white'}}>
        <Input label={'举报类型：'} value={data.reportTypeName} editable={false} labelWidth={LabelW} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderAutoGrowing(data.illegalDetails)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'紧急程度：'} value={data.urgentTypeName} editable={false} labelWidth={LabelW} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <InputAutoGrowing label={'举报地点：'} value={data.reportAddress} editable={false} labelWidth={LabelW} noBorder={true} style={{paddingLeft:PaddingHorizontal}}/>
      </View>
    )
  }

  renderAutoGrowing(content){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal}}>
        <View style={{flexDirection:'row', height:InputH, alignItems:'center'}}>
          <Text style={[styles.starStyle, {width:150}]}><Text style={styles.labelStyle}>填写违法信息：</Text></Text>
        </View>
        <AutoGrowingTextInput
          style={[styles.autoTextInput, {color:inputRightColor}]}
          value={content}
          underlineColorAndroid={'transparent'}
          placeholder={''}
          placeholderTextColor={placeholderColor}
          minHeight={AutoGrowingInputMinH}
          maxHeight={100}
          editable={false}
        />
      </View>
    )
  }

  /**
  * 选填
  */
  renderUnimportance(data){
    if(!data) return null;

    return(
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, marginVertical:15, alignSelf:'center'}}>选填信息</Text>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderPhotoItem(data.photoList)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人姓名：'} value={data.reporterName} editable={false} labelWidth={140} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <InputAutoGrowing label={'举报人身份证号：'} value={data.reporterId} editable={false} labelWidth={140} noBorder={true} style={{paddingLeft:PaddingHorizontal}}/>
      </View>
    )
  }

  renderPhotoItem(photos){
    if(photos){
      return(
        <View style={{paddingVertical:15, paddingHorizontal:PaddingHorizontal}}>
          <Text style={{color:mainTextColor, fontSize:16, width:150}}>举报照片：</Text>
            <View style={{flexDirection:'row', marginTop:10}}>
              {photos.map((item, index) => {
                return(
                  <TouchableOpacity key={index} onPress={this._checkBigImage.bind(this, {uri:item.photoUrl})} activeOpacity={0.8} style={{flex:1, height:PhotoW, justifyContent:'center', alignItems:'center'}}>
                    <Image source={{uri:item.photoUrl}} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor}} />
                  </TouchableOpacity>
                )
              })}
            </View>
        </View>
      )
    }
  }

  /** Private **/
  _checkBigImage(source){
    Actions.bigImage({source})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  starStyle:{
    color:'red',
    fontSize:14,
    width:LabelW
  },
  labelStyle:{
    color:inputLeftColor,
    fontSize:16
  },
  contentStyle:{
    color:inputRightColor,
    fontSize:16
  },
  autoTextInput:{
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

const ExportView = connect()(ReportHistoryDetailView);

module.exports.ReportHistoryDetailView = ExportView
