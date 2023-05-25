import './App.css';

import React, { useState } from "react";

import { BigBoard } from './componentes/GameBoard/BigBoard';


function App() {

  const [bigBoard, setBigBoard] = useState(Array(9).fill(Array(9).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState("X");
 
  const handleCellClick = (boardIndex, cellIndex) => {
    //Passo 1: atualizar tabuleiro
    //Fazer uma cópia do estado-> para modifica
    const updatedBoards = [...bigBoard];
   
    //Atualizar a célula selecionada com a marca do jogador atual; Verificar se a célula selecionada já está ocupada
    if (updatedBoards[boardIndex][cellIndex] !== null) {
      return;
    }
    //Atualizar a célula selecionada com a marca do jogador atual
    updatedBoards[boardIndex][cellIndex] = currentPlayer;

    //Atualizar o estado das placas principais e mudar para o próximo jogador
    setBigBoard(updatedBoards);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

  }


  return (

    <div className="App">
      <div className="outerBox">
        <div className="title0">
            <span className="t1">Ultimate</span><span className="t2"> Tic</span><span className="t1"> Tac</span><span className="t2"> Toe</span>   
        </div>
        <BigBoard boards={bigBoard} onCellClick={handleCellClick} />
        <div className="current-player">
          Current Player: <span className="symbol">{currentPlayer}</span>
        </div>

      </div> 
    </div>
  );
}

export default App;
