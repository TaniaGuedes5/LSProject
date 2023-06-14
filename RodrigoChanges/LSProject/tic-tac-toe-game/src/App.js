import React, { useState, useEffect } from "react";
import "./App.css";
import { BigBoard } from "./componentes/GameBoard/BigBoard";
import { PlayerForm } from "./componentes/Players/PlayersForm";

const MAX_TIME = 5000;

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
  const [playingAgainstComputer, setPlayingAgainstComputer] = useState(false);
  const [gameModeSelected, setGameModeSelected] = useState(false);

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

      if (playingAgainstComputer) {
        setPlayer1({ name: playerName, symbol: "X" });
        setPlayer2({ name: "Computer", symbol: "O" });
        setNumPlayersRegistered(2);
        setRegistrationComplete(true);
        setCurrentPlayer("X");
        setPlayer1Timer(MAX_TIME);
        setPlayer2Timer(MAX_TIME);
        setSelectedTimer("player1");
        return; // Early return because registration is complete
      }

    } else if (numPlayersRegistered === 1 && !playingAgainstComputer) {
      const secondPlayerSymbol = player1.symbol === "X" ? "O" : "X";
      setPlayer2({ name: playerName, symbol: secondPlayerSymbol });
      setNumPlayersRegistered(2);
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

    const isTargetBoardLocked = selectedMiniBoard !== null && lockedBoards[selectedMiniBoard];

    if (!isTargetBoardLocked && selectedMiniBoard !== null && selectedMiniBoard !== boardIndex) {
      return;
    }

    if (lockedBoards[boardIndex]) {
      return;
    }

    makeMove(boardIndex, cellIndex, currentPlayer);
    setCurrentPlayer(
        currentPlayer === player1.symbol ? player2.symbol : player1.symbol
    );
    setSelectedTimer(
        currentPlayer === player1.symbol ? "player2" : "player1"
    );
  };

  const makeMove = (boardIndex, cellIndex, playerSymbol) => {
    if (!isGameActive) {
      return;
    }

    const updatedBoards = [...bigBoard];
    if (updatedBoards[boardIndex][cellIndex] !== null) {
      return;
    }
    updatedBoards[boardIndex] = [...updatedBoards[boardIndex]];
    updatedBoards[boardIndex][cellIndex] = playerSymbol;

    setBigBoard(updatedBoards);

    const winner = checkWinner(updatedBoards[boardIndex]);
    const isDraw = updatedBoards[boardIndex].every(cell => cell !== null);

    if (winner || isDraw) {
      const updatedLockedBoards = [...lockedBoards];
      updatedLockedBoards[boardIndex] = true;
      setLockedBoards(updatedLockedBoards);

      if (winner) {
        updatedLockedBoards[selectedMiniBoard] = true;
        setLockedBoards(updatedLockedBoards);
      }

      const updatedSmallBoardWinners = [...smallBoardWinners];
      updatedSmallBoardWinners[boardIndex] = winner ? winner : (isDraw ? 'D' : null);
      setSmallBoardWinners(updatedSmallBoardWinners);
    }
    setSelectedMiniBoard(cellIndex);
  };

  const handleComputerMove = () => {
    let boardIndex = selectedMiniBoard;

    // Check if the selectedMiniBoard is locked or null
    if (selectedMiniBoard === null || lockedBoards[boardIndex]) {
      // Choose a random mini board that is not locked
      const unlockedBoards = lockedBoards.map((isLocked, index) => (isLocked ? null : index)).filter(index => index !== null);
      if (unlockedBoards.length === 0) {
        return; // All boards are locked
      }
      boardIndex = unlockedBoards[Math.floor(Math.random() * unlockedBoards.length)];
    }

    // Find available cells in the selectedMiniBoard
    const availableCells = bigBoard[boardIndex].map((cell, index) => (cell === null ? index : null)).filter(index => index !== null);

    if (availableCells.length === 0) {
      return;
    }

    const randomCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];

    makeMove(boardIndex, randomCellIndex, player2.symbol);

    setCurrentPlayer(player1.symbol);
    setSelectedTimer("player1");
  };



  useEffect(() => {
    if (playingAgainstComputer && currentPlayer === player2.symbol && isGameActive) {
      setTimeout(handleComputerMove, 1);
    }
  }, [currentPlayer]);


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
    setEndGameMessage(null); // Clear end game message
    setGameModeSelected(false); // Go back to game mode selection screen
  };


  return (
      <div className="App">
        {!gameModeSelected ? (
            <div className="buttons-container">
              <button className="start-button" onClick={() => { setPlayingAgainstComputer(false); setGameModeSelected(true); }}>
                Play Player vs Player
              </button>
              <button className="start-button" onClick={() => { setPlayingAgainstComputer(true); setGameModeSelected(true); }}>
                Play Against Computer
              </button>
            </div>
        ) : !registrationComplete ? (
            <div>
              <PlayerForm onSubmit={handlePlayerSubmit} playingAgainstComputer={playingAgainstComputer} numPlayersRegistered={numPlayersRegistered} />
            </div>
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
                {playingAgainstComputer ? null : (
                    <div className="timer">
                      {player2.name} Timer:{" "}
                      <span className="timeDisplay">{player2Timer}</span> seconds
                    </div>
                )}
                <button onClick={resetGame}>Start New Game</button>
              </div>
            </>
        )}
      </div>
  );

}
export default App;