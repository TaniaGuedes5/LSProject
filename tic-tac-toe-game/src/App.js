import './App.css';

import React, { useState } from "react";

import { BigBoard } from './componentes/GameBoard/BigBoard';
import { PlayerForm } from './componentes/Players/PlayersForm';

function App() {

  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [numPlayersRegistered, setNumPlayersRegistered] = useState(0);


  const [bigBoard, setBigBoard] = useState(Array(9).fill(Array(9).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [selectedMiniBoard, setSelectedMiniBoard] = useState(null);

  
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
    }
  };

  const handleCellClick = (boardIndex, cellIndex) => {
  
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
    //Atualizar o mini-tabuleiro selecionado com base no movimento anterior jogador
    setSelectedMiniBoard(cellIndex);
  }



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
        <div className="timer">
          Time:<span className="timeDisplay">{}</span> seconds
        </div>

      </div> 
      )}
        
      </div>
     

  );
}

export default App;
