document.addEventListener("DOMContentLoaded", function() {
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-game');
    const timeDisplay = document.getElementById('time');
    const stepsDisplay = document.getElementById('steps');
    const targetStepsDisplay = document.getElementById('target-steps');
  
    let boardState = [];
    let targetSteps = null;
    let startTime = null;
    let timerInterval = null;
    let steps = 0;
  
    function createGameBoard(matrix) {
        for (let i = 0; i < 5; i++) {
            boardState[i] = [];
            for (let j = 0; j < 5; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.col = j;
                square.addEventListener('click', toggleSquare);
                gameBoard.appendChild(square);
                boardState[i][j] = matrix[i][j] === 1;
            }
        }
    }
  
    function toggleSquare(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        steps++;
        stepsDisplay.textContent = steps;
  
        toggle(row, col);
        toggle(row - 1, col);
        toggle(row + 1, col);
        toggle(row, col - 1);
        toggle(row, col + 1);
  
        if (checkWin()) {
            clearInterval(timerInterval);
            alert('You win!');
        }
    }
  
    function toggle(row, col) {
        if (row >= 0 && row < 5 && col >= 0 && col < 5) {
            const square = document.querySelector(`.square[data-row='${row}'][data-col='${col}']`);
            square.classList.toggle('on');
            boardState[row][col] = !boardState[row][col];
        }
    }
  
    function checkWin() {
        return boardState.every(row => row.every(square => !square));
    }
  
    function startGame() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    const randomIndex = Math.floor(Math.random() * data.length);
                    const selectedMatrix = data[randomIndex];
                    boardState = selectedMatrix.matrix;
                    targetSteps = selectedMatrix.min_steps;
                    targetStepsDisplay.textContent = targetSteps;
                    startTime = new Date().getTime();
                    timerInterval = setInterval(updateTime, 1000);
                    steps = 0;
                    stepsDisplay.textContent = steps;
                    renderBoard();
                } else {
                    console.error('Error:', xhr.status);
                }
            }
        };
        xhr.open('GET', 'initial_board.json', true);
        xhr.send();
    }
  
    function renderBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const square = document.createElement('div');
                square.classList.add('square', boardState[i][j] ? 'on' : 'off');
                square.dataset.row = i;
                square.dataset.col = j;
                square.addEventListener('click', toggleSquare);
                gameBoard.appendChild(square);
            }
        }
    }
  
    function updateTime() {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        timeDisplay.textContent = elapsedTime;
    }
  
    startButton.addEventListener('click', startGame);
  });
