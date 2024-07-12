import { useState } from 'react'

function Square({ value, onSquareClick }) {
  return (<button className="square" onClick={onSquareClick}>
   {value}
  </button>);
}

function Board({ xIsNext, squares, onPlay }) {
  let winner = calculateWinner(squares);
  let status;
  if (winner){
    status = "Winner: " + winner;
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i){
    if (squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  let rows = [];
  for(let i = 0; i < 3; i++){
    let spaces = [];
    for (let j = 0; j < 3; j++){
      const index = (i*3)+j;
      spaces.push(< Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />);
    }
    
    rows.push(<div key={i} className="board-row">{spaces}</div>);
  }

  return (
    <>
      <div className="status">
        {status}
      </div>

      {rows}
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

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [moves, setMoves] = useState(determineMoves(history, currentMove));
  const [sortOrder, setSortOrder] = useState(true);
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function determineMoves(nextHistory, nextCurrentMove){
    return nextHistory.map((squares, move) => {
      let description;
      if (move > 0) {
        description = 'Go to move #' + move;
      } else {
        description = 'Go to game start';
      }
        if (move == nextCurrentMove){
          return (<li key={move}>You are at move #{move}</li>);
        }
        else {
        return (<li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
          </li>)
        }
    });
  }

  function sortMoves(fromClick, nextMoves){
    let newSortOrder = fromClick ? !sortOrder : sortOrder;
    setSortOrder(newSortOrder);

    let sortedMoves = newSortOrder ? nextMoves.sort((a, b) => a.key - b.key) : nextMoves.sort((a, b) => b.key - a.key);
    setMoves(sortedMoves);
  }

  function handlePlay(nextSquares){
    let nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);

    let nextCurrentMove = nextHistory.length - 1;
    setCurrentMove(nextCurrentMove);
    let nextMoves = determineMoves(nextHistory, nextCurrentMove);
    sortMoves(false, nextMoves);
  }

  return (
    <div className="game">
      <div className="game-board">
        < Board xIsNext={currentMove % 2 == 0} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol><button onClick={() => sortMoves(true, moves)}>{sortOrder ? "sort desc" : "sort asc"}</button></ol>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}