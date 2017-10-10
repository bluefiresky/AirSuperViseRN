/**
 * renhanyi
 * 选择车牌
 */

import React, { Component } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, FlatList, Image } from 'react-native';
import { W, inputLeftColor, mainColor } from '../../configs/index.js';

const provincialData = ['京','津','沪','渝','冀','晋','辽','吉','黑','苏','浙','皖','闽','赣','鲁',
                        '豫','鄂','湘','粤','琼','川','贵','云','陕','甘','青','藏','桂','蒙','宁','新','使','WJ'];
const numberData = ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M',
                    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z','学','警','领','港','澳','试','挂']

const ItemWidth = (W - (20 + 15 + (7*10))) / 6;
const DeleteIcon = require('./image/icon-delete.png');

export class SelectCarNum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showData:null,
    }
    this.currSeleIndex = 1;
  }
  showData(type){
    if(!type){
      if(!this.state.show){
        let { plateNum } = this.props;
        if(!plateNum){
          this.currSeleIndex = 0;
          this.setState({showData: provincialData, show:true});
        }else{
          if(this.currSeleIndex == 0) this.setState({showData: provincialData, show:true});
          if(this.currSeleIndex == 1) this.setState({showData: numberData, show:true})
        }
      }else{
        this.setState({show:false})
      }
      return;
    }

    // 当前以显示的切换装填
    if(type === 'province') {
      this.currSeleIndex = 0;
      this.setState({showData: provincialData, show:true})
    }
    if(type === 'number'){
      this.currSeleIndex = 1;
      this.setState({showData: numberData, show:true})
    }
  }

  //删除
  deleteClick() {
    let { plateNum, onChangeValue } = this.props;
    if(plateNum){
      let len = plateNum.length;
      plateNum = plateNum.substring(0, len-1);
      onChangeValue(plateNum);
    }
  }
  //确定
  confirmClick(){
    this.setState({ show: false })
  }
  //返回值
  itemClick(value, index){
    let { plateNum } = this.props;
    // console.log(' itemClick and the value -->> ', value);
    // console.log(' itemClick and the plateNum -->> ', plateNum);
    if(plateNum){
      if(plateNum.length >= 7) this.props.onChangeValue(plateNum);
      else {
        this.props.onChangeValue(plateNum + value);
        if(this.currSeleIndex == 0){
          this.showData('number')
        }
      }
    }else{
      this.props.onChangeValue(value);
      this.showData('number')
    }
  }

  renderOneItem({item, index}){
    return (
      <TouchableOpacity
        style={{width:ItemWidth, height:ItemWidth, marginTop:10, marginLeft:10, alignItems:'center',justifyContent: 'center',borderColor:'#D4D4D4',borderWidth:1,backgroundColor:'white'}}
        onPress={this.itemClick.bind(this, item, index)}
        underlayColor={mainColor}>
        <Text style={{fontSize:16, color:inputLeftColor}}>{item}</Text>
      </TouchableOpacity>
    )
  }
  render(){
    let { show } = this.state;
    let { style, label, hasStar, plateNum, labelWidth } = this.props;
    // {this.state.showData.map((value,index) => this.renderOneItem(value,index))}

    return(
      <View style={[{paddingVertical:15},style]}>
        <View style={{flexDirection:'row'}}>
          {
            hasStar? <Text style={{fontSize:12, color:'red'}}>*</Text> : null
          }
          <Text style={{fontSize: 16, color: inputLeftColor, width: labelWidth?labelWidth : 80, marginTop:7}}>{label}</Text>
          <TouchableOpacity style={{flex:1, height:30, alignItems:'center', justifyContent:'center', borderColor:mainColor, borderWidth:1}} activeOpacity={0.6} onPress={this.showData.bind(this, null)}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>{plateNum}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width:50, alignItems:'flex-end'}} activeOpacity={0.6} onPress={() => this.deleteClick()}>
            <Image style={{height: 30, width: 30, resizeMode:'contain', tintColor:mainColor}} source={DeleteIcon}/>
          </TouchableOpacity>
        </View>
        {
          this.state.show?
            <View style={{borderColor:'#D4D4D4',borderWidth:1,marginTop:10,paddingBottom:10}}>
              <View style={{flexDirection:'row',height:40}}>
                <TouchableOpacity onPress={this.showData.bind(this, 'province')} activeOpacity={0.6} style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:(this.currSeleIndex == 0?'white':'lightgray')}}>
                  <Text style={{fontSize:16, color:inputLeftColor}}>省</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.showData.bind(this, 'number')} activeOpacity={0.6} style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:(this.currSeleIndex == 1?'white':'lightgray')}}>
                  <Text style={{fontSize:16, color:inputLeftColor}}>数字</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.confirmClick()} activeOpacity={0.6} style={{width:50, alignItems:'center', justifyContent:'center', backgroundColor:mainColor}}>
                  <Text style={{fontSize:16, color:'white'}}>确定</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
              <FlatList
                keyExtractor={(item, index) => index}
                data={this.state.showData}
                numColumns={6}
                extraData={this.state}
                renderItem={this.renderOneItem.bind(this)}
              />
              </View>
            </View>
          :
            null
        }
      </View>
    )
  }
}
