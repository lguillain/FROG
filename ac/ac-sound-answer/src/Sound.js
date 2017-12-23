import React, { Component } from 'react';
import MorseNode from './morse.js'

export default class Sound extends Component{
    constructor(props){
      super(props);
      this.playAudio=this.playAudio.bind(this);
      this.initAudio=this.initAudio.bind(this);
    }
  
    close(){
      this.context.close()
    }
  
    initAudio() {
      this.context = new window.AudioContext();
      this.m = new MorseNode(this.context, 8)
      this.m.connect(this.context.destination)
      let temp= this.context
      setTimeout(_ => temp.close(), 6500)
    }
  
  
    playAudio(c) {
      this.initAudio()
      console.log(this.props)
      this.m.playString(this.context.currentTime,c)
    }
  
    render(){
      return(
        <p onClick={x => this.playAudio(this.props.answer)}>🔊</p>
      );
    }
  }