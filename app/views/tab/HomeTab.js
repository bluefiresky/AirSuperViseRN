/**
* Created by wuran on 17/06/26.
* 首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Swiper from 'react-native-swiper';

import { Version, W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const TitleH = Platform.select({ android: 50, ios: 70 });
const TitleMarginTop = Platform.select({ android: 0, ios: 20 });
const PaddingHorizontal = 10;
const ADH = W*434/750;
const MainEntryH = 150;
const SecondaryEntryH = 100;

const CoverAD = require('./image/cover-home-ad1.png');
const MainIcon1 = require('./image/icon-appointment.png');
const MainIcon2 = require('./image/icon-report.png');
const MainIcon3 = require('./image/icon-supervise.png');
const SecondaryIcon1 = require('./image/icon-certificate.png');
const SecondaryIcon2 = require('./image/icon-news.png');
const SecondaryIcon3 = require('./image/icon-train.png');
const SecondaryIcon4 = require('./image/icon-advise.png');

const AppType = Platform.select({android:1, ios:2});

const RoleList = ['01'/** 普通用户 */, '02'/** 警员 */, '03'/** 商户管理员 */, '04'/** 证件监察员 */, '05'/** 持证人员 */, '06'/** 新机场证件审核人员 */];
const ADCoverList = [CoverAD, CoverAD];

class HomeTab extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      weather: null,
      adCoverList: [],
    }

    this._forcedUpdate = this._forcedUpdate.bind(this);
    this._getRoleList = this._getRoleList.bind(this);
    this._getWeather = this._getWeather.bind(this);
  }

  componentDidMount(){
    this._forcedUpdate()
  }

  render(){
    let { loading, weather, adCoverList } = this.state;

    return(
      <View style={styles.container}>
        {this.renderTitle()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderAD(adCoverList)}
          {this.renderWeather(weather)}
          {this.renderMainEntry()}
          {this.renderSecondaryEntry()}
        </ScrollView>
        <ProgressView show={loading} />
      </View>
    )
  }

  renderTitle(){
    return(
      <View style={{height:TitleH, backgroundColor:mainColor, justifyContent:'center', alignItems:'center', paddingHorizontal:PaddingHorizontal, paddingTop:TitleMarginTop}}>
        <Text style={{fontSize:20, color:'white'}}>国门公安</Text>
      </View>
    )
  }

  renderAD(adCoverList){
    return(
      <View style={{height:ADH}}>
        {
          adCoverList.length == 0? <Image style={{width:W,height:ADH}} source={CoverAD} />:
          <Swiper paginationStyle={{bottom:10}} autoplay={true} autoplayTimeout={3}>
            {
              adCoverList.map((item, index) => {
                return <Image key={index} style={{width:W,height:ADH}} source={item}/>
              })
            }
          </Swiper>
        }
      </View>
    )
  }


  renderWeather(data){
    if(!data) return <View style={{backgroundColor:'white', height:26}}/>

    return(
      <View style={{backgroundColor:'white', paddingVertical:5, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:14, color:mainColor}}>{data.date}</Text>
        <Text style={{fontSize:14, color:mainTextGreyColor, marginLeft:10}}>白天到夜间{data.temperature}</Text>
        <Text style={{fontSize:14, color:mainTextGreyColor, marginLeft:10}}>{data.wind}</Text>
        <Text style={{fontSize:14, color:mainTextGreyColor, marginLeft:10}}>{data.weather}</Text>
      </View>
    )
  }

  renderMainEntry(){
    return(
      <View style={{backgroundColor:'white', height:MainEntryH, marginVertical:20, marginHorizontal:PaddingHorizontal, flexDirection:'row'}}>
        <TouchableOpacity activeOpacity={0.8} style={{flex:2, alignItems:'center', justifyContent:'center'}} onPress={this._mainEntryPress.bind(this, 0)}>
          <Image source={MainIcon1} style={{height:60, width:60, resizeMode:'contain'}} />
          <Text style={{fontSize:18, color:mainColor, marginTop:15, textAlign:'center'}}>网上办公大厅<Text style={{fontSize:14, color:mainTextGreyColor}}></Text></Text>
        </TouchableOpacity>
        <View style={{width:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
        <View style={{flex:3}}>
          <TouchableOpacity activeOpacity={0.8} style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={this._mainEntryPress.bind(this, 1)}>
            <Image source={MainIcon2} style={{height:40, width:40, resizeMode:'contain'}} />
            <Text style={{fontSize:18, color:mainColor, marginLeft:20, textAlign:'center'}}>违法举报<Text style={{fontSize:14, color:mainTextGreyColor}}></Text></Text>
          </TouchableOpacity>
          <View style={{height:StyleSheet.hairlineWidth, backgroundColor:borderColor}} />
          <TouchableOpacity activeOpacity={0.8} style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={this._mainEntryPress.bind(this, 2)}>
            <Image source={MainIcon3} style={{height:40, width:40, resizeMode:'contain'}} />
            <Text style={{fontSize:18, color:mainColor, marginLeft:20, textAlign:'center'}}>安全监管<Text style={{fontSize:14, color:mainTextGreyColor}}></Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderSecondaryEntry(){
    return(
      <View style={{backgroundColor:'white', height:SecondaryEntryH, flexDirection:'row', marginHorizontal:PaddingHorizontal}}>
        <TouchableOpacity onPress={this._secondEntryPress.bind(this, 0)} activeOpacity={0.8} style={styles.secondaryEntryItem}>
          <Image source={SecondaryIcon1} style={styles.secondaryEntryItemImage} />
          <Text style={styles.secondaryEntryItemText}>证件管理</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._secondEntryPress.bind(this, 1)} activeOpacity={0.8} style={styles.secondaryEntryItem}>
          <Image source={SecondaryIcon2} style={styles.secondaryEntryItemImage} />
          <Text style={styles.secondaryEntryItemText}>警务新闻</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._secondEntryPress.bind(this, 2)} activeOpacity={0.8} style={styles.secondaryEntryItem}>
          <Image source={SecondaryIcon3} style={styles.secondaryEntryItemImage} />
          <Text style={styles.secondaryEntryItemText}>网上培训</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._secondEntryPress.bind(this, 3)} activeOpacity={0.8} style={styles.secondaryEntryItem}>
          <Image source={SecondaryIcon4} style={styles.secondaryEntryItemImage} />
          <Text style={styles.secondaryEntryItemText}>意见建议</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** Private **/
  _mainEntryPress(type){
    if(type === 0){
      Actions.apHome();
    }else if(type === 1){
      Actions.reportHome();
    }else if(type === 2){
      if(global.profile){
        if(this._verifyRole(global.profile.roleNums, ['02'])) Actions.svoHome();
        else if(this._verifyRole(global.profile.roleNums, ['03'])) Actions.svmHome();
        else Toast.showShortCenter('暂无进入权限')
      }
    }
  }

  _secondEntryPress(type){
    if(type === 0){
      if(global.profile){
        let role = this._verifyRole(global.profile.roleNums, ['04', '05']);
        if(role) Actions.cfHome({role});
        else Toast.showShortCenter('暂无进入权限')
      }
    }else if(type === 1){
      Actions.policeNews();
    }else if(type === 2){
      Toast.showShortCenter('待开发');
    }else if(type === 3){
      Toast.showShortCenter('待开发');
    }
  }

  _forcedUpdate(){
    this.setState({loading:true});
    this.props.dispatch( create_service(Contract.POST_FORCED_UPDATE, {appType:AppType, appVer:Version}) )
      .then( res => {
        if(res){
          if(res.isUpgrade == '02'){
            this._goForcedUpdateTip(res.mustUpgradeReason, res.appAddress);
            this.setState({loading:false});
          }else{
            this._getRoleList();
          }
        }else{
          this.setState({loading:false});
        }
      })
  }

  _getRoleList(){
    this.props.dispatch( create_service(Contract.POST_USER_ROLE_LIST, {}))
      .then( res => {
        if(res) {
          global.profile = {
            roleNums:res.list,
            phoneNum:res.phoneNum,
          }
        }
        this._getWeather();
      })
  }

  _getWeather(){
    this.props.dispatch( create_service(Contract.POST_GET_WEATHER, {cityName:'北京市'}))
      .then( res => {
        this.setState({weather:res, loading:false, adCoverList:ADCoverList})
      })
  }

  _goForcedUpdateTip(text, url){
    Actions.netTip({
      tipType:'forceUpdate',
      content:{text: text.replace(/===/g, '\n'), url}
    })
  }

  _verifyRole(source, targetList){
    if(source && source.length > 0){
      for(let i=0; i<source.length; i++){
        let r = source[i];
        if(targetList.indexOf(r.roleNum) != -1) return r;
      }

      return false;
    }else{
      return false;
    }
  }

  _verifyEntryRole(source, targetList){
    if(source && source.length > 0){
      for(let i=0; i<source.length; i++){
        let r = source[i];
        if(targetList.indexOf(r.roleNum) != -1) return r;
      }

      return false;
    }else{
      return false;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  },
  secondaryEntryItem:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  secondaryEntryItemText:{
    fontSize:15,
    color:mainTextGreyColor,
    marginTop:10
  },
  secondaryEntryItemImage:{
    width:40,
    height:40,
    resizeMode:'contain'
  }
});

const ExportView = connect()(HomeTab);

module.exports.HomeTab = ExportView
