/**
* Created by wuran on 17/06/26.
* 错误提示页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, NativeModules, Animated } from "react-native";

import { W/** 屏宽*/, H/** 屏高*/, mainBackColor/** 背景 */, mainColor/** 项目主色 */, borderColor, mainTextGreyColor, mainTextColor } from '../../configs/index.js';/** 自定义配置参数 */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

import {Actions} from "react-native-router-flux";
import Picker from 'react-native-wheel-picker'
import Toast from '@remobile/react-native-toast';

const MarginTop = W/3;
const ComponentW = W - 60;
const ComponentH = 0.45*H;
const ButtonPadding = 15;
const ButtonW = (W - 50)/2;
const ButtonH = 33;
const PickerH = ComponentH - ButtonH - ButtonPadding;
const PickerW = ComponentW - 20;

const YearKeys = ['2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026']
const MonthKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const TimeKeys = ['上午', '下午']

class AppointmentDatePicker extends React.Component {

  constructor(props){
    super (props);
    this.state = {
        offset: new Animated.Value(H),
        yearSelectIndx:0,
        monthSelectIndex:0,
        daySelectIndex:0,
        dayArray: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        timeSelectIndex:0,
        today: props.today,
    };

    this._closeCallback = this._closeCallback.bind(this);
    this._confirm = this._confirm.bind(this);
    this.dateArray = this._createDateData();
    // console.log(' the dateArray -->> ', this.dateArray);
  }

  componentDidMount() {
    let dayArray = this._getDayData(this.dateArray, 0, 0);
    this.setState({dayArray})

    Animated.timing(this.state.offset, {
      duration: 200,
      toValue: 0
    }).start();
  }

  componentWillUnmount(){
    // console.log(' SuccessView and execute componentWillUnmount');
  }

  render(){
    let { offset, yearSelectIndx, monthSelectIndex, daySelectIndex, monthArray, dayArray, timeSelectIndex } = this.state;
    // console.log(' dayArray -->> ', dayArray);

    return (
      <Animated.View style={[styles.container, {transform: [{translateY: offset}]}]}>
        <View style={{width:W, height:ComponentH, backgroundColor:'white'}}>

          <View style={{flex:1, flexDirection:'row', paddingHorizontal:20}}>
            <Picker
              style={{flex:1, height:PickerH}}
              selectedValue={yearSelectIndx}
              itemStyle={{color:mainTextColor, fontSize:18}}
              onValueChange={(index) => {
                this.setState({yearSelectIndx:index, dayArray:this._getDayData(this.dateArray, index, this.state.monthSelectIndex), daySelectIndex:0})
              }}>
              {YearKeys.map((value, i) => (
                <Picker.Item label={value} value={i} key={i}/>
              ))}
            </Picker>

            <Picker
              style={{flex:1, height:PickerH}}
              selectedValue={monthSelectIndex}
              itemStyle={{color:mainTextColor, fontSize:18}}
              onValueChange={(index) => {
                this.setState({monthSelectIndex:index, dayArray:this._getDayData(this.dateArray, this.state.yearSelectIndx, index), daySelectIndex:0})
              }}>
              {MonthKeys.map((value, i) => (
                <Picker.Item label={value} value={i} key={i}/>
              ))}
            </Picker>

            <Picker
              style={{flex:1, height:PickerH}}
              selectedValue={daySelectIndex}
              itemStyle={{color:mainTextColor, fontSize:18}}
              onValueChange={(index) => this.setState({daySelectIndex:index}) }>
              {dayArray.map((value, i) => (
                <Picker.Item label={value} value={i} key={i}/>
              ))}
            </Picker>

            <Picker
              style={{flex:1, height:PickerH}}
              selectedValue={timeSelectIndex}
              itemStyle={{color:mainTextColor, fontSize:18}}
              onValueChange={(index) => this.setState({timeSelectIndex:index}) }>
              {TimeKeys.map((value, i) => (
                <Picker.Item label={value} value={i} key={i}/>
              ))}
            </Picker>
          </View>

          <View style={{justifyContent:'center', paddingBottom:ButtonPadding, flexDirection:'row'}} >
            <XButton title={'取消'} onPress={this._closeModal.bind(this, this._closeCallback)} style={{width:ButtonW, height:ButtonH, backgroundColor:'transparent', borderColor:borderColor, borderWidth:StyleSheet.hairlineWidth}} textStyle={{color:mainColor}}/>
            <XButton title={'确认'} onPress={this._confirm.bind(this)} style={{width:ButtonW, height:ButtonH, marginLeft:10}}/>
          </View>
        </View>
      </Animated.View>
    );
  }

  /** 私有方法 */
  _closeModal(callback) {
    Animated.timing(this.state.offset, {
      duration: 200,
      toValue: H
    }).start(callback);
  }

  _closeCallback(){
    Actions.pop();
  }

  _confirm(){
    let year = YearKeys[this.state.yearSelectIndx];
    let month = MonthKeys[this.state.monthSelectIndex];
    let day = this.state.dayArray[this.state.daySelectIndex];
    let time = TimeKeys[this.state.timeSelectIndex]

    if(new Date(`${year}/${month}/${day}`) < new Date()) Toast.showShortCenter('预约日期不能选择今天之前')
    else{
      this._closeModal(Actions.pop)
      if(this.props.modalCallback) this.props.modalCallback(`${year}-${month}-${day}`, time);
    }
  }

  _getDayData(source, yearIndex, monthIndex){
    let year = source[yearIndex];
    let monthArray = year[YearKeys[yearIndex]];
    let month = monthArray[monthIndex];
    let dayArray = month[MonthKeys[monthIndex]];

    return dayArray;
  }

 _createDateData() {
       let date = [];
       for(let i=2016;i<=2026;i++){
           let month = [];
           for(let j = 1;j<13;j++){
               let day = [];
               if(j === 2){
                   for(let k=1;k<29;k++){
                      //  day.push(k+'日');
                      day.push(k+'');
                   }
                   //Leap day for years that are divisible by 4, such as 2000, 2004
                   if(i%4 === 0){
                      //  day.push(29+'日');
                       day.push(29+'');
                   }
               }
               else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                   for(let k=1;k<32;k++){
                      //  day.push(k+'日');
                      day.push(k+'');
                   }
               }
               else{
                   for(let k=1;k<31;k++){
                      //  day.push(k+'日');
                      day.push(k+'');
                   }
               }
               let _month = {};
              //  _month[j+'月'] = day;
              _month[j] = day;
               month.push(_month);
           }
           let _date = {};
          //  _date[i+'年'] = month;
           _date[i] = month;
           date.push(_date);
       }
       return date;
   }

}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:"rgba(52,52,52,0.5)",
        justifyContent: "flex-end",
    },
});

module.exports.AppointmentDatePicker = AppointmentDatePicker;
