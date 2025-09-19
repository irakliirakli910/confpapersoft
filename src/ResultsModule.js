// src/ResultsModule.js

import React from 'react';

const ResultsModule = ({ problem, onBackToStart }) => {
  // აქ არის მთავარი შესწორება.
  // ვამოწმებთ, რომ problem.topsisResults არსებობს და არის მასივი
  const hasResults = problem && problem.topsisResults && Array.isArray(problem.topsisResults) && problem.topsisResults.length > 0;

  return (
    <div className="module-step-container">
      <h3>4. საბოლოო რანჟირება</h3>
      {hasResults ? (
        <div className="results-container">
          <table className="project-table">
            <thead>
              <tr>
                <th>რანგი</th>
                <th>ალტერნატივა</th>
                <th>TOPSIS ქულა</th>
              </tr>
            </thead>
            <tbody>
              {problem.topsisResults.map((result, index) => (
                <tr key={result.id}>
                  <td>{index + 1}</td>
                  <td>{result.name}</td>
                  <td>{result.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={onBackToStart} className="next-btn reset-btn">ახალი პრობლემის დამატება</button>
        </div>
      ) : (
        <p>შედეგები არ არის ხელმისაწვდომი. გთხოვთ, შეავსოთ ყველა ეტაპი.</p>
      )}
    </div>
  );
};

export default ResultsModule;