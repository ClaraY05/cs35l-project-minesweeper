import { useState } from 'react';

function Square({ value, onSquareClick }) {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function countPieces(squares, mark) {
    let count = 0;
    for(let i = 0; i < squares.length; i++) {
        if(squares[i] == mark) {
            count++;
        }
    }
    return count;
}

function indexRowColumn(i) {
    return {
        r: Math.floor(i / 3),
        c: i % 3
    };
}

function isAdjacent(a, b) {
    const A = indexRowColumn(a);
    const B = indexRowColumn(b);
    return (a != b) && (Math.abs(A.r - B.r) <= 1 && Math.abs(A.c - B.c) <= 1);
}

export default function Board() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [selectedIndex, setSelectedIndex] = useState(null);

    const currentMark = xIsNext ? 'X' : 'O';
    const currentCount = countPieces(squares, currentMark);
    const isPlacementPhase = currentCount < 3;
    const applyCenterRule = currentCount === 3 && squares[4] === currentMark;
    
    function handleClick(i) {
        if (calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (isPlacementPhase) {
            if (squares[i] != null) {
                return;
            }
            nextSquares[i] = currentMark;
            setSquares(nextSquares);
            setXIsNext(!xIsNext);
            setSelectedIndex(null);
            return;
        } else {
            if (selectedIndex == null) {
                if(squares[i] !== currentMark) {
                    return;
                }
                setSelectedIndex(i);
                return;
            }
            const from = selectedIndex;
            const to = i;

            if (to === from) {
                setSelectedIndex(null);
                return;
            }

            if (squares[to] != null || !isAdjacent(from, to)) {
                setSelectedIndex(null);
                return;
            }

            nextSquares[from] = null;
            nextSquares[to] = currentMark;

            if (applyCenterRule && calculateWinner(nextSquares) !== currentMark && nextSquares[4] === currentMark) {
                setSelectedIndex(null);
                return;
            }

            setSquares(nextSquares);
            setXIsNext(!xIsNext);
            setSelectedIndex(null);
        }
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}