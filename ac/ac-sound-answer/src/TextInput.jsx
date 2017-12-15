// @flow

import React, { Component } from 'react';
import MorseNode from './morse.js'

class TextInput extends Component {
  state: { value: string , char: string};

  constructor(props) {
    super(props);
    this.create=this.create.bind(this);
    this.update=this.update.bind(this);
    this.reset = this.reset.bind(this);
    this.startAudio=this.startAudio.bind(this);
    this.stopAudio=this.stopAudio.bind(this);
    this.playAudio=this.playAudio.bind(this);
    this.initAudio=this.initAudio.bind(this);
    this.state = {
      value: '',
      char: "",
    };
  };

  initAudio() {
    this.context = new window.AudioContext()
    this.m = new MorseNode(this.context, 2)
    console.log(this.context.destination)
    this.m.connect(this.context.destination)
  }


  playAudio(c) {
    this.initAudio()
    this.m.playChar(this.context.currentTime,c)
    let temp= this.context
    setTimeout(_ => temp.close(), 7500)
  }

  create(){
    this.baseChar = '.'
    setTimeout( x => {this.baseChar = '-'}, 500)
  };
  
  update(){
    this.setState({
      char: this.state.char+this.baseChar,
      value: this.state.value
    });
  };
  
  reset(){
    this.setState({
      char: "",
      value: this.state.value
    });
    this.setState({show: false, char: this.state.char, value: this.state.value});
  };

  startAudio(){
    this.initAudio()
    this.m.playSound(this.context.currentTime)
    this.create()
  }

  stopAudio(){
    this.m.stopPlaying(this.context.currentTime)
    this.update()
    this.context.close()
  }

  onKeyPress = (e: Object) => {
    if (e.key === 'Enter') {
      this.props.callbackFn(e.target.value);
      this.setState({ value: '' , char: this.state.char});
      e.preventDefault();
    }
  };


  handleChange = (e: { target: { value: string } }) => {
    this.setState({ value: e.target.value });
  };

  render() {
    return (
      <div onChange={this.handleChange}>
        <p onClick={x => this.playAudio(this.state.char)}>click play what you wrote: {this.state.char != '' ? '🔊' : ''}</p>
       <button onMouseDown={this.startAudio} onMouseUp={this.stopAudio} onKeyPress={this.onKeyPress}>press to write morse</button>
        <button onClick={x => this.setState({
          char: this.state.char + "   ",
          value: this.state.value
        })}>add space</button>
        <button onClick={this.reset}>reset</button>
        <button onClick={x => {
          // this.props.callbackFn(this.state.char)
          this.show = true;
          this.setState({show: true, char: this.state.char, value: this.state.value});
          this.props.logger({ type: 'char', value: this.state.char});
        }
      }>correct</button>
      {this.state.show ? 
        (this.state.char == toChar(this.props.correct))? <p style={{color:'green'}}>correct!</p> : 
        <p style={{color:'red'}}>try again</p>
        : ''}
      </div>
    );
  }
};

function toChar(w){
  const MORSE = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--.."
  }

  let morse = '';
  for(var i = 0; i < w.length; i++)
    morse += MORSE[w[i]];
  return morse
}

export default TextInput;
