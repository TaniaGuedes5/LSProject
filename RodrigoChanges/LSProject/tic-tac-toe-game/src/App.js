import './App.css';

import React, { useState, useEffect } from "react";

import { BigBoard } from './componentes/GameBoard/BigBoard';
import { PlayerForm } from './componentes/Players/PlayersForm';

const MAX_TIME = 60;  // 60 segundos para cada jogador. Ajustar se necessário

function App() {

  const [isGameActive, setIsGameActive] = useState(true);

  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [numPlayersRegistered, setNumPlayersRegistered] = useState(0);


  const [bigBoard, setBigBoard] = useState(Array(9).fill(Array(9).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [selectedMiniBoard, setSelectedMiniBoard] = useState(null);

  const [player1Timer, setPlayer1Timer] = useState(null); // Timers para cada jogador
  const [player2Timer, setPlayer2Timer] = useState(null); // Timers para cada jogador
  const [selectedTimer, setSelectedTimer] = useState(null); // Timer para o jogador atual

  const handlePlayerSubmit = (playerName) => {
    if (numPlayersRegistered === 0) {
      const firstPlayerSymbol = Math.random() < 0.5 ? 'X' : 'O';
      setPlayer1({ name: playerName, symbol: firstPlayerSymbol });
      setNumPlayersRegistered(1);
    } else if (numPlayersRegistered === 1) {
      const secondPlayerSymbol = player1.symbol === 'X' ? 'O' : 'X';
      setPlayer2({ name: playerName, symbol: secondPlayerSymbol });
      setNumPlayersRegistered(2);
    }

    // Verificar se ambos estao registados
    if (numPlayersRegistered === 1) {
      setRegistrationComplete(true);
      setCurrentPlayer(player1.symbol);
      setPlayer1Timer(MAX_TIME); // Iniciar o timer para o jogador 1
      setPlayer2Timer(MAX_TIME); // Iniciar o timer para o jogador 2
      setSelectedTimer('player1');
    }
  };

  const handleCellClick = (boardIndex, cellIndex) => {

    if (!isGameActive) {
      return;
    }

     //Verificar se a selacao do mini board é valido
     if (selectedMiniBoard !== null && selectedMiniBoard !== boardIndex) {
      return;
    }
    //Atualizar tabuleiro
    const updatedBoards = [...bigBoard];
   
    //Atualizar a célula selecionada com a marca do jogador atual; Verificar se a célula selecionada já está ocupada
    if (updatedBoards[boardIndex][cellIndex] !== null) {
      return;
    }
    //Atualizar a célula selecionada com a marca do jogador atual
    updatedBoards[boardIndex] = [...updatedBoards[boardIndex]];
    updatedBoards[boardIndex][cellIndex] = currentPlayer;

    //Atualizar o estado das placas principais e mudar para o próximo jogador
    setBigBoard(updatedBoards);
    setCurrentPlayer(currentPlayer === player1.symbol ? player2.symbol : player1.symbol);
    setSelectedTimer(currentPlayer === player1.symbol ? 'player2' : 'player1');
    //Atualizar o mini-tabuleiro selecionado com base no movimento anterior jogador
    setSelectedMiniBoard(cellIndex);
  }

// Timer tick down useEffect
  useEffect(() => {
    if (isGameActive) {
      const timerId = setInterval(() => {
        if (selectedTimer === 'player1') {
          setPlayer1Timer((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
        } else {
          setPlayer2Timer((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
        }
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [selectedTimer, isGameActive]);

// Game over check useEffect
  useEffect(() => {
    if (player1Timer === 0) {
      endGame(player2.name);
    } else if (player2Timer === 0) {
      endGame(player1.name);
    }
  }, [player1Timer, player2Timer]);

  const endGame = () => {
    setIsGameActive(false); // Stop the game
    alert(`${currentPlayer === player1.symbol ? player2.name : player1.name} wins the game as ${currentPlayer === player1.symbol ? player1.name : player2.name}'s time is over.`);
  };

  const resetGame = () => {
    setPlayer1('');
    setPlayer2('');
    setRegistrationComplete(false);
    setNumPlayersRegistered(0);
    setBigBoard(Array(9).fill(Array(9).fill(null)));
    setCurrentPlayer("X");
    setSelectedMiniBoard(null);
    setPlayer1Timer(MAX_TIME);
    setPlayer2Timer(MAX_TIME);
    setSelectedTimer(null);
    setIsGameActive(true);  // Re-enable game play
  };




  return (
      <div className="App">
        {!registrationComplete ? (
            <PlayerForm onSubmit={handlePlayerSubmit} />
        ) : (
            <div className="outerBox">
              <div className="title0">
                <span className="t1">Ultimate</span><span className="t2"> Tic</span><span className="t1"> Tac</span><span className="t2"> Toe</span>
              </div>
              <BigBoard boards={bigBoard} onCellClick={handleCellClick} />

              <div className="current-player">
                Current Player:<span className="nameDisplay">{currentPlayer === player1.symbol ? player1.name : player2.name}:</span> <span className="symbol"></span><span className="symbol">{currentPlayer}</span>
              </div>

              {/* Timer displays */}
              <div className="timer">
                {player1.name} Timer:<span className="timeDisplay">{player1Timer}</span> seconds
              </div>
              <div className="timer">
                {player2.name} Timer:<span className="timeDisplay">{player2Timer}</span> seconds
              </div>

              {/* Reset game button */}
              <button onClick={resetGame}>Start New Game</button>
            </div>
        )}
      </div>
  );


}
export default App;
