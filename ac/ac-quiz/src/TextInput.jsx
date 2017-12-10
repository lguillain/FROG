// @flow

import React, { Component } from 'react';

class TextInput extends Component {
  state: { value: string, char: string };

  constructor(props: { callbackFn: Function, correct: String }) {
    super(props);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      value: '',
      char: "",
    };
  };

  create() {
    this.baseChar = '•'
    setTimeout(x => { this.baseChar = '—' }, 500)
  };

  update() {
    this.setState({
      char: this.state.char + this.baseChar,
      value: this.state.value
    });
  };

  reset() {
    this.setState({
      char: "",
      value: this.state.value
    });
  };

  onKeyPress = (e: Object) => {
    if (e.key === 'Enter') {
      this.props.callbackFn(e.target.value);
      this.setState({ value: '', char: this.state.char });
      e.preventDefault();
    }
  };


  handleChange = (e: { target: { value: string } }) => {
    this.setState({ value: e.target.value });
  };

  render() {
    console.log(this.state.char + '  ' + this.props.correct)
    console.log(this.state.char.length + '  ' + this.props.correct.length)
    return (
      <div onChange={this.handleChange}>
        {this.state.char.length > 0 ?
          <div>
              {(this.state.char == this.props.correct) ? <p style={{color:'green'}}>{this.state.char}</p> : <p style={{color:'red'}}>{this.state.char}</p>}
          </div>
            :
          ''
            }
        <button onMouseDown={this.create} onMouseUp={this.update} onKeyPress={this.onKeyPress}>press to write morse</button>
            <button onClick={x => this.setState({
              char: this.state.char + "   ",
              value: this.state.value
            })}>add space</button>
            <button onClick={this.reset}>reset</button>
          </div>
    );
  }
};



export default TextInput;
