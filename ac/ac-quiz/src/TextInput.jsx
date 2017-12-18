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
    console.log(this.props, this.state)
    this.setState({
      char: this.state.char + this.baseChar,
      value: this.state.value
    });
    this.props.callbackFn(this.state.char + this.baseChar)
  };

  reset() {
    this.setState({
      char: "",
      value: this.state.value
    });
  };


  handleChange = (e: { target: { value: string } }) => {
    this.setState({ value: e.target.value });
  };

  render() {
    return (
      <div onChange={this.handleChange}>
        {this.state.char.length > 0 ?
          <div>
              {(this.state.char == this.props.correct) ? <p style={{color:'green'}}>{this.state.char}</p> : <p style={{color:'red'}}>{this.state.char}</p>}
          </div>
            :
          ''
            }
        <button onMouseDown={this.create} onMouseUp={this.update} >press to write morse</button>
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
