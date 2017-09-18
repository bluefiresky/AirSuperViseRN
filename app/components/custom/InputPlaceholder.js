/**
 *
 * wuran on 17/1/3.
 * 输入框左边没有预留Label， 已placeholder代替Label
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Platform, Image  } from 'react-native';
import { InputH, W, borderColor, formLeftText, formRightText, commonText, placeholderColor } from '../../configs/index.js';

const clearButtonW = InputH/2
export class InputPlaceholder extends Component {


  static defaultProps = {
    type : 'text'
  }

  constructor(props){
    super()

    if(props.form && !props.readonly) {
      props.form.regRefer(props.name, this)
    }

    this.state = {
      focus: 0
    }

    this._onChangeText = this._onChangeText.bind(this);
    this._clear = this._clear.bind(this);
  }


  // _tap() {
  //   if(!this.props.readonly)
  //     this.refs.ipt.focus()
  //
  // }

  // _focus(e){
  //   this.setState({
  //     focus: 1
  //   })
  //   if(this.props.onFocus) {
  //     this.props.onFocus()
  //   }
  // }

  /*
   getPosition() {
   return getPosition(this.refs.holder)
   }
   */

  // _change(e){
  //
  //   if(this.props.onChange) {
  //     this.props.onChange(e.target.value)
  //   }
  // }

  // _blur(e){
  //   this.setState({
  //     focus: 0
  //   })
  //   if(this.props.onBlur) {
  //     this.props.onBlur()
  //   }
  // }

  // _keypress(e){
  //   if(e.which === 13) {
  //     if(this.props.onEnter) {
  //       this.props.onEnter()
  //     }
  //
  //     if(this.props.onSubmit) {
  //       this.props.onSubmit()
  //     }
  //
  //   }
  // }

  // focus(){
  //
  //   if(!this.props.readonly)
  //     this.refs.ipt.focus()
  // }
  //
  // blur(){
  //   if(!this.props.readonly)
  //     this.refs.ipt.blur()
  // }

  /**
   *  this.props.onChange 为fields的属性
   *  用于更新fields的value值，导致{ value } = this.props；得到变更，render()可以进行渲染
   */
  _onChangeText(text) {
    if (this.props.onChange) {
      this.props.onChange(text.trim());
    }
  }

  _clear(e) {
    if(this.props.onChange) {
      this.props.onChange('')
    }
  }

  render() {
    let { style, noLabel, label, labelWidth, noBorder, hasClearButton,/* TextInput properties */ type, autoFocus, editable, keyboardType, placeholder, selectTextOnFocus, maxLength, multiline, secure,/* fields properties */ value } = this.props;
    const border = noBorder? null : { borderBottomColor :  borderColor, borderBottomWidth: 1 };
    const ClearButton = this.renderClearButton(hasClearButton, value);
    const l = noLabel === true? true : false;

    return(
      <View style={ [{paddingLeft: 10, flexDirection: 'row', height: InputH, backgroundColor: 'white'}, border, style] }>
        <TextInput
          style={{flex: 1, fontSize: 14, color: commonText, paddingLeft: 0}}
          onChangeText={ (text) => { this._onChangeText(text) } }
          value={value}
          autoFocus={autoFocus}
          editable={editable === false? false : true}
          keyboardType={keyboardType? keyboardType : 'default'}
          placeholder={placeholder}
          placeholderTextColor={'#b0b0b0'}
          selectTextOnFocus={selectTextOnFocus}
          secureTextEntry={secure}
          underlineColorAndroid={'transparent'}
          maxLength={maxLength}
          multiline={multiline}
        />
        {ClearButton}
      </View>
    );
  }

  renderClearButton(hasClearButton, value){
    if (hasClearButton === false) {
      return null;
    }else{
      if (value && value != '') {
        const _Component = this.renderTouchComponent();
        return (
          <View style={{width: clearButtonW, paddingRight: 15, justifyContent: 'center', alignItems: 'center'}}>
            <_Component onPress={this._clear}>
              <Image style={{height: 15, width: 15}} source={require('./image/icon-clear-text.png')} resizeMode='contain'/>
            </_Component>
          </View>
        )
      }
    }
  }

  renderTouchComponent(){
    let _Component;
    if (Platform.OS === 'ios') {
      _Component = TouchableOpacity
    }else if (Platform.OS === 'android') {
      _Component = TouchableNativeFeedback
    }

    return _Component;
  }

}

const styles = {
  container : {

  },

  input : {


  },

  close: {

  }
}
