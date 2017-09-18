/**
* Created by wuran on 16/12/30.
* 自定义RadioButton
* 用法，查看README.MD文件
*/

import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';

const window = Dimensions.get('window');

/**
 *  Radio Class
 */
class Radio extends Component {

  static defaultProps = {
    defaultSelect: -1
  }

  static propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    defaultSelect: React.PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = { selectedIndex: -1 }
  }

  _onSelect(index) {
    let { onSelect } = this.props;
    this.setState({
      selectedIndex: index
    });
    onSelect(index);
  }

  render() {
    let { selectedIndex } = this.state;
    let { defaultSelect , radioStyle, children } = this.props;

    let targetIndex = selectedIndex !== -1? selectedIndex : defaultSelect;

    let options = React.Children.map(children, (child, index) => {
      if (child.type === Option) {
        return React.cloneElement(child, {
          onPress: () => this._onSelect(index),
          isSelected: index == targetIndex
        });
      }

      return child;
    });

    return (
      <View style={[radioStyle && radioStyle]}>
        {options}
      </View>
    );
  }
}


class Option extends Component {

  static propTypes = {
    onPress: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
    color: React.PropTypes.string,
    selectedColor: React.PropTypes.string,
    default: React.PropTypes.bool,
    component: React.PropTypes.func,
    selectedComponent: React.PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  render() {
    let { onPress } = this.props;
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        {this._renderView(this.props)}
      </TouchableWithoutFeedback>
    );
  }

  _renderView(props){
    let { isSelected, color, selectedColor, component, selectedComponent, optionStyle, children } = this.props;
    let Label;
    if (component && selectedComponent) {
      Label = <CustomComponent component={component} selectedComponent={selectedComponent} isSelected={isSelected}/>;
    }else {
      Label = <Circle color={color} selectedColor={selectedColor} isSelected={isSelected}/>
    }

    return(
      <View style={[{flexDirection: 'row', alignItems: 'center'}, optionStyle && optionStyle ]}>
        {Label}
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </View>
    );
  }
}

/**
 *  Circle Class
 *  默认RadioButton样式
 */
class Circle extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let { color, isSelected, selectedColor } = this.props;

    let innerCircle;
    let appliedColor;

    if (isSelected) {
      appliedColor = selectedColor;
      innerCircle = <View style={[styles.innerCircle, { backgroundColor: appliedColor }]}/>;
    } else {
      appliedColor = color;
      innerCircle = null;
    }

    return (
      <View style={{ paddingRight: 10 }}>
        <View style={[styles.outerCircle, { borderColor: appliedColor }]}>
          {innerCircle}
        </View>
      </View>
    );
  }
}

Circle.propTypes = {
  color: React.PropTypes.string,
  selectedColor: React.PropTypes.string,
  isSelected: React.PropTypes.bool
};

Circle.defaultProps = {
  isSelected: false
};

/**
 *  Circle Class
 *  默认RadioButton样式
 */
class CustomComponent extends Component {

  static propTypes = {
    component: React.PropTypes.func.isRequired,
    selectedComponent: React.PropTypes.func.isRequired,
    isSelected: React.PropTypes.bool
  }

  // static defaultProps = {
  //   isSelected: false,
  // }

  constructor(props){
    super(props);
  }

  render(){
    let { isSelected, component, selectedComponent } = this.props;
    let Label = isSelected? selectedComponent : component;
    return(
      <View style={{ paddingRight: 10 }}>
        <Label />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  outerCircle: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2 / window.scale,
    borderRadius: 10,
    backgroundColor: 'transparent'
  },
  innerCircle: {
    height: 16,
    width: 16,
    borderRadius: 8
  }
});

Radio.Option = Option;
module.exports.RadioButton = Radio;
