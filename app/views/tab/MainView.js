/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import TabNavigator from 'react-native-tab-navigator';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, mainTextColor, mainTextGreyColor, borderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

import { HomeTab } from './HomeTab.js';
import { PersonalTab } from './PersonalTab.js';
import { MessageTab } from './MessageTab.js';

const HomeIcon = require('./image/tab-home.png');
const HomeSelectIcon = require('./image/tab-home-selected.png');
const PersonalIcon = require('./image/tab-personal.png');
const PersonalSelectIcon = require('./image/tab-personal-selected.png');
const MessageIcon = require('./image/tab-message.png');
const MessageSelectIcon = require('./image/tab-message-selected.png');

const ComponentW = (W - 30);

class MainView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      selectedTab: 'home'
    }
  }

  componentDidMount(){
  }

  componentWillUnmount(){

  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <TabNavigator tabBarStyle={{backgroundColor:'white', alignItems:'center'}} tabBarShadowStyle={{backgroundColor:borderColor}} >
          <TabNavigator.Item
            selected={this.state.selectedTab === 'home'}
            title="首页"
            titleStyle={{color: mainTextColor}}
            selectedTitleStyle={{color: mainColor}}
            renderIcon={() => <Image style={styles.icon} source={HomeIcon} />}
            renderSelectedIcon={() => <Image style={styles.icon} source={HomeSelectIcon} />}
            onPress={() => {
              if(this.state.selectedTab === 'home') return;
              this.setState({ selectedTab: 'home' })
            }}>
            <HomeTab />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'messages'}
            title="消息"
            titleStyle={{color: mainTextColor}}
            selectedTitleStyle={{color: mainColor}}
            renderIcon={() => <Image style={styles.icon} source={MessageIcon} />}
            renderSelectedIcon={() => <Image style={styles.icon} source={MessageSelectIcon} />}
            onPress={() => {
              if(!global.auth.isLogin) {
                  Actions.login({reLogin:true});
                  return;
              }
              if(this.state.selectedTab === 'messages') return;
              this.setState({ selectedTab: 'messages' })
            }}>
            <MessageTab />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'personal'}
            title="我的"
            titleStyle={{color: mainTextColor}}
            selectedTitleStyle={{color: mainColor}}
            renderIcon={() => <Image style={styles.icon} source={PersonalIcon} />}
            renderSelectedIcon={() => <Image style={styles.icon} source={PersonalSelectIcon} />}
            onPress={() => {
              if(!global.auth.isLogin) {
                  Actions.login({reLogin:true});
                  return;
              }
              if(this.state.selectedTab === 'personal') return;
              this.setState({ selectedTab: 'personal' })
            }}>
            <PersonalTab changeTab={this._onChangeTab.bind(this)} />
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    )
  }

  _onChangeTab(selectedTab){
    this.setState({selectedTab})
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackColor
  },
  icon:{
    height: 20,
    width: 20,
    resizeMode: 'contain'
  }
});

const ExportView = connect()(MainView);

module.exports.MainView = ExportView
