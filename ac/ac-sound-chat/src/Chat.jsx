// @flow

import React, { Component } from 'react';
import MorseNode from './morse.js'

import { type ActivityRunnerT, uuid } from 'frog-utils';

import TextInput from './TextInput';


class InnerAudio extends Component{
  constructor(props){
    super(props);
    this.playAudio=this.playAudio.bind(this);
    this.initAudio=this.initAudio.bind(this);
  }

  initAudio() {
    this.context = new window.AudioContext()
    this.m = new MorseNode(this.context, 2)
    console.log(this.context.destination)
    this.m.connect(this.context.destination)
  }


  playAudio(c) {
    console.log(c)
    this.m.playChar(this.context.currentTime,c)
  }

  render(){
    this.initAudio();
    console.log(this.props)
    return(
      <p onClick={x => this.playAudio(this.props.msg.msg)}>{this.props.msg.user}: 🔊</p>
    );
  }
}

const Chatmsg = ({ msg }) => (
  <li>
    <InnerAudio msg={msg}/>
  </li>
);

export default ({
  logger,
  activityData,
  data,
  dataFn,
  userInfo
}: ActivityRunnerT) => (
  <div>
    <h4>{activityData.config.title}</h4>
    <ul>{data.map(chatmsg => <Chatmsg msg={chatmsg} key={chatmsg.id} />)}</ul>
    <TextInput
      callbackFn={e => {
        const id = uuid();
        dataFn.listAppend({ msg: e, user: userInfo.name, id });
        logger({ type: 'chat', value: e, itemId: id });
      }}
    />
  </div>
);
