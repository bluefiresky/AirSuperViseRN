/**
* Created by wuran on 17/06/26.
* 违法举报-举报历史详情
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, inputRightColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, Input } from '../../components/index.js';  /** 自定义组件 */
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
      postingType:'安全隐患举报',
      emergentLevel:'非常紧急',
      address:'你猜',
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      reporter:'张三',
      reporterID:'3874019374973597938'
    }
  }

  componentDidMount(){
    // 保证动画加载完成，在进行其他耗时操作
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false})
      }, 1000);
    })
  }

  componentWillUnmount(){

  }

  render(){
    let { loading, postingType, emergentLevel, address, pickerPhotos, reporter, reporterID } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} >
          {this.renderImportance(postingType, emergentLevel, address)}
          {this.renderUnimportance(pickerPhotos, reporter, reporterID)}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderImportance(postingType, emergentLevel, address){
    return(
      <View style={{marginTop:10, backgroundColor:'white'}}>
        <Input label={'举报类型：'} value={postingType} editable={false} labelWidth={LabelW} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderAutoGrowing(null)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'紧急程度：'} value={emergentLevel} editable={false} labelWidth={LabelW} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报地点：'} value={address} editable={false} labelWidth={LabelW} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
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
        />
      </View>
    )
  }

  /**
  * 选填
  */
  renderUnimportance(pickerPhotos, reporter, reporterID){
    return(
      <View style={{backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, marginVertical:15, alignSelf:'center'}}>选填信息</Text>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        {this.renderPhotoPicker(pickerPhotos)}
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人姓名：'} value={reporter} labelWidth={140} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
        <View style={{backgroundColor:borderColor, height:StyleSheet.hairlineWidth, marginHorizontal:PaddingHorizontal }} />
        <Input label={'举报人身份证号：'} value={reporterID} labelWidth={140} noBorder={true} style={{height:InputH, paddingLeft:PaddingHorizontal}}/>
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingHorizontal:PaddingHorizontal, paddingVertical:15}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}><Text style={styles.labelStyle}>举报照片：</Text></Text>
        {this._renderPhotoPickerItem(data)}
      </View>
    )
  }

  _renderPhotoPickerItem(data){
    return(
      <View style={{flexDirection:'row', marginTop:10}}>
        {data.map((item, index) => {
            return(
              <View key={index} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity activeOpacity={0.8} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor, borderColor, borderWidth:1, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                  {
                    !item.photo?<Image source={CameraIcon} style={{width:30, height:25, resizeMode:'contain'}} />:
                    <Image source={item.photo} style={{width:PhotoW, height:PhotoW, resizeMode:'contain', backgroundColor:'lightskyblue'}} />
                  }

                </TouchableOpacity>
              </View>
            )
          })}
      </View>
    )
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
    marginHorizontal:17,
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
