// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components';
import Latex from 'react-latex';
import seededShuffle from 'seededshuffle';
import type { ActivityRunnerT } from 'frog-utils';
import TextInput from './TextInput';

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

const DescriptionField = props => {
  let prettyPrint = beautify(props.description);
  return(
  <QuestionTitle>
    <Latex>{prettyPrint}</Latex>
  </QuestionTitle>
  );
}

function beautify(question){
  let temp = question.replace(/\./g, '•').replace(/-/g, '—');
  return temp
}

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
    console.log(correct)
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
        {data.completed ? 
  activityData.config.exercise? <ShowAnswers logger={props.logger} userInfo={props.userInfo} correct={correct} questions={activityData.config.questions} typeMorse={activityData.config.typeMorse}/> : <h1>Form completed!</h1> 
        : 
        <Quiz {...props} />}
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
  console.log(correctQs)
  return correctQs
}

const ShowAnswers = ({correct, questions, typeMorse, userInfo, logger}) => {
  return(
   <div>
     {correct.map( (x, i) => <ShowAnswer logger={logger} userInfo={userInfo} correct={x.correct} index={i} q={questions[i]} answer={x.answer} key={i} typeMorse={typeMorse}/>)}
     <p>The next actvity will start soon :D</p>
  </div> 
  );
}

const ShowAnswer = ({correct, q, answer, index, typeMorse, userInfo, logger}) => {
  const correctAnswer = getAnswer(q.answers);
  return(
    <div>
      <p style={{fontWeight: 'bold'}} >{index+1}. {q.question}</p>
      <p>You answered : {beautify(answer)}</p>
      {correct ? 
      <p>Your answer was : <span style={{color:'green'}}>correct</span></p>
      : 
      <div>
      <p>Your answer is : <span style={{color:'red'}}>incorrect</span></p>
      <p>The correct answer was: {beautify(correctAnswer)}</p>
      {typeMorse?
        <div>
          <p>Please retype your answer: </p>
          <TextInput
            correct={beautify(correctAnswer)}
            callbackFn={char => {
              logger({ type: 'extra_question_vis', value: {typed: char, question: q.question, userInfo: userInfo}});
            }
          }
          />
        </div>
        : 
        <p></p>
    }
      </div>
      }
    <br/>
    </div>
  );
}

const getNum = x => parseInt(x.split(' ').pop(), 10);

const getAnswer = x => x.filter( answer => answer.isCorrect)[0].choice