import React, { useState } from 'react';
import './PlayersForm.css';

export const PlayerForm = ({ onSubmit, playingAgainstComputer, numPlayersRegistered }) => {
    const [playerName, setPlayerName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (playerName.trim() === '') {
            return;
        }
        onSubmit(playerName);
        setPlayerName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>
                <span className="registerPlayer0">Player</span>{" "}
                <span className="registerPlayer1">Register</span>
            </h1>
            <label className="playerName">
                <span className="playerName0">{numPlayersRegistered === 0 ? 'Player 1' : 'Player 2'} Name </span>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
            </label>
            <span>   </span>
            <button type="submit">Register</button>
        </form>
    );
};
