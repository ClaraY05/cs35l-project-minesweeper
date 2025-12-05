import React from 'react';
import './minesweeper-board.css';

interface GameStatusProps {
    status: GameTypes.GameState;
    seconds: string;
}

const GameStatus: React.FC<GameStatusProps> = ({ status, seconds }) => {
    return (
        <div className="game-status-bar h-full">
            <span className="game-status-text"> 
                Status: {status} &nbsp;&nbsp; Time: {seconds}s
            </span>
        </div>
    );
};

export default GameStatus;

