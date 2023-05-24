import './App.css';

import React, { useState } from "react";

import { Board } from './componentes/Board';

function App() {
  
  const [board, setBoard] =  useState(Array(9).fill(null));
 
  const handleBoxClick = (idBox) => {
    //Passo 1: atualizar tabuleiro
    //Passo2: verificar se alguem ganhou o jogo
    //Passo3: mudar de jogador
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
