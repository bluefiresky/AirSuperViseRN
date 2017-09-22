/**
* Created by wuran on 17/06/26.
* 安全监管首页-官方(Official)
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

// const ExampleList = [{name:'肯德基1', status:'待复查', level:'紧急', levelColor:'red', type:'消防', date:'2012年12月21 06:06:06'},{name:'麦当劳', status:'待整改', level:'重要', levelColor:'yellow', type:'空防', date:'2012年12月21 06:06:06'},{name:'吉野家', status:'检查合格', level:'一般', levelColor:'green', type:'消防', date:'2012年12月21 06:06:06'}];
// const ExampleList1 = [{name:'肯德基1', status:'待复查', level:'紧急', levelColor:'red', type:'消防', date:'2012年12月21 06:06:06'}];
// const ExampleList2 = [];
// const ExampleList3 = [{name:'麦当劳', status:'待整改', level:'重要', levelColor:'yellow', type:'空防', date:'2012年12月21 06:06:06'},{name:'吉野家', status:'检查合格', level:'一般', levelColor:'green', type:'消防', date:'2012年12月21 06:06:06'}];

const PaddingHorizontal = 15;
const ItemH = 100;
const EmptyW = (2*W)/3;
const EmptyImageW = W/3;
const EmptyMarginTop = W/10;

const ArrowRight = require('./image/icon-arrow-right-blue.png');
const UrgentTypeColor = {'1':'red', '2':'rgb(255, 176, 91)', '3':'rgb(101, 211, 149)'}

class SVOHistoryCheckInView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data:null,
      data1:null,
      data2:null,
      data3:null
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch( create_service(Contract.POST_GET_SUPERVISE_POLICE_CHECK_HISTORY, {checkListStatus:0}))
        .then( res => {
          if(res){
            let { data, data1, data2, data3 } = this._converData(res.entity.checkList);
            this.setState({loading:false, data, data1, data2, data3})
          }else{
            this.setState({loading:false})
          }
        })
    })
  }

  render(){
    let { loading, data, data1, data2, data3 } = this.state;

    return(
      <View style={styles.container}>
        <ScrollableTabView
          renderTabBar={() => <TabBar />}
          initialPage={0}>
          <SubView tabLabel='全部' data={data}/>
          <SubView tabLabel='待整改' data={data1}/>
          <SubView tabLabel='待复查' data={data2}/>
          <SubView tabLabel='已结案' data={data3}/>
        </ScrollableTabView>
        <ProgressView show={loading} />
      </View>
    )
  }

  /** Private **/
  _converData(allList){
    let data = [], data1 = [], data2 = [], data3 = [];

    for(let i=0; i<allList.length; i++){
      let item = allList[i];
      let show = this._converDataToShow(item);
      data.push(show);
      if(item.urgentType == '1') data1.push(show);
      else if(item.urgentType == '2') data2.push(show);
      else if(item.urgentType == '3') data3.push(show);
    }

    return { data, data1, data2, data3 };
  }

  _converDataToShow(item){
    return {...item, urgentTypeColor:UrgentTypeColor[item.urgentType]};
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
          ItemSeparatorComponent={()=>  <View style={{height:10}} /> }
          renderItem={this._renderListItem.bind(this)}
        />
      );
    }
  }

  _renderListItem({item, index}){
    return(
      <TouchableOpacity onPress={this._onItemPress.bind(this, item, index)} activeOpacity={0.8} style={{height:ItemH, paddingHorizontal:PaddingHorizontal, backgroundColor:'white'}}>
        <View style={{height:40, flexDirection:'row', alignItems:'center'}}>
          <TouchableOpacity onPress={this._onCheckNotice.bind(this, item.paperPath)} activeOpacity={0.8} style={{alignItems:'center', justifyContent:'center', marginRight:10}}>
            <Text style={{fontSize:16, color:mainColor}}>处理通知单</Text>
          </TouchableOpacity>
          <Text style={{fontSize:16, color:mainTextGreyColor, flex:1}}>{item.listTypeName}</Text>
          <View style={{marginRight:10, backgroundColor:item.urgentTypeColor, height:18, borderRadius:9, paddingHorizontal:5, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'white', includeFontPadding:false, textAlignVertical:'center', textAlign:'justify'}}>{item.urgentTypeName}</Text>
          </View>
          <Text style={{fontSize:12, color:mainTextGreyColor}}>{item.checkListStatusName}</Text>
        </View>

        <View style={{backgroundColor:borderColor, height:1}} />

        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:14, color:placeholderColor}}>创建时间：{item.createTime}</Text>
            <Text style={{fontSize:14, color:mainTextGreyColor, marginTop:6}}>商户名称：{item.companyName}</Text>
          </View>
          <Image source={ArrowRight} style={{width:25, height:25, resizeMode:'contain'}} />
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
  _onItemPress(item, index){
    Actions.svmCheckedInDetail({record:item});
  }

  _onCheckNotice(url){
    Actions.commonWeb({url});
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
            <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => this.props.goToPage(i)} style={{flex:1, backgroundColor:'white', alignItems:'center', justifyContent:'center', paddingVertical:8}}>
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

const ExportView = connect()(SVOHistoryCheckInView);

module.exports.SVOHistoryCheckInView = ExportView;
