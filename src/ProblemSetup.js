import React, { useState } from 'react';

const ProblemSetup = ({ onComplete }) => {
  const [problemTitle, setProblemTitle] = useState('');
  const [criteria, setCriteria] = useState(['']);
  const [alternatives, setAlternatives] = useState(['']);

  const handleInputChange = (list, setList, index, value) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const handleAddInput = (list, setList) => {
    setList([...list, '']);
  };

  const handleRemoveInput = (list, setList, index) => {
    if (list.length > 1) {
      const newList = list.filter((_, i) => i !== index);
      setList(newList);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problemTitle.trim()) {
      alert('გთხოვთ, შეიყვანოთ პრობლემის სახელი.');
      return;
    }
    const filteredCriteria = criteria.filter(c => c.trim() !== '');
    const filteredAlternatives = alternatives.filter(a => a.trim() !== '');

    if (filteredCriteria.length < 2 || filteredAlternatives.length < 2) {
      alert('გთხოვთ, დაამატოთ მინიმუმ 2 კრიტერიუმი და 2 ალტერნატივა.');
      return;
    }

    const criteriaObjects = filteredCriteria.map((name, index) => ({ id: `c${index}`, name }));
    const alternativesObjects = filteredAlternatives.map((name, index) => ({ id: `a${index}`, name }));
    
    onComplete({
      title: problemTitle,
      criteria: criteriaObjects,
      alternatives: alternativesObjects,
    });
  };

  return (
    <div className="module-container setup-module">
      <h2>1. პრობლემის განსაზღვრა</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>გადაწყვეტილების მიღების პრობლემის სახელი:</label>
          <input
            type="text"
            value={problemTitle}
            onChange={(e) => setProblemTitle(e.target.value)}
            placeholder="მაგ: ციფრული ტრანსფორმაციის პროექტების არჩევა"
            required
          />
        </div>

        <div className="list-setup-container">
          <div className="list-setup">
            <h3>კრიტერიუმები</h3>
            {criteria.map((c, index) => (
              <div key={index} className="list-item">
                <input
                  type="text"
                  value={c}
                  onChange={(e) => handleInputChange(criteria, setCriteria, index, e.target.value)}
                  placeholder="მაგ: ფინანსური ეფექტურობა"
                />
                <button type="button" onClick={() => handleRemoveInput(criteria, setCriteria, index)}>-</button>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={() => handleAddInput(criteria, setCriteria)}>+ დამატება</button>
          </div>

          <div className="list-setup">
            <h3>ალტერნატივები (პროექტები)</h3>
            {alternatives.map((a, index) => (
              <div key={index} className="list-item">
                <input
                  type="text"
                  value={a}
                  onChange={(e) => handleInputChange(alternatives, setAlternatives, index, e.target.value)}
                  placeholder="მაგ: CRM სისტემის დანერგვა"
                />
                <button type="button" onClick={() => handleRemoveInput(alternatives, setAlternatives, index)}>-</button>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={() => handleAddInput(alternatives, setAlternatives)}>+ დამატება</button>
          </div>
        </div>

        <button type="submit" className="next-btn">გაგრძელება</button>
      </form>
    </div>
  );
};

export default ProblemSetup;