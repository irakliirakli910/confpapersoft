// src/TOPSISModule.js

import React, { useState } from 'react';

const TOPSISModule = ({ problem, onComplete }) => {
  const [decisionMatrix, setDecisionMatrix] = useState(() => {
    const matrix = {};
    problem.alternatives.forEach(alt => {
      problem.criteria.forEach(crit => {
        matrix[`${alt.id}-${crit.id}`] = problem.decisionMatrix?.[`${alt.id}-${crit.id}`] || '';
      });
    });
    return matrix;
  });

  const handleScoreChange = (altId, critId, value) => {
    setDecisionMatrix(prev => ({
      ...prev,
      [`${altId}-${critId}`]: value,
    }));
  };

  const calculateTopsisScores = () => {
    const cleanMatrix = {};
    Object.keys(decisionMatrix).forEach(key => {
      cleanMatrix[key] = decisionMatrix[key] === '' ? 0 : parseFloat(decisionMatrix[key]);
    });

    const weightedMatrix = {};
    const ideal = {};
    const antiIdeal = {};

    problem.criteria.forEach(crit => {
      const scores = problem.alternatives.map(alt => cleanMatrix[`${alt.id}-${crit.id}`]);
      const rss = Math.sqrt(scores.reduce((sum, val) => sum + val * val, 0));
      
      problem.alternatives.forEach(alt => {
        const value = cleanMatrix[`${alt.id}-${crit.id}`];
        weightedMatrix[`${alt.id}-${crit.id}`] = rss === 0 ? 0 : (value / rss) * problem.weights[crit.id];
      });
      
      ideal[crit.id] = Math.max(...problem.alternatives.map(alt => weightedMatrix[`${alt.id}-${crit.id}`]));
      antiIdeal[crit.id] = Math.min(...problem.alternatives.map(alt => weightedMatrix[`${alt.id}-${crit.id}`]));
    });

    const scores = problem.alternatives.map(alt => {
      let distToIdeal = 0;
      let distToAntiIdeal = 0;

      problem.criteria.forEach(crit => {
        distToIdeal += Math.pow(weightedMatrix[`${alt.id}-${crit.id}`] - ideal[crit.id], 2);
        distToAntiIdeal += Math.pow(weightedMatrix[`${alt.id}-${crit.id}`] - antiIdeal[crit.id], 2);
      });

      distToIdeal = Math.sqrt(distToIdeal);
      distToAntiIdeal = Math.sqrt(distToAntiIdeal);

      const closenessCoefficient = (distToIdeal + distToAntiIdeal) === 0 ? 0 : distToAntiIdeal / (distToIdeal + distToAntiIdeal);
      return {
        ...alt,
        score: closenessCoefficient.toFixed(3)
      };
    });

    return scores.sort((a, b) => b.score - a.score);
  };
  
  const handleCalculate = () => {
    const results = calculateTopsisScores();
    if (results) {
      onComplete({ decisionMatrix, topsisResults: results });
    }
  };

  return (
    <div className="module-step-container">
      <h3>3. გადაწყვეტილების მატრიცის შევსება და TOPSIS</h3>
      <div className="decision-matrix-container">
        <h4>გადაწყვეტილების მატრიცა</h4>
        <table className="decision-matrix-table">
          <thead>
            <tr>
              <th>ალტერნატივები</th>
              {problem.criteria.map(crit => (
                <th key={crit.id}>{crit.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {problem.alternatives.map(alt => (
              <tr key={alt.id}>
                <td>{alt.name}</td>
                {problem.criteria.map(crit => (
                  <td key={crit.id}>
                    <input
                      type="number"
                      value={decisionMatrix[`${alt.id}-${crit.id}`]}
                      onChange={(e) => handleScoreChange(alt.id, crit.id, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleCalculate} className="next-btn">გამოთვლა</button>
    </div>
  );
};

export default TOPSISModule;