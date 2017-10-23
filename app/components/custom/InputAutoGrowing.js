/**
 *
 * wuran on 17/1/3.
 * 输入框左边预留Label空间
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, Platform, Image  } from 'react-native';
import { InputH, W, borderColor, inputLeftColor, inputRightColor, commonText, placeholderColor } from '../../configs/index.js';

const clearButtonW = InputH/2
export class InputAutoGrowing extends Component {


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
    console.log('doing input withd icon clear');
    if(this.props.onChange) {
      this.props.onChange('')
    }
  }

  render() {
    let { style, noLabel, label, labelWidth, noBorder, hasClearButton,/* TextInput properties */ type, autoFocus, editable, keyboardType, placeholder, selectTextOnFocus, maxLength, multiline,/* fields properties */ value } = this.props;
    const border = noBorder? null : { borderBottomColor :  borderColor, borderBottomWidth: 0.5 };
    const ClearButton = this.renderClearButton(false, value);
    const l = noLabel === true? true : false;

    return(
      <View style={ [{paddingLeft: 20, flexDirection: 'row', paddingVertical:15, backgroundColor: 'white', paddingRight:15}, border, style] }>
        {this.renderLabelView(l, labelWidth, label)}
        <TextInput
          style={{flex: 1, fontSize: 16, color: inputRightColor, paddingLeft: 0, paddingTop:0, includeFontPadding:false, textAlign:'justify', textAlignVertical:'center'}}
          onChangeText={ (text) => { this._onChangeText(text) } }
          value={value}
          autoFocus={autoFocus}
          editable={editable === false? false : true}
          keyboardType={keyboardType? keyboardType : 'default'}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          selectTextOnFocus={selectTextOnFocus}
          underlineColorAndroid={'transparent'}
          maxLength={maxLength}
          multiline={true}
        />
        {ClearButton}
      </View>
    );
  }

  renderLabelView(l, labelWidth, label){
    if (!l) {
      return(
        <View style={{width: labelWidth? labelWidth : 80}}>
          <Text style={{ color: inputLeftColor, fontSize:16 }}>{ label }</Text>
        </View>
      )
    }
  }

  renderClearButton(hasClearButton, value){
    if (hasClearButton === false) {
      return null;
    }else{
      if (value && value != '') {
        const _Component = this.renderTouchComponent();
        return (
          <View style={{width: clearButtonW, paddingRight: 15, justifyContent: 'center', alignItems: 'center'}}>
            <_Component activeOpacity={0.8} onPress={this._clear}>
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
      _Component = TouchableOpacity
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
