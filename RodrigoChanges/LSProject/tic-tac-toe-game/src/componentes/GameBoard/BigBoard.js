import React from "react";

import "./BigBoard.css"
import { Board } from "./Board"

export const BigBoard = ({ boards, onCellClick }) => {
    return (
      <div className="big-board">
        {boards.map((board, boardIndex) => (
          <div key={boardIndex} className="mini-board">
            <Board board={board} onClick={(cellIndex) => onCellClick(boardIndex, cellIndex)} />
          </div>
        ))}
      </div>
    );
  };