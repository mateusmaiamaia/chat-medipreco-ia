import React from 'react';

function SuggestionChips({ topics, onChipClick }) {
  return (
    <div className="suggestion-chips-container">
      {topics.map((topic, index) => (
        <button 
          key={index} 
          className="suggestion-chip" 
          onClick={() => onChipClick(topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}

export default SuggestionChips;