/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, inputLeftColor, inputRightColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 20;
const ItemH = 50;
const LabelW = 90;
const PhotoViewW = (W - PaddingHorizontal*2)/3
const PhotoW = PhotoViewW - 20;

const CameraIcon = require('./image/camera.png');

class APAirMerchantCheckDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      pickerPhotos: [{photo:null},{photo:null},{photo:null},{photo:null},{photo:null}],
    }
  }

  componentDidMount(){
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
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderDetail()}
          {this.renderResult()}
          <View style={{height:100}} />
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderDetail(){
    return(
      <View style={{backgroundColor:'white', paddingHorizontal:PaddingHorizontal, marginTop:10}}>
        <Text style={{color:mainTextColor, fontSize:18, marginVertical:15, alignSelf:'center'}}>查看扣分详情</Text>
        <View style={{height:1, backgroundColor:borderColor}} />
        {this.renderMerchantName('肯德基肯德基肯德基肯德基肯', '审核不通过')}
        {this.renderItem('企业法人：', '张三')}
        {this.renderItem('联系人：', '张三')}
        {this.renderItem('联系方式：', '18888888888')}
        {this.renderItem('证件类型：', '营业执照，纳税证明，证件3，证件4，营业执照，纳税证明，证件3，证件4')}
        {this.renderPhotoPicker(this.state.pickerPhotos)}
      </View>
    )
  }

  renderMerchantName(name, status){
    return(
      <View style={{height:60, flexDirection:'row', alignItems:'center'}}>
        <Text style={styles.itemLabel}>企业名称：</Text>
        <Text style={[styles.itemContent, {flex:1}]}>{name}</Text>
        <View style={{height:34, paddingHorizontal:10, alignItems:'center', justifyContent:'center', borderColor:'red', borderWidth:StyleSheet.hairlineWidth, borderRadius:17}}>
          <Text style={{color:'red', fontSize:16}}>{status}</Text>
        </View>
      </View>
    )
  }

  renderPhotoPicker(data){
    return(
      <View style={{paddingVertical:15, backgroundColor:'white'}}>
        <Text style={styles.itemLabel}>证件照片：</Text>
        {this._renderPhotoPickerItem(data)}
      </View>
    )
  }

  _renderPhotoPickerItem(data){
    return(
      <View style={{flexDirection:'row', marginTop:10, flexWrap:'wrap'}}>
        {data.map((item, index) => {
            return(
              <View key={index} style={{width:PhotoViewW, height:PhotoViewW, alignItems:'center', justifyContent:'center'}}>
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

  // 审查结果
  renderResult(){
    return(
      <View style={{backgroundColor:'white', paddingHorizontal:PaddingHorizontal, marginTop:10}}>
        <Text style={{color:mainTextColor, fontSize:18, marginVertical:15, alignSelf:'center'}}>审核结果</Text>
        <View style={{height:1, backgroundColor:borderColor}} />
        {this.renderItem('审核结果：', '不通过')}
        {this.renderItem('审核理由：', '缺少营业执照和运营许可证，同时不注意卫生，没交保护费')}
      </View>
    )
  }

  renderItem(label, content){
    return(
      <View style={{height:ItemH, flexDirection:'row', alignItems:'center'}}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={[styles.itemContent, {flex:1}]}>{content}</Text>
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
  itemLabel:{
    width:LabelW,
    fontSize:16,
    color:inputLeftColor,
  },
  itemContent:{
    fontSize:16,
    color:inputRightColor,
  }
});

const ExportView = connect()(APAirMerchantCheckDetailView);

module.exports.APAirMerchantCheckDetailView = ExportView
