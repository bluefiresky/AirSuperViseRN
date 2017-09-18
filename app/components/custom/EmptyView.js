/**
 * creat by renhanyi on 17/04/27.
 * 当前没有数据的时候展示的页面
 */
'use strict';
import React, { Component } from 'react';
import { W, backgroundGrey } from '../../configs/index';
import {
    StyleSheet,
    Image,
    Text,
    View
} from 'react-native';
class EmptyView extends Component {
  render(){
    return (
      <View style={[styles.container,this.props.style]}>
        <Image source={this.props.noDataImage}  style={[styles.icon,this.props.iconStyle]}/>
        <Text style={styles.noDataText}>{this.props.noDataTipMsg}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: backgroundGrey,
        justifyContent:'center',
        width : W,
    },
    noDataText: {
        marginTop: 20,
        color: '#888888',
        alignSelf:'center',
    },
    icon: {
        alignSelf:'center'
    },
});

module.exports.EmptyView = EmptyView;
