import './App.css';

import React, { useState } from "react";

import { Board } from './componentes/Board';

function App() {
  
  const [board, setBoard] =  useState(Array(9).fill(null));
  const [player, setPlayer] = useState(true);

  const handleBoxClick = (idBox) => {
    //Passo 1: atualizar tabuleiro
    const updatedBoard = board.map((value, id) => {
      if (id === idBox) {
        return player ? "X" : "O";
      } else {
        return value;
      }
    })
    setBoard(updatedBoard);

    //Passo2: verificar se alguem ganhou o jogo
    const winner = checkWinner(updatedBoard);
 
    //Passo3: mudar de jogador
    setPlayer(!player);
  }
  return (

    <div className="App">
      <div className='board'>
        <Board board={board} onClick={null}/>
      </div>
    </div>
  );
}

export default App;
