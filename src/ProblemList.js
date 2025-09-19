import React, { useState } from 'react';

const ProblemList = ({ problems, onAddProblem, onSelectProblem, onDeleteProblem }) => {
  const [newProblemTitle, setNewProblemTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProblemTitle.trim()) {
      onAddProblem({
        title: newProblemTitle,
        criteria: [],
        alternatives: [],
        weights: {},
        decisionMatrix: {},
        topsisResults: []
      });
      setNewProblemTitle('');
    }
  };

  return (
    <div className="module-container problem-list-container">
      <h2>გადაწყვეტილების პრობლემების სია</h2>
      <form onSubmit={handleSubmit} className="add-problem-form">
        <input
          type="text"
          value={newProblemTitle}
          onChange={(e) => setNewProblemTitle(e.target.value)}
          placeholder="ახალი პრობლემის სახელი"
        />
        <button type="submit" className="add-btn">დამატება</button>
      </form>
      {problems.length > 0 ? (
        <ul className="problem-items-list">
          {problems.map((problem) => (
            <li key={problem.id} className="problem-item">
              <span className="problem-title" onClick={() => onSelectProblem(problem.id)}>
                {problem.title}
              </span>
              <button onClick={() => onDeleteProblem(problem.id)} className="delete-btn">წაშლა</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-problems-msg">პრობლემები არ არის დამატებული.</p>
      )}
    </div>
  );
};

export default ProblemList;