// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components';
import Latex from 'react-latex';
import seededShuffle from 'seededshuffle';
import type { ActivityRunnerT } from 'frog-utils';
import TextInput from './TextInput';
import Sound from './Sound.js'

import LatexWidget from './LatexWidget';

const Main = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fdfdfd;
`;

const Container = styled.div`
  max-width: 500px;
  max-height: 100%;
  margin: 10px;
  flex: 0 1 auto;
`;

const QuestionTitle = styled.div`
  border-top: solid;
  padding-top: 10px;
`;

const DescriptionField = props => (
  <QuestionTitle>
    <Latex>{props.description}</Latex>
  </QuestionTitle>
);

const Quiz = ({
  activityData,
  data,
  dataFn,
  logger,
  userInfo
}: ActivityRunnerT) => {
  const schema = {
    title: activityData.config.name,
    type: 'object',
    properties: {}
  };

  const uiSchema = {};

  const condShuffle = (list, type, salt) =>
    [type, 'both'].includes(activityData.config.shuffle)
      ? seededShuffle.shuffle(list, userInfo.id + salt, true)
      : list;

  const questions = condShuffle(
    activityData.config.questions
      .filter(q => q.question && q.answers)
      .map((x, i) => [x, i]),
    'questions',
    ''
  );

  questions.forEach(([q, i], reali) => {
    const answers = condShuffle(q.answers.map((x, y) => [x, y]), 'answers', i);
    schema.properties['question ' + i] = {
      type: 'number',
      title: 'Question ' + (reali + 1),
      enum: answers.map(([, k]) => k),
      enumNames: answers.map(([x]) => x.choice)
    };
    uiSchema['question ' + i] = {
      'ui:widget': 'latexWidget',
      'ui:description': q.question
    };
    if (activityData.config.justify) {
      schema.properties['question ' + i + ' justify'] = {
        type: 'string',
        title: ' ',
        description: 'Justify your answer'
      };
    }
  });

  const widgets = { latexWidget: LatexWidget };
  const fields = { DescriptionField };
  const formData = data.form;
  const onSubmit = e => {
    logger({ type: 'submit', payload: e.formData });
    if (data.form && Object.keys(data.form).length >= questions.length) {
      dataFn.objInsert(true, 'completed');
    }
  };
  const onChange = e => {
    dataFn.objInsert(e.formData, 'form');
    logger({ type: 'formData', payload: e.formData });
  };

  return (
    <Form
      {...{ schema, uiSchema, formData, onSubmit, onChange, widgets, fields }}
    />
  );
};

export default (props: ActivityRunnerT) => {
  const { activityData, data } = props;
  let correct = []
  if(data.completed) {
    correct = getCorrect(data.form, activityData.config);
  }

  return (
    <Main>
      <h1>{activityData.config.title || 'Quiz'}</h1>
      <Container>
        <Latex>
          {activityData.config.guidelines || 'Answer the following questions'}
        </Latex>
      </Container>
      <Container>
        {data.completed ? <ShowAnswers logger={props.logger} correct={correct} questions={activityData.config.questions} /> : <Quiz {...props} />}
      </Container>
    </Main>
  );
};


function getCorrect(form, configData){
  const correctQs = [];

  Object.keys(form).forEach(q => {
    const num = getNum(q);
    console.log(num)
    const answers = [];
    const response = configData.questions[num].answers[form[q]];
    answers[num] = response.choice;
    if (configData.hasAnswers) {
      correctQs[num] = {correct : !!response.isCorrect, answer: response.choice};
    }
  });
  return correctQs
}

const ShowAnswers = ({correct, questions, logger}) => {
  return(
   <div>
     {correct.map( (x, i) => <ShowAnswer index ={i} logger={logger} correct={x.correct} q={questions[i]} answer={x.answer} key={i}/>)}
  </div> 
  );
}

const ShowAnswer = ({correct, q, answer, index, logger}) => {
  const correctAnswer = getAnswer(q.answers);
  return(
    <div>
      <p style={{fontWeight: 'bold'}} >{index+1}. {q.question}</p>
      <p>You answered : </p><Sound answer={answer}/>
      {
      correct ? 
      <p>Your answer was : <span style={{color:'green'}}>correct</span></p>
      : 
      <div>
      <p>Your answer is : <span style={{color:'red'}}>incorrect</span></p>
      <p>The correct answer was: </p><Sound answer={correctAnswer}/>
      <TextInput
      correct={correctAnswer}
      callbackFn={char => {
        logger({ type: 'extra_question_audio', value: {typed: char, question: index}});
      }}
    />
    </div>
    }
    </div>
  );
}

const getNum = x => parseInt(x.split(' ').pop(), 10);

const getAnswer = x => x.filter( answer => answer.isCorrect)[0].choice

function beautify(question){
  let temp = question.replace(/\./g, '•').replace(/-/g, '—');
  return temp
}