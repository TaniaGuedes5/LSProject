import React from "react";

import "./BigBoard.css";
import { Board } from "./Board";

export const BigBoard = ({ boards, lockedBoards, smallBoardWinners, onCellClick }) => {
    return (
        <div className="big-board">
            {boards.map((board, boardIndex) => (
                <div key={boardIndex} className="mini-board">
                    <Board
                        board={board}
                        isLocked={lockedBoards[boardIndex]}
                        onClick={(cellIndex) => onCellClick(boardIndex, cellIndex)}
                    />
                    {lockedBoards[boardIndex] && (
                        <div className="lock-overlay">
                            {smallBoardWinners[boardIndex] === 'X' ? (
                                <div className="cross"></div>
                            ) : smallBoardWinners[boardIndex] === 'O' ? (
                                <div className="circle"></div>
                            ) : smallBoardWinners[boardIndex] === 'D' ? (
                                <div className="draw-dash"></div>
                            ) : null}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};