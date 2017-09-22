/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ImagePicker from 'react-native-image-picker';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, inputLeftColor, inputRightColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const LabelW = 80;
const PaddingHorizontal = 20;
const ItemH = 50;
const PhotoW = ((W - PaddingHorizontal*2)/3) - 20;
const SubmitButtonW = W - (30 * 2);
const AutoGrowingInputMinH = Platform.select({android:100, ios:100})

const CameraIcon = require('./image/camera.png');
const PhotoOption = {
  title: '选择照片', //选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', //调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: '从手机相册选择', //调取相册的按钮，可以设置为空使用户不可选择相册照片
  mediaType: 'photo',
  maxWidth: 750,
  maxHeight: 1000,
  quality: 0.5,
  storageOptions: { cameraRoll:true, skipBackup: true, path: 'images' }
}

class SVMCheckedInDetailView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: props.record,
      pickerPhotos: [{photo:null},{photo:null},{photo:null}],
      measure: null
    }

    this._onMeasureTextChange = this._onMeasureTextChange.bind(this);
    this._submit = this._submit.bind(this);
  }

  // componentDidMount(){
  //   let self = this;
  //   self.setState({loading: true})
  //
  //   InteractionManager.runAfterInteractions(() => {
  //     self.timer = setTimeout(function () {
  //       self.setState({loading:false, data:{}})
  //     }, 500);
  //   })
  // }
  //
  // componentWillUnmount(){
  //
  // }

  render(){
    let { loading, data, measure, pickerPhotos } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderResult(data)}
          {this.renderSumitData(data, measure, pickerPhotos)}
          {this.renderSubmitButton(data)}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderResult(data){
    if(!data) return null;

    return(
      <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>检查情况</Text>
        <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        <View style={{paddingHorizontal:PaddingHorizontal}}>
          {this.renderResultTypeItem('检查类型：', data.listTypeName, data.checkListStatusName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('创建时间：', data.createTime)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('创建民警：', '')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('警员编号：','')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('被检查商户：', data.companyName)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('商户联系人：', '')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('联系方式：', '')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderHeightResultItem('情况描述：', '')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderPhotoItem(data.livePhotos)}
        </View>
      </View>
    )
  }

  renderSumitData(data, measure, pickerPhotos){
    if(!data) return null;

    return(
      <View style={{paddingHorizontal:PaddingHorizontal, backgroundColor:'white', marginTop:10}}>
        <Text style={{fontSize:17, color:mainTextColor, alignSelf:'center', marginVertical:15}}>商户反馈</Text>
        <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        <View style={{paddingHorizontal:PaddingHorizontal}}>
          {this.renderResultItem('提交人：', '')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderResultItem('联系方式：', '')}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderAutoGrowing(measure)}
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          {this.renderPhotoPicker(pickerPhotos)}
        </View>
      </View>
    )
  }

  renderResultTypeItem(label, content, type){
    return(
      <View style={{height:ItemH, flexDirection:'row', alignItems:'center'}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>{label}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16, flex:1}}>{content}</Text>
        <View style={{height:30, justifyContent:'center', paddingHorizontal:15, borderColor:'red', borderRadius:15, borderWidth:StyleSheet.hairlineWidth}}>
          <Text style={{color:'red', fontSize:16}}>{type}</Text>
        </View>
      </View>
    )
  }

  renderResultItem(label, content){
    return(
      <View style={{height:ItemH, flexDirection:'row', alignItems:'center'}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>{label}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16}}>{content}</Text>
      </View>
    )
  }

  renderHeightResultItem(label, content){
    return(
      <View style={{paddingVertical:15, flexDirection:'row'}}>
        <Text style={{color:mainTextColor, fontSize:16, width:100}}>{label}</Text>
        <Text style={{color:mainTextGreyColor, fontSize:16}}>{content}</Text>
      </View>
    )
  }

  renderPhotoItem(photos){
    if(photos){
      return(
        <View style={{paddingVertical:15}}>
          <Text style={{color:mainTextColor, fontSize:16, width:150}}>现场照片采集：</Text>
          <View style={{flexDirection:'row', flexWrap:'wrap'}} >
            {
              photos.map((item, index) => {
                return(
                  <Image key={index} source={item.source} style={{width:PhotoW, height:PhotoW, resizeMode:'contain', backgroundColor:'lightskyblue', marginRight:10, marginTop:10}} />
                )
              })
            }
          </View>
        </View>
      )
    }
  }

  renderAutoGrowing(content){
    return(
      <View style={{paddingVertical:15, backgroundColor:'white'}}>
        <Text style={{width: 150, color: inputLeftColor, fontSize: 16 }}>整改措施：</Text>
        <AutoGrowingTextInput
          style={styles.autoTextInput}
          value={content}
          underlineColorAndroid={'transparent'}
          placeholder={''}
          placeholderTextColor={placeholderColor}
          onChangeText={this._onMeasureTextChange}
          minHeight={AutoGrowingInputMinH}
        />
      </View>
    )
  }


  renderPhotoPicker(data){
    return(
      <View style={{paddingVertical:15, backgroundColor:'white'}}>
        <Text style={[styles.starStyle, {color:'transparent'}]}><Text style={styles.labelStyle}>现场照片</Text></Text>
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
                <TouchableOpacity onPress={this._pickPhoto.bind(this, item, index, false)} activeOpacity={0.8} style={{width:PhotoW, height:PhotoW, backgroundColor:mainBackColor, borderColor, borderWidth:1, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                  {
                    !item.photo?<Image source={CameraIcon} style={{width:30, height:25, resizeMode:'contain'}} />:
                    <Image source={item.photo} style={{width:PhotoW, height:PhotoW}} />
                  }

                </TouchableOpacity>
              </View>
            )
          })}
      </View>
    )
  }

  renderSubmitButton(data){
    if(!data) return null;
    else{
      return(
        <View style={{alignItems:'center', justifyContent:'center', paddingVertical:20}}>
          <XButton onPress={this._submit} title='确认提交' style={{backgroundColor:mainColor, width:SubmitButtonW, height:40, borderRadius:20}} />
        </View>
      )
    }
  }

  /** Private **/
  _pickPhoto(item, index, rePick){
    if(item.photo && !rePick){
      this.currentPhotoIndex = index;
      Actions.bigImage({source:item.photo, operation:{rePick:this._rePickCallback, clear:this._deletePhotoCallback}})
    }else{
      ImagePicker.showImagePicker(PhotoOption, (response) => {
        if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
          // console.log(' CFTempCertificateLostView _pickPhoto and the response -->> ', response);
          item.photo = {uri:`data:image/jpeg;base64,${response.data}`, isStatic:true}
          this.forceUpdate();
        }
      });
    }
  }

  _onMeasureTextChange(text){
    this.setState({measure:text})
  }

  _submit(){
    let params = this._convertToSubmitParams();
    if(params){
      this.props.dispatch( create_service('', params))
        .then( res => {
          if(res) Actions.success({successType:'submit1'});
        })
    }
  }

  _convertToSubmitParams(){
    let params = null;
    if(!this.state.measure){
      Toast.showShortCenter('整改措施不能为空');
    }else {
      let { pickerPhotos, measure } = this.state;
      params = {
        livePhotos:this._convertPhotosUri(pickerPhotos),
        measure
      }
    }

    console.log( ' the submit params -->> ', params);
    return params;
  }

  _convertPhotosUri(photos){
    let submit = [];
    for(let i=0; i<photos.length; i++){
      let p = photos[i];
      if(p.photo) submit.push(p.photo.uri.replace('data:image/jpeg;base64,',''))
    }
    return JSON.stringify(submit);
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  },
  starStyle:{
    color:'transparent',
    fontSize:14,
    width:LabelW
  },
  labelStyle:{
    color:inputLeftColor,
    fontSize:16
  },
  autoTextInput:{
    marginTop:10,
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

const ExportView = connect()(SVMCheckedInDetailView);

module.exports.SVMCheckedInDetailView = ExportView
