/**
* Created by wuran on 16/12/29.
* Image 公共自定义组件, 可以在接到图片后上传到服务区，并返回图片的服务区地址
* params:
*   1. image -->> rquire('../image/...'), 未获取照片时显示的背景图
*   2. title -->>
*   3. way -->> 获取照片的方式
*   4. mode -->> way对应的具体获取方式
*   5. onReceive -->> 获取的data数据，根据具体的调用方法不同返回的数据也不相同
*/

import React, { Component, PropTypes } from 'react'
import { View, Text, StyleSheet, Image, NativeModules, TouchableWithoutFeedback, ActivityIndicator } from "react-native";

import { connect } from 'react-redux';
import md5 from 'md5';

import { W, mainBule, getResponsiveSize, formLeftText } from '../../configs/index.js';

import * as Contract from '../../service/contract.js';
import { create_service } from '../../redux/actions/service.js';

const IMAGEW = (2 * W)/3
const IMAGEH = (getResponsiveSize(274) * IMAGEW)/getResponsiveSize(428)

const WAY = ['scan', 'pick'] /** <商汤扫描，获取照片> */
const MODE = ['face', 'back', 'bankcard', 'camera', 'albums'] /** <正面，背面，银行卡，拍照，相册> */

class UploadImageView extends Component{

  static Props = {
    way: PropTypes.oneOf(WAY),
    mode: PropTypes.oneOf(MODE),
  }

  constructor(props){
    super(props);

    this.state = {
      xinUrl: '',
      uploading: false
    }
  }

  async run(way, mode){
    let data;
    switch (way) {
      case 'scan':
        data = await this._runScan(mode);
        break;
      case 'pick':
        data = await this._runImagePicker(mode);
        break;
    }

    this._onReceive(data, way, mode);
  }

  async _runScan(mode){
    let data;
    switch (mode) {
      case 'face':
        data = await NativeModules.OCRIDCard.show('front');
        data.xinUrl = await this._upload(md5(global.auth.userId) + '_front.png', data.image);
        break;
      case 'back':
        data = await NativeModules.OCRIDCard.show('back');
        data.xinUrl = await this._upload(md5(global.auth.userId) + '_back.png', data.image);
        break;
      case 'bankcard':
        data = await NativeModules.OCRBankCard.show();
        console.log('UploadImageView doing _runScan and the data -->> ', data);
        data.xinUrl = await this._upload(md5(global.auth.userId) + '_bankCard.png', data.image);
        break;
    }
    return data;
  }

  async _runImagePicker(mode){

  }

  async _upload(name, image){
    this.setState({uploading: true})
    let data = await this.props.dispatch( create_service(Contract.UPLOAD_IMAGE, {fileName: name, image: image}))
    this._onChangeUrl(data.url)
    this.setState({uploading: false, xinUrl: data.url})
    return data.url;
  }

  _onChangeUrl(url) {
    if (this.props.onChange) {
      this.props.onChange(url);
    }
  }

  _onReceive(data, way, mode){
    if (this.props.onReceive){
      this.props.onReceive(data, way, mode)
    }
  }

  render(){
    let { xinUrl, uploading } = this.state;
    let { image, title, style, way, mode, titleCenter } = this.props;
    let s = xinUrl? {uri: xinUrl} : image

    return(
      <TouchableWithoutFeedback onPress={this.run.bind(this, way, mode)} >
        <View style={[styles.container, style]}>
          {this.renderImageView(s, style, title, titleCenter, uploading)}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderImageView(s, style, title, titleCenter, uploading){
    if (!titleCenter) {
      return(
        <View style={{alignItems: 'center'}}>
          {
            uploading?
              this.renderProgress(IMAGEW, IMAGEH)
              :
              <Image source={s} style={{width: IMAGEW, height: IMAGEH, resizeMode: 'contain'}} />
          }
          <Text style={{marginTop: 20, color: mainBule, fontSize: 14}}>{title}</Text>
        </View>
      )
    }else{
      return (
        <View>
          {
            uploading?
              this.renderProgress(IMAGEW, IMAGEH)
              :
              <Image source={s} style={[{width: IMAGEW, height: IMAGEH, alignItems: 'center', justifyContent: 'center'}, style]} >
                {
                  s.uri? null :
                    <Text style={{color: formLeftText, fontSize: 14, backgroundColor: 'transparent'}}>{title}</Text>
                }
              </Image>
          }
        </View>
      )
    }
  }

  renderProgress(w, h){
    return(
      <ActivityIndicator color={'black'} animating={true} size={'small'} style={{width: w, height: h, alignItems: 'center', justifyContent: 'center', paddingTop: 20, paddingLeft: 20, paddingRight: 18, paddingBottom: 18}}/>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  uploading: {
    width: IMAGEW,
    height: IMAGEH,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports.UploadImageView = connect()(UploadImageView)
