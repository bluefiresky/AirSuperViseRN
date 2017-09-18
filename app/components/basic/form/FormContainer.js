/**
 * ramroll on 16/8/15.
 */


import React, { Component } from 'react'

import { Form } from "./Form"

//// fn form_connector.js

import { form_connector } from "./form_connector"


export class FormContainer extends Component{

  constructor(props){
    super()
    this._changeHandler = this._changeHandler.bind(this)
    this._errorHandler = this._errorHandler.bind(this)
    this._resetHandler = this._resetHandler.bind(this)

    this.form = new Form(props.validate, props.submit)
    this.state = {
      fields : this.form.createFields(props.fields)
    }
  }


  componentDidMount(){
    this.form.registerChangeEventHandler(this._changeHandler)
    this.form.registerErrorHandler(this._errorHandler)
    this.form.registerResetEventHandler(this._resetHandler)
    if(this.props.onChange) {
      this.props.onChange(this.form.getData())
    }
  }


  componentWillUnmount(){
    this.form.removeChangeEventHandler(this._changeHandler)
    this.form.removeResetEventHandler(this._resetHandler)
    this.form.removeErrorHandler(this._errorHandler)
  }
   _resetHandler(fields) {
    this.setState({
      children : this.nextChildren(this.props.children, fields)
    })
  }

  _errorHandler(fields){
    this.setState({
      fields
    })
  }


  _changeHandler(name, value, fields){
    this.setState({
      fields
    }, (() => {

      if(this.props.onChange) {
        this.props.onChange(this.form.getData())
      }

    }).bind(this))
  }

  _getForm(){
    return this.form
  }


  render() {
    const {children, ...others} = this.props
    const {fields} = this.state
    return React.cloneElement(children, {...others, fields, form : this.form})
  }


}

const assert = (prop, predicate, errorMessage) => {
  return data => {
    if(!predicate(data[prop])){
      return errorMessage
    } else {
      return null
    }
  }
}
