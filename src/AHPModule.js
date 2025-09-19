import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';

const saatyScale = [
  { value: 9, label: '9 - აბსოლუტურად უფრო მნიშვნელოვანი' },
  { value: 7, label: '7 - ძალიან მნიშვნელოვანი' },
  { value: 5, label: '5 - მნიშვნელოვანი' },
  { value: 3, label: '3 - ოდნავ მნიშვნელოვანი' },
  { value: 1, label: '1 - თანაბრად მნიშვნელოვანი' },
  { value: 1/3, label: '1/3 - ოდნავ ნაკლებად მნიშვნელოვანი' },
  { value: 1/5, label: '1/5 - ნაკლებად მნიშვნელოვანი' },
  { value: 1/7, label: '1/7 - ძალიან ნაკლებად მნიშვნელოვანი' },
  { value: 1/9, label: '1/9 - აბსოლუტურად ნაკლებად მნიშვნელოვანი' },
];

const AHPModule = ({ problem, onComplete }) => {
  const [comparisonMatrix, setComparisonMatrix] = useState(() => {
    const matrix = {};
    problem.criteria.forEach(c1 => {
      problem.criteria.forEach(c2 => {
        matrix[`${c1.id}-${c2.id}`] = c1.id === c2.id ? 1 : 0;
      });
    });
    return matrix;
  });

  const [weights, setWeights] = useState({});
  const [isMatrixComplete, setIsMatrixComplete] = useState(false);

  useEffect(() => {
    const isComplete = Object.keys(comparisonMatrix).every(key => comparisonMatrix[key] !== 0);
    setIsMatrixComplete(isComplete);
    if (isComplete) {
      calculateWeights();
    }
  }, [comparisonMatrix]);

  const handleComparisonChange = (c1Id, c2Id, value) => {
    const parsedValue = parseFloat(value);
    setComparisonMatrix(prev => ({
      ...prev,
      [`${c1Id}-${c2Id}`]: parsedValue,
      [`${c2Id}-${c1Id}`]: 1 / parsedValue,
    }));
  };

  const calculateWeights = () => {
    const size = problem.criteria.length;
    let matrixData = [];
    for (let i = 0; i < size; i++) {
      matrixData[i] = [];
      for (let j = 0; j < size; j++) {
        matrixData[i][j] = comparisonMatrix[`${problem.criteria[i].id}-${problem.criteria[j].id}`];
      }
    }

    const matrix = math.matrix(matrixData);
    const normalizedMatrix = math.zeros(size, size);
    const colSums = math.sum(matrix, 0);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        normalizedMatrix.set([i, j], matrix.get([i, j]) / colSums.get([j]));
      }
    }

    const rowSums = math.sum(normalizedMatrix, 1);
    const calculatedWeights = {};
    let totalWeight = 0;
    for (let i = 0; i < size; i++) {
      const weight = rowSums.get([i]) / size;
      calculatedWeights[problem.criteria[i].id] = weight;
      totalWeight += weight;
    }
    
    const finalWeights = {};
    for (const id in calculatedWeights) {
      finalWeights[id] = calculatedWeights[id] / totalWeight;
    }

    setWeights(finalWeights);
  };

  return (
    <div className="module-step-container">
      <h3>2. კრიტერიუმების შეფასება (AHP)</h3>
      <p>შეადარეთ კრიტერიუმები წყვილ-წყვილად საატის 9-ქულიანი სკალის გამოყენებით.</p>
      
      <div className="ahp-table-container">
        <table className="ahp-table">
          <thead>
            <tr>
              <th>კრიტერიუმი</th>
              {problem.criteria.map(c => <th key={c.id}>{c.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {problem.criteria.map(c1 => (
              <tr key={c1.id}>
                <th>{c1.name}</th>
                {problem.criteria.map(c2 => (
                  <td key={c2.id}>
                    {c1.id === c2.id ? (
                      1
                    ) : (
                      <select
                        value={comparisonMatrix[`${c1.id}-${c2.id}`]}
                        onChange={(e) => handleComparisonChange(c1.id, c2.id, e.target.value)}
                      >
                        <option value="0">აირჩიე</option>
                        {saatyScale.map(s => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ahp-results">
        <h4>გამოთვლილი წონები:</h4>
        {Object.keys(weights).length > 0 ? (
          <ul>
            {problem.criteria.map(c => (
              <li key={c.id}>
                <strong>{c.name}:</strong> {(weights[c.id] * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        ) : (
          <p>გთხოვთ, შეავსოთ ყველა შედარება წონების გამოსათვლელად.</p>
        )}
      </div>

      <button onClick={() => onComplete(weights)} disabled={!isMatrixComplete || Object.keys(weights).length === 0} className="next-btn">
        გაგრძელება
      </button>
    </div>
  );
};

export default AHPModule;