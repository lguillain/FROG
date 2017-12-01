// @flow
const exampleConfig = {
  title: 'Stat 101',
  guidelines:
    "Ce Quizz est anonyme, pas noté et ne compte donc en aucun cas pour la note à l'examen final. Une seule réponse est correcte par question. Si vous ne connaissez pas la réponse, répondez NA.",
  questions: [
    {
      question: 'Laquelle de ces expressions est fausse?',
      answers: [
        'L',
        'A',
        'NA'
      ]
    },
    {
      question: 'Laquelle de ces expressions est fausse?',
      answers: [
        'L',
        'A',
        'NA'
      ]
    },
    {
      question: 'Laquelle de ces expressions est juste?',
      answers: [
        'L',
        'A',
        'NA'
      ]
    },
    {
      question:
        'Pour deux événements $A$ et $B$ indépendants, laquelle de ces expressions est juste?',
      answers: [
        'L',
        'A',
        'NA'
      ]
    },
    {
      question:
        "On sait que la probabilité d'avoir un accident lors d'un trajet sur la route reliant Lausanne à Vevey est égale à 0.01%. On sait également que, sur ce trajet, la probabilité d'avoir un accident est deux fois plus élevée lorsque qu'il pleut que lorsqu'il ne pleut pas. On sait enfin qu'il pleut 20% du temps sur ce tronçon routier. Quelle est la probabilité d'avoir un accident lorsqu'il pleut sur la route reliant Lausanne à Vevey?",
      answers: [
        'L',
        'A',
        'NA'
      ]
    },
    {
      question:
        'Un cadenas à numéros possède trois roues; chacune porte les numéros 0 à 9. Combien de "nombres" secrets y a-t-il?',
      answers: ['$120$', '$729$', '$720$', '$1000$', 'NA']
    },
    {
      question:
        'Soient deux variables aléatoires X et Y indépendantes. On note σ(X)² et σ(Y)² leur variance respective. Laquelle de ces expressions est juste?',
      answers: [
        'L',
        'A',
        'NA'
      ]
    },
    {
      question:
        'Laquelle des fonctions suivantes est-elle une densité de probabilité?',
      answers: [
        'L',
        'A',
        'NA'
      ]
    }
  ]
};
export const meta = {
  name: 'MCQ with sound in Answers',
  shortDesc: 'Filling a MCQ form',
  description: 'Display a multiple-choice questions form.',
  exampleData: [
    {
      config: exampleConfig,
      title: 'Sample MCQ',
      activityData: {}
    }
  ]
};
