/**
* Created by wuran on 16/12/31.
* Tabs 页底部点击按钮 component
*/
import React, { PropTypes } from 'react';
import { Text, View, Image, DeviceEventEmitter } from 'react-native';

import { formRightText, mainColor } from '../../configs/index.js'

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
};
const HomeIcon = require('./image/tab-home.png');
const HomeSelectIcon = require('./image/tab-home-selected.png');
const PersonalIcon = require('./image/tab-personal.png');
const PersonalSelectIcon = require('./image/tab-personal-selected.png');

const TabIcon = (props) => {
  let { sceneKey, selected } = props;
  let icon, titleColor;

  switch (sceneKey) {
    case 'tabs_home':
      if(selected){
        icon = HomeSelectIcon;
        titleColor = mainColor;
        // DeviceEventEmitter.emit('HomeFocuse', {focuse: true})
      }else{
        icon = HomeIcon;
        titleColor = formRightText;
        // DeviceEventEmitter.emit('HomeFocuse', {focuse: false})
      }
      break;
    case 'tabs_personal':
      if(selected){
        icon = PersonalSelectIcon;
        titleColor = mainColor;
        // DeviceEventEmitter.emit('PersonalFocuse', {focuse: true})
      }else{
        icon = PersonalIcon;
        titleColor = formRightText;
        // DeviceEventEmitter.emit('PersonalFocuse', {focuse: false})
      }
      break;
  }

  return(
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Image source={ icon } style={{ height: 20, width: 20, resizeMode: 'contain' }} />
      <Text style={{marginTop: 3, color: titleColor , fontSize: 11}}>{props.title}</Text>
    </View>
  );
};

TabIcon.propTypes = propTypes;
module.exports.TabIcon = TabIcon;
