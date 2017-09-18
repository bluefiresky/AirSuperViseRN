/**
* Created by wuran on 17/06/26.
* 警务新闻
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const ExampleList = [
  {icon:null , title:'北京市实施境外游客购物离境退税规定退税规定退税规定', date:'2012年12月21 06:06:06', content:'北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定'},
  {icon:null , title:'北京市实施境外游客购物离境退税规定退税规定退税规定', date:'2012年12月21 06:06:06', content:'北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定'},
  {icon:null , title:'北京市实施境外游客购物离境退税规定退税规定退税规定', date:'2012年12月21 06:06:06', content:'北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定北京市实施境外游客购物离境退税规定退税规定退税规定'},
];
const ExampleList1 = [ExampleList[0]];
const ExampleList2 = [ExampleList[1], ExampleList[1]];

const PaddingHorizontal = 20;
const ItemH = 120;
const IconW = 80;
const EmptyW = (2*W)/3;
const EmptyImageW = W/3;
const EmptyMarginTop = W/10;

class PoliceNewsView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data:null,
      data1:null,
      data2:null,
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.timer = setTimeout(function () {
        self.setState({loading: false, data:ExampleList, data1:ExampleList1, data2:ExampleList2})
      }, 100);
    })
  }

  render(){
    let { loading, data, data1, data2, data3 } = this.state;

    return(
      <View style={styles.container}>
        <ScrollableTabView
          renderTabBar={() => <TabBar />}
          initialPage={0}>
          <SubView tabLabel='政策法规' data={data}/>
          <SubView tabLabel='便民提示' data={data1}/>
          <SubView tabLabel='警情通报' data={data2}/>
        </ScrollableTabView>
        <ProgressView show={loading} />
      </View>
    )
  }

}

class SubView extends Component{

  render(){
    let { data } = this.props;

    return(
      <View style={{flex:1}}>
        {this.renderList(data)}
        {this.renderEmptyView(data)}
      </View>
    )
  }

  renderList(data){
    if(data && data.length > 0){
      return(
        <FlatList
          data={data}
          style={{marginTop:10}}
          keyExtractor={(item, index) => index }
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ( {length: ItemH, offset: ItemH * index, index} )}
          ItemSeparatorComponent={()=>  <View style={{height:1, backgroundColor:borderColor}} /> }
          renderItem={this._renderListItem.bind(this)}
        />
      );
    }
  }

  _renderListItem({item, index}){
    return(
      <TouchableOpacity onPress={this._goDetail} activeOpacity={0.8} style={{height:ItemH, backgroundColor:'white', paddingHorizontal:PaddingHorizontal, flexDirection:'row', alignItems:'center'}}>
        <Image source={item.icon} style={{width:IconW, height:IconW, resizeMode:'contain', backgroundColor:'lightskyblue'}}/>
        <View style={{height:IconW, flex:1, marginLeft:PaddingHorizontal}}>
          <Text style={{color:mainTextColor, fontSize:16}} numberOfLines={1}>{item.title}</Text>
          <Text style={{color:placeholderColor, fontSize:12}}>{item.date}</Text>
          <View style={{flex:1}} />
          <Text style={{color:mainTextGreyColor, fontSize:14, lineHeight:20}} numberOfLines={2}>{item.content}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderEmptyView(data){
    if(data && data.length === 0){
      return(
        <View style={{alignSelf:'center', width:EmptyW, alignItems:'center', marginTop:EmptyMarginTop}}>
          <View style={{backgroundColor:'lightskyblue', width:EmptyImageW, height:EmptyImageW}} />
          <Text style={{fontSize:18, color:mainTextColor, marginTop:30}}>暂无数据</Text>
        </View>
      )
    }
  }

  /** Private **/
  _goDetail(item, index){
    Actions.policeNewsDetail();
  }
}

const TabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  render() {
    let { tabs, activeTab, style } = this.props;

    return (
      <View style={{flexDirection: 'row'}}>
        {tabs.map((tab, i) => {
          return (
            <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => this.props.goToPage(i)} style={{flex:1, backgroundColor:'white', alignItems:'center', justifyContent:'center', paddingVertical:10}}>
              <Text style={{fontSize: 15, color: (activeTab === i)? mainColor : mainTextGreyColor}}>{tab}</Text>
              <View style={{backgroundColor:(activeTab === i)?mainColor:'transparent', height:2, position:'absolute', bottom:0, left:0, right:0}} />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  },

});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor,
  }
});

const ExportView = connect()(PoliceNewsView);

module.exports.PoliceNewsView = ExportView
