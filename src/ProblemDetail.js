import React, { useState } from 'react';
import ProblemSetupModule from './ProblemSetupModule';
import AHPModule from './AHPModule';
import TOPSISModule from './TOPSISModule';
import ResultsModule from './ResultsModule';

const ProblemDetail = ({ problem, onUpdate, onBack }) => {
  const [step, setStep] = useState(0);
  const [problemData, setProblemData] = useState(problem);

  const handleSetupComplete = (setupData) => {
    const updatedProblem = { ...problemData, ...setupData };
    setProblemData(updatedProblem);
    onUpdate(updatedProblem);
    setStep(1);
  };

  const handleWeightsCalculated = (calculatedWeights) => {
    const updatedProblem = { ...problemData, weights: calculatedWeights };
    setProblemData(updatedProblem);
    onUpdate(updatedProblem);
    setStep(2);
  };

  const handleTopsisCalculated = (results) => {
    // ეს არის კოდის მთავარი შესწორება.
    // TOPSISModule-დან მიღებული `results` არის ობიექტი, რომელსაც აქვს ორი თვისება:
    // `decisionMatrix` და `topsisResults`.
    // ჩვენ უნდა განვაახლოთ `problemData` ორივე ამ თვისებით.
    const updatedProblem = {
      ...problemData,
      decisionMatrix: results.decisionMatrix,
      topsisResults: results.topsisResults,
    };
    
    setProblemData(updatedProblem);
    onUpdate(updatedProblem);
    setStep(3);
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return (
          <ProblemSetupModule
            problemData={problemData}
            onComplete={handleSetupComplete}
          />
        );
      case 1:
        return (
          <AHPModule
            problem={problemData}
            onComplete={handleWeightsCalculated}
          />
        );
      case 2:
        return (
          <TOPSISModule
            problem={problemData}
            onComplete={handleTopsisCalculated}
          />
        );
      case 3:
        return (
          <ResultsModule
            problem={problemData}
            onBackToStart={() => setStep(0)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="module-container detail-view-container">
      <div className="header-actions">
        <button onClick={onBack} className="back-btn">← უკან</button>
        <h2 className="problem-title-header">{problemData.title}</h2>
      </div>
      {renderCurrentStep()}
    </div>
  );
};

export default ProblemDetail;