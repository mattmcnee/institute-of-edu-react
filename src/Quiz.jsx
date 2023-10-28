import React, { useState } from 'react';
import quizQuestions from './quizQuestions.json';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (selectedOption) => {
    // Check if the selected option is correct and update the score
    const isCorrect = selectedOption === quizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Save the user's answer and move to the next question
    setUserAnswers([...userAnswers, { question: quizQuestions[currentQuestion].question, answer: selectedOption }]);
    setCurrentQuestion(currentQuestion + 1);
  };

  const renderQuestion = () => {
    const question = quizQuestions[currentQuestion];

    return (
      <div>
        <h2>{question.question}</h2>
        <ul>
          {question.options.map((option, index) => (
            <li key={index}>
              <button onClick={() => handleOptionSelect(option)}>{option}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResult = () => {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your score: {score}/{quizQuestions.length}</p>
        <ul>
          {userAnswers.map((ua, index) => (
            <li key={index}>{ua.question}: {ua.answer}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="quiz">
      {currentQuestion < quizQuestions.length ? renderQuestion() : renderResult()}
    </div>
  );
}

export default Quiz;
