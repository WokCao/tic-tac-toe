import { useState } from 'react';

function Square({ value, onSquareClick, isWin }: { value: string, onSquareClick: any, isWin: boolean }) {
  return (
    <button className={`square ${isWin ? 'squareWin' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }: { xIsNext: boolean, squares: string[], onPlay: any }) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let length = null;
  let status;
  if (winner == "Draw") {
    status = "Draw";
  } else if (winner) {
    status = 'Winner: ' + winner[0];
    length = winner.length;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  //render Square with loops
  const allSquares = [];
  for (let i: number = 0; i < 3; i++) {
    const line = [];
    for (let j: number = 0; j < 3; j++) {
      const index = i * 3 + j;

      // check winner and change color
      if (winner && length) {
        let flag: boolean = false;
        for (let k: number = 1; k < length; k++) {
          if (index === winner[k]) {
            flag = true;
            break;
          }
        }
        line.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)} isWin={flag} />)
      } else {
        line.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)} isWin={false} />)
      }
    }
    allSquares.push(<div key={i} className="board-row">{line[0]}{line[1]}{line[2]}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div>{allSquares}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([[Array(9).fill(null)]]); // [[9 elems]]
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove][0];
  const [sortAsc, setSortAsc] = useState(true);

  function handlePlay(nextSquares: string[], index: number) {
    // calculate the row & col bases on index + concatenate nextSquares and move
    const move = [Math.ceil((index + 1) / 3), index % 3 + 1]
    const location = [ nextSquares, move ];
    const nextHistory = [...history.slice(0, currentMove + 1), location];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
    // slice the rest from next move
    const newHistory = history.slice(0, nextMove + 1);
    setHistory(newHistory);
  }

  function updateSort() {
    setSortAsc(!sortAsc);
  }

  const moves = history.map((squares, move) => {
    let description;
    let extraInfo = null;
    if (move > 0) {
      description = 'Go to move #' + move;
      extraInfo = '(Row: ' + squares[1][0] + ' - Col: ' + squares[1][1] + ')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move} className='item'>
        {move === 0 ? <button onClick={() => jumpTo(move)}>{description}</button> : move !== currentMove ? <button onClick={() => jumpTo(move)}>{description} {extraInfo}</button> : <p className='text'>You're at move #{move} {extraInfo}</p>}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={updateSort} className='sortBtn'>{sortAsc ? "Sort Descending" : "Sort Ascending"}</button>
        <ol>{sortAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares: string[]) {
  let flag: boolean = false;
  let containNull: boolean = false;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] || squares[b] || squares[c]) flag = true;
    if (!squares[a] || !squares[b] || !squares[c]) containNull = true;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }

  // check Draw
  if (flag && !containNull) return "Draw";

  return null;

}
