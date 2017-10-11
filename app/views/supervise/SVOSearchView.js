/**
* Created by wuran on 17/06/26.
* 安全监管首页-官方(Official)
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, InteractionManager, FlatList } from "react-native";

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, placeholderColor, mainTextGreyColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, InputWithIcon } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */

const HistorySearchIcon = require('./image/icon-history-search.png');
const DeleteIcon = require('./image/icon-search-delete.png');
const SearchIcon = require('./image/icon-search.png');
const ItemH = 40;
const SearchButtonW = 60;
const InputW = W - 10*2 - SearchButtonW;

class SVOSearchView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      history: null,
      searchContent: null,
      searchData: null,
    }

    this._onSearchTextChanged = this._onSearchTextChanged.bind(this);
    this._saveAsHistory = this._saveAsHistory.bind(this);
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      let history = getStore().getState().merchantSearchHistory.list;
      if(history) this.setState({history})
    })
  }

  render(){
    let { loading, history, searchData, searchContent } = this.state;

    return(
      <View style={styles.container}>
        {this.renderSearchInput()}
        {this.renderHistorySearchList(history, searchData)}
        {this.renderSearchList(searchContent, searchData)}
        <ProgressView show={loading} />
      </View>
    )
  }

  renderSearchInput(){
    return(
      <View style={{padding:10, backgroundColor:'white', flexDirection:'row'}}>
        <InputWithIcon onChange={this._onSearchTextChanged} labelWidth={25} iconColor={mainColor} style={{height:44, width:InputW, backgroundColor:mainBackColor, paddingLeft:10, borderTopLeftRadius:22, borderBottomLeftRadius:22}} noBorder={true} icon={SearchIcon} placeholder={'请搜索被检查单位'}/>
        <TouchableOpacity onPress={this._search.bind(this, this.state.searchContent)} activeOpacity={0.8} style={{backgroundColor:mainColor, height:44, width:SearchButtonW, borderTopRightRadius:22, borderBottomRightRadius:22, alignItems:'center', justifyContent:'center'}}>
          <Image source={SearchIcon} style={{width:22, height:22, resizeMode:'contain'}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderHistorySearchList(data, searchData){
    if(searchData) return null;
    if(!(data && data.length > 0)) return null;

    return(
      <View style={{padding:20, marginTop:20}}>
        <View style={{flexDirection:'row', marginBottom:10}}>
          <Image source={HistorySearchIcon} style={{width:18, height:18, resizeMode:'contain'}}/>
          <Text style={{marginLeft:10, color:placeholderColor, fontSize:16}}>历史搜索</Text>
        </View>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index }
          ItemSeparatorComponent={()=>  <View style={{backgroundColor:borderColor, height:1}} /> }
          renderItem={this._renderHistorySearchListItem.bind(this)}
        />
        <View style={{backgroundColor:borderColor, height:1}} />
      </View>
    )
  }

  _renderHistorySearchListItem({item, index}){
    return(
      <TouchableOpacity onPress={this._search.bind(this, item, index)} activeOpacity={0.8} style={{flexDirection:'row', height:ItemH, alignItems:'center'}}>
        <Text style={{color:placeholderColor, fontSize:16, flex:1}}>{item}</Text>
        <TouchableOpacity onPress={this._deleteAsHistory.bind(this, item, index)} activeOpacity={0.8} style={{width:ItemH, height:ItemH, alignItems:'center', justifyContent:'center'}}>
          <Image source={DeleteIcon} style={{width:18, height:18, resizeMode:'contain'}} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderSearchList(searchContent, data){
    if(!data) return null;

    return(
      <View style={{paddingTop:20, paddingHorizontal:20, marginTop:20, backgroundColor:'white'}}>
        <View style={{flexDirection:'row', marginBottom:10}}>
          <Image source={SearchIcon} style={{width:18, height:18, resizeMode:'contain', tintColor:placeholderColor}}/>
          <Text style={{marginLeft:10, color:mainTextGreyColor, fontSize:16}}>{searchContent}</Text>
        </View>
        <View style={{backgroundColor:borderColor, height:1}} />
        <FlatList
          data={data}
          style={{paddingHorizontal:15}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index }
          ItemSeparatorComponent={()=>  <View style={{backgroundColor:borderColor, height:1}} /> }
          renderItem={this._renderSearchListItem.bind(this)}
        />
      </View>
    )
  }

  _renderSearchListItem({item, index}){
    return(
      <TouchableOpacity onPress={this._onItemPress.bind(this, item, index)} activeOpacity={0.8} style={{flexDirection:'row', height:ItemH, alignItems:'center'}}>
        <Text style={{color:mainTextGreyColor, fontSize:16, flex:1}}>{item.companyName}</Text>
      </TouchableOpacity>
    )
  }

  /** Private **/
  _onItemPress(item, index){
    Actions.pop();
    if(this.props.searchResult) this.props.searchResult(item)
  }

  _search(content){
    if(content){
      this.setState({loading:true})
      content = content.trim();
      this._saveAsHistory(content);

      this.props.dispatch( create_service(Contract.POST_GET_SUPERVISE_CHECK_COMPANY , {keyword:content}))
        .then( res => {
          if(res){
            this.setState({loading:false, searchData:res.entity.companyList, searchContent:content})
          }else{
            this.setState({loading:false})
          }
        })
    }
  }

  _onSearchTextChanged(text){
    this.setState({searchContent:text})
  }

  _saveAsHistory(content){
    let { history } = this.state;
    if(history.indexOf(content) == -1) history.push(content);
    this.props.dispatch({type:'SAVE_MERCHANT_LIST', data:history})
  }

  _deleteAsHistory(content, index){
    let { history } = this.state;
    history.splice(index, 1)
    this.props.dispatch({type:'SAVE_MERCHANT_LIST', data:history})
    this.setState({history})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: mainBackColor
  }
});

const ExportView = connect()(SVOSearchView);

module.exports.SVOSearchView = ExportView;
