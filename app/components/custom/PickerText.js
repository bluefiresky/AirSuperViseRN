/**
 * wuran on 17/1/3.
 * 底部弹出picker选择框
 */

import React, { Component } from 'react';

import _Picker from 'react-native-picker';

import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableHighlight, Platform, Image  } from 'react-native';
import { W, borderColor, formLeftText, formRightText, commonText, placeholderColor } from '../../configs/index.js';

export class PickerText extends Component {

  static propTypes = {
    data: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this.data = this.props.data;
    this.labelArray = [];
  }

  componentDidMount(){
    this.data.forEach( (entry) => {
      this.labelArray.push(entry.label)
    })
    if (this.props.onChange && !this.props.value) this.props.onChange(this.data[0])
  }

  _onPress(){
    let self = this;
    _Picker.init({
        pickerData: this.labelArray,
        pickerConfirmBtnText: '确认',
        pickerCancelBtnText: '取消',
        pickerTitleText: '',
        onPickerConfirm: label => {
          let entry = self._getValueByLabel(self.data, label[0]);
          self._onChangeText(entry)
        }
    });
    _Picker.show();
  }

  _getValueByLabel(array, label){
    let res;
    for(let i = 0; i < array.length; i++){
      let entry = array[i];
      if(entry.label === label) {
        res = entry;
        break;
      }
    }

    return res;
  }

  _onChangeText(text) {
    if (this.props.onChange) {
      this.props.onChange(text);
    }
  }

  render(){
    let { width, placeholder, noBorder, data, /** fields */value } = this.props;
    const border = noBorder? null : { borderBottomColor :  borderColor, borderBottomWidth: 0.5 };
    let v = value? value.label : '';

    return(
      <TouchableWithoutFeedback onPress={this._onPress}>
        <View style={[{flexDirection: 'row', alignItems: 'center', paddingLeft: 20, height: 50, width: width? width : 80, backgroundColor: 'white'}, border]}>
          <Text style={{fontSize: 16, color: commonText}}>{v}</Text>
          <Image style={{height: 12, width: 12, resizeMode: 'contain'}} source={require('./image/icon-arrow-down-blue.png')}/>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
