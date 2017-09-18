/**
 * wuran on 17/1/3.
 * 底部弹出picker选择框
 */

import React, { Component } from 'react';

import _Picker from 'react-native-picker';

import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableHighlight, Platform, Image  } from 'react-native';
import { W, borderColor, formLeftText, formRightText, commonText, placeholderColor } from '../../configs/index.js';

export class Picker extends Component {

  static propTypes = {
    data: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
  }

  _onPress(){
    let self = this;
    _Picker.init({
        pickerData: this.props.data,
        pickerConfirmBtnText: '确认',
        pickerCancelBtnText: '取消',
        pickerTitleText: '',
        onPickerConfirm: data => {
          self._onChangeText(data[0])
        }
    });
    _Picker.show();
  }

  _onChangeText(text) {
    if (this.props.onChange) {
      this.props.onChange(text);
    }
  }

  render(){
    let { label, labelWidth, placeholder, noBorder, /** fields */value } = this.props;
    const border = noBorder? null : { borderBottomColor :  borderColor, borderBottomWidth: 0.5 };

    return(
      <View style={ [{paddingLeft: 20, flexDirection: 'row', height: 50, backgroundColor: 'white'}, border] }>
        <View style={{width: labelWidth? labelWidth : 80, justifyContent: 'center'}}>
          <Text style={{ color: formLeftText, fontSize: 16 }}>{ label }</Text>
        </View>
        <TouchableWithoutFeedback onPress={this._onPress}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              {
                value && value != ''?
                <Text style={{fontSize: 16, color: commonText}}>{value}</Text>
                :
                <Text style={{fontSize: 16, color: placeholderColor}}>{placeholder}</Text>
              }
            </View>
            <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{height: 12, width: 12, resizeMode: 'contain'}} source={require('./image/icon-arrow-down-blue.png')}/>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
