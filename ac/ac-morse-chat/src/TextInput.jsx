// @flow

import React, { Component } from 'react';

class TextInput extends Component {
  state: { value: string , char: string};

  constructor(props: { callbackFn: Function }) {
    super(props);
    this.create=this.create.bind(this);
    this.update=this.update.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      value: '',
      char: "",
    };
  };

  create(){
    this.baseChar = '·'
    setTimeout( x => {this.baseChar = '—'}, 500)
    console.log(this)
  };
  
  update(){
    this.setState({
      char: this.state.char+this.baseChar,
      value: this.state.value
    });
    console.log(this.state.char)
  };
  
  reset(){
    this.setState({
      char: "",
      value: this.state.value
    });
  };

  onKeyPress = (e: Object) => {
    console.log('was engaged')
    if (e.key === 'Enter') {
      this.props.callbackFn(e.target.value);
      this.setState({ value: '' , char: this.state.char});
      e.preventDefault();
    }
  };


  handleChange = (e: { target: { value: string } }) => {
    console.log(this.state)
    this.setState({ value: e.target.value });
  };

  render() {
    return (
      <div onChange={this.handleChange}>
        {/* <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.onKeyPress}
        /> */}
        <p>{this.state.char}</p>
       <button onMouseDown={this.create} onMouseUp={this.update} onKeyPress={this.onKeyPress}>press to write morse</button>
        <button onClick={x => this.setState({
          char: this.state.char + "   ",
          value: this.state.value
        })}>add space</button>
        <button onClick={x => {
          this.props.callbackFn(this.state.char);
          this.setState({ value: '' , char: ''});
        }
      }>send</button>
      </div>
    );
  }
};



export default TextInput;
