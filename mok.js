export const words = {
  quizTitle: "QUIZ",
  logoAlt: "Logo",
  about: "About",
  description: `Welcome to Quiz where you have to answer [:count] questions and win a prize if you answer all questions correctly. Good luck`,
  start: "Start",
  next: "Next",
  rightQuestion: "Number of correct questions :right out of",
};

export const quizGame = {
  time: 10, // Seconds 600 = 10m
  questions: [
    {
      question:
        "In which part of your body would you find the cruciate ligament?",
      answers: [
        {
          id: 1,
          answer: "Knee",
          right: true,
        },
        {
          id: 2,
          answer: "Hand",
        },
        {
          id: 3,
          answer: "Head",
        },
        {
          id: 4,
          answer: "Finger",
        },
      ],
    },
    {
      question:
        "What is the name of the main antagonist in the Shakespeare play Othello?",
      answers: [
        {
          id: 1,
          answer: "John",
        },
        {
          id: 2,
          answer: "Iago",
          right: true,
        },
        {
          id: 3,
          answer: "Alex",
        },
        {
          id: 4,
          answer: "Olivia",
        },
      ],
    },
  ],
};
