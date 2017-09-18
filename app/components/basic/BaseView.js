/**
* Created by wuran on 17/1/19.
* 1. 提供progressBar效果
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableWithoutFeedback, Image, ScrollView, ActivityIndicator } from "react-native";

import { H, W, backgroundGrey, mainBule, borderColor, formLeftText, formRightText, commonText, placeholderColor } from '../../configs/index.js';


class BaseView extends Component {

  constructor(props){
    super(props);
  }

  render(){
    let { style, showProgress, progressText, children } = this.props;
    return(
      <View style={[styles.base, this.props.style]}>
        {children}
        {this.renderProgressBarView(showProgress, progressText)}
      </View>
    )
  }

  renderProgressBarView(show, progressText){
    if(show){
      return (
        <View style={styles.progress}>
          <View style={{alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.8)', paddingTop: 20, paddingLeft: 20, paddingRight: 18, paddingBottom: 18}}>
            <ActivityIndicator color={'white'} animating={true} size={'large'} />
            {
              progressText?
              <Text style={{fontSize: 14, color: 'white', marginTop: 10}}>{progressText}</Text>
              :
              null
            }
          </View>
        </View>
      )
    }
  }
}

const marginTop = Platform.OS === 'ios'? 20 : 0;
const styles = StyleSheet.create({
  base: {
    width: W,
    height: H,
    marginTop: marginTop,
  },
  progress: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
// backgroundColor: 'rgba(100,100,100,0.1)',

module.exports.BaseView = BaseView
