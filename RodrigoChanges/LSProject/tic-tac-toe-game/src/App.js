import React, { useState, useEffect } from "react";
import "./App.css";
import { BigBoard } from "./componentes/GameBoard/BigBoard";
import { PlayerForm } from "./componentes/Players/PlayersForm";

const MAX_TIME = 500;

function App() {
  const [isGameActive, setIsGameActive] = useState(true);
  const [player1, setPlayer1] = useState({ name: "", symbol: "" });
  const [player2, setPlayer2] = useState({ name: "", symbol: "" });
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [numPlayersRegistered, setNumPlayersRegistered] = useState(0);
  const [bigBoard, setBigBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [selectedMiniBoard, setSelectedMiniBoard] = useState(null);
  const [player1Timer, setPlayer1Timer] = useState(null);
  const [player2Timer, setPlayer2Timer] = useState(null);
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [lockedBoards, setLockedBoards] = useState(Array(9).fill(false));
  const [smallBoardWinners, setSmallBoardWinners] = useState(Array(9).fill(null));
  const [endGameMessage, setEndGameMessage] = useState(null);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function checkWinner(board) {
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];

      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  const handlePlayerSubmit = (playerName) => {
    if (numPlayersRegistered === 0) {
      const firstPlayerSymbol = Math.random() < 0.5 ? "X" : "O";
      setPlayer1({ name: playerName, symbol: firstPlayerSymbol });
      setNumPlayersRegistered(1);
    } else if (numPlayersRegistered === 1) {
      const secondPlayerSymbol = player1.symbol === "X" ? "O" : "X";
      setPlayer2({ name: playerName, symbol: secondPlayerSymbol });
      setNumPlayersRegistered(2);
    }

    if (numPlayersRegistered === 1) {
      setRegistrationComplete(true);
      setCurrentPlayer(player1.symbol);
      setPlayer1Timer(MAX_TIME);
      setPlayer2Timer(MAX_TIME);
      setSelectedTimer("player1");
    }
  };

  const handleCellClick = (boardIndex, cellIndex) => {
    if (!isGameActive) {
      return;
    }

    // Check if the selectedMiniBoard is locked
    const isTargetBoardLocked = selectedMiniBoard !== null && lockedBoards[selectedMiniBoard];

    if (!isTargetBoardLocked && selectedMiniBoard !== null && selectedMiniBoard !== boardIndex) {
      return;
    }

    if (lockedBoards[boardIndex]) {
      return; // Board is locked, do not allow cell click
    }

    const updatedBoards = [...bigBoard];
    if (updatedBoards[boardIndex][cellIndex] !== null) {
      return;
    }
    updatedBoards[boardIndex] = [...updatedBoards[boardIndex]];
    updatedBoards[boardIndex][cellIndex] = currentPlayer;

    setBigBoard(updatedBoards);

    // Check for winner in small board
    const winner = checkWinner(updatedBoards[boardIndex]);
    const isDraw = updatedBoards[boardIndex].every(cell => cell !== null);

    // Update locked boards and small board winners if necessary
    if (winner || isDraw) {
      const updatedLockedBoards = [...lockedBoards];
      updatedLockedBoards[boardIndex] = true; // Lock the small board
      setLockedBoards(updatedLockedBoards);

      // Lock the winning board if a small board has a winner
      if (winner) {
        updatedLockedBoards[selectedMiniBoard] = true;
        setLockedBoards(updatedLockedBoards);
      }

      // Update the winner of the small board or set to 'D' if it's a draw
      const updatedSmallBoardWinners = [...smallBoardWinners];
      updatedSmallBoardWinners[boardIndex] = winner ? winner : (isDraw ? 'D' : null);
      setSmallBoardWinners(updatedSmallBoardWinners);
    }

    setCurrentPlayer(
        currentPlayer === player1.symbol ? player2.symbol : player1.symbol
    );
    setSelectedTimer(
        currentPlayer === player1.symbol ? "player2" : "player1"
    );
    setSelectedMiniBoard(cellIndex);
  };

  useEffect(() => {
    if (isGameActive) {
      const timerId = setInterval(() => {
        if (selectedTimer === "player1") {
          setPlayer1Timer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        } else {
          setPlayer2Timer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [selectedTimer, isGameActive]);

  useEffect(() => {
    if (registrationComplete && (player1Timer === 0 || player2Timer === 0)) {
      endGame();
    }
  }, [player1Timer, player2Timer, registrationComplete]);

  useEffect(() => {
    function checkBigBoardWinner() {
      for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];

        const winnerA = checkWinner(bigBoard[a]);
        const winnerB = checkWinner(bigBoard[b]);
        const winnerC = checkWinner(bigBoard[c]);

        if (winnerA && winnerA === winnerB && winnerA === winnerC) {
          return winnerA;
        }
      }
      return null;
    }
    const winnerSymbol = checkBigBoardWinner();
    if (winnerSymbol) {
      const winnerName = (winnerSymbol === player1.symbol) ? player1.name : player2.name;
      endGame(winnerName);
    } else {
      const allBoardsLocked = lockedBoards.every(isLocked => isLocked);
      if (allBoardsLocked) { // All boards have been won or drawn
        const xCount = smallBoardWinners.filter(winner => winner === "X").length;
        const oCount = smallBoardWinners.filter(winner => winner === "O").length;

        if (xCount > oCount) {
          endGame(player1.symbol === "X" ? player1.name : player2.name);
        } else if (oCount > xCount) {
          endGame(player1.symbol === "O" ? player1.name : player2.name);
        } else {
          alert("The game is a draw!");
          setIsGameActive(false);
        }
      }
    }
  }, [smallBoardWinners, lockedBoards, player1.name, player1.symbol, player2.name]);

  const endGame = (winnerName) => {
    setIsGameActive(false);
    if (winnerName) {
      setEndGameMessage(`${winnerName} wins the game!`);
    } else {
      setEndGameMessage('Game Over!');
    }
  };

  const resetGame = () => {
    setPlayer1({ name: "", symbol: "" });
    setPlayer2({ name: "", symbol: "" });
    setRegistrationComplete(false);
    setNumPlayersRegistered(0);
    setBigBoard(Array(9).fill(null).map(() => Array(9).fill(null)));
    setCurrentPlayer("X");
    setSelectedMiniBoard(null);
    setPlayer1Timer(MAX_TIME);
    setPlayer2Timer(MAX_TIME);
    setSelectedTimer(null);
    setLockedBoards(Array(9).fill(false));
    setIsGameActive(true);
  };

  return (
      <div className="App">
        {!registrationComplete ? (
            <PlayerForm onSubmit={handlePlayerSubmit} />
        ) : (
            <>
              <div className="outerBox">
                <div className="title0">
                  <span className="t1">Ultimate</span>
                  <span className="t2">Tic</span>
                  <span className="t1">Tac</span>
                  <span className="t2">Toe</span>
                </div>
                <div className="bigBoard-container">
                  <BigBoard
                      boards={bigBoard}
                      lockedBoards={lockedBoards}
                      smallBoardWinners={smallBoardWinners}
                      onCellClick={handleCellClick}
                  />
                  {endGameMessage && (
                      <div className="end-game-message">
                        {endGameMessage}
                      </div>
                  )}
                </div>
                <div className="current-player">
                  Current Player:{" "}
                  <span className="nameDisplay">
              {currentPlayer === player1.symbol ? player1.name : player2.name}:
            </span>{" "}
                  <span className="symbol">{currentPlayer}</span>
                </div>
                <div className="timer">
                  {player1.name} Timer:{" "}
                  <span className="timeDisplay">{player1Timer}</span> seconds
                </div>
                <div className="timer">
                  {player2.name} Timer:{" "}
                  <span className="timeDisplay">{player2Timer}</span> seconds
                </div>
                <button onClick={resetGame}>Start New Game</button>
              </div>
            </>
        )}
      </div>
  );

}

export default App;