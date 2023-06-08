import React, { useState } from 'react';

import './PlayersForm.css';

export const PlayerForm = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      return;
    }
    onSubmit(name);
    setName('');
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
    <h1> <span className="registerPlayer0">Player</span> <span className="registerPlayer1">Register</span></h1>
      <label className="playerName">
      <span className="playerName0">Player </span> <span className="playerName1">Name </span>   
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <span>   </span>
      <button type="submit"> Register</button>
    </form>
  );
};


