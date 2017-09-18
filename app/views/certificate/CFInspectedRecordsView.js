/**
* Created by wuran on 17/06/26.
* 证件管理-检查记录
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextColor, mainTextGreyColor, placeholderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const PaddingHorizontal = 15;
const ItemH = 120;
const EmptyW = (2*W)/3;
const EmptyImageW = W/3;
const EmptyMarginTop = W/10;

const ExampleList = [{name:'张三', code:'010-1223344', content:'违规违规违规违规违规违规违规违规违规违规违规违规', score:'-3', date:'2012年12月21 06:06:06'},{name:'李四', code:'010-345234', content:'违规违规违规违规违规违规', score:'-15', date:'2012年12月21 06:06:06'}];

const ArrowRight = require('./image/icon-arrow-right-blue.png');

class CFInspectedRecordsView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: null,
    }
  }

  componentDidMount(){
    let self = this;
    self.setState({loading: true})

    InteractionManager.runAfterInteractions(() => {
      self.props.dispatch( create_service(Contract.POST_GET_CERTIFICATE_CHECK_LIST, {}))
        .then( res => {
          if(res){
            let data = [];
            if(res.entity && res.entity.length > 0){
              let list = res.entity;
              for(let i=0; i<list.length; i++){
                console.log(' list -->> i -->> ', i);
                let { deductionScore, holderName, createdTime, holderPaperworkSerialNumber, id, legalProvisionContents } = list[i];
                data.push({deductionScore:`-${deductionScore}分`, holderName, createdTime, holderPaperworkSerialNumber, id, legalProvisionContents:legalProvisionContents[0].content})
              }
            }
            self.setState({loading:false, data})
          }else{
            self.setState({loading:false})
          }
        })
    })
  }

  render(){
    let { loading, data } = this.state;

    return(
      <View style={styles.container}>
        {this.renderList(data)}
        {this.renderEmptyView(data)}
        <ProgressView show={loading} />
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
      <TouchableOpacity onPress={this._goDetail.bind(this, item, index)} activeOpacity={0.8} style={{height:ItemH, paddingHorizontal:PaddingHorizontal, backgroundColor:'white'}}>
        <View style={{height:50, flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontSize:16, color:mainTextGreyColor, flex:1}}>{item.createdTime}</Text>
          <Text style={{fontSize:14, color:'red'}}>{item.deductionScore}</Text>
        </View>

        <View style={{backgroundColor:borderColor, height:1}} />

        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:14, color:mainTextGreyColor}}>持证人：{item.holderName}<Text>{`\t持证人编号：${item.holderPaperworkSerialNumber}`}</Text></Text>
            <Text style={{fontSize:14, color:mainTextGreyColor, marginTop:10}} numberOfLines={1} >检查内容：{item.legalProvisionContents}</Text>
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
          <Text style={{fontSize:18, color:mainTextColor, marginTop:EmptyImageW}}>暂无数据</Text>
        </View>
      )
    }
  }

  /** Private **/
  _goDetail(item, index){
    Actions.cfInspectedRecordDetail();
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(CFInspectedRecordsView);

module.exports.CFInspectedRecordsView = ExportView
