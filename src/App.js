import React, { useState } from 'react';
import ProblemList from './ProblemList';
import ProblemDetail from './ProblemDetail';
import './App.css';

function App() {
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);

  const handleAddProblem = (newProblem) => {
    setProblems([...problems, { ...newProblem, id: Date.now() }]);
  };

  const handleSelectProblem = (problemId) => {
    const selectedProblem = problems.find(p => p.id === problemId);
    setActiveProblem(selectedProblem);
  };

  const handleUpdateProblem = (updatedProblem) => {
    setProblems(problems.map(p => p.id === updatedProblem.id ? updatedProblem : p));
    setActiveProblem(updatedProblem);
  };

  const handleDeleteProblem = (problemId) => {
    setProblems(problems.filter(p => p.id !== problemId));
    setActiveProblem(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>გადაწყვეტილების მიღების მხარდაჭერის სისტემა (MCDM)</h1>
        <p>AHP და TOPSIS მეთოდებზე დაფუძნებული ჰიბრიდული მიდგომა</p>
      </header>
      <main>
        {activeProblem ? (
          <ProblemDetail
            problem={activeProblem}
            onUpdate={handleUpdateProblem}
            onBack={() => setActiveProblem(null)}
          />
        ) : (
          <ProblemList
            problems={problems}
            onAddProblem={handleAddProblem}
            onSelectProblem={handleSelectProblem}
            onDeleteProblem={handleDeleteProblem}
          />
        )}
      </main>
    </div>
  );
}

export default App;