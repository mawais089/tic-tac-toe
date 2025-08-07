const GameBoard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const makeMove = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        } else {
            return false;
        }
    };

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, makeMove, reset };
})();

const Player = (playerName, playerMarker) => {
    return { playerName, playerMarker };
};

const GameController = (playerone, playertwo) => {
    const player1 = Player(playerone, "X");
    const player2 = Player(playertwo, "O");
    let gameOver = false;
    let currentPlayer = player1;

    const winningDialog = document.querySelector('.winning-dialog');
    const winningDiv = document.querySelector('.winning-div');
    const winningText = document.createElement('p');
    winningText.classList.add('winning-text');
    winningDiv.appendChild(winningText);

    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const playRound = (index) => {
        if (gameOver) {
            winningText.textContent = "Game is over! Please restart.";
            winningDialog.showModal();
            return;
        }

        const success = GameBoard.makeMove(index, currentPlayer.playerMarker);

        if (!success) return;

        if (checkWinner(currentPlayer.playerMarker)) {
            winningText.textContent = `${currentPlayer.playerName} wins! Marker: ${currentPlayer.playerMarker}`;
            winningDialog.showModal();
            gameOver = true;
            return;
        } else if (checkTie()) {
            winningText.textContent = "It's a draw! Restart to play again.";
            winningDialog.showModal();
            gameOver = true;
            return;
        }

        switchPlayer();
    };

    const checkWinner = (marker) => {
        const board = GameBoard.getBoard();
        return winningCombos.some(combo =>
            combo.every(index => board[index] === marker)
        );
    };

    const checkTie = () => {
        const board = GameBoard.getBoard();
        return board.every(cell => cell !== "");
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getCurrentPlayer = () => currentPlayer;
    const getGameOver = () => gameOver;

    const restart = () => {
        GameBoard.reset();
        currentPlayer = player1;
        gameOver = false;
    };

    return { getCurrentPlayer, playRound, restart, getGameOver };
};

const DisplayController = (function () {
    const restartButton = document.querySelector('.restart');
    const cells = document.querySelectorAll('.cell');
    const startButton = document.querySelector('.startButton');
    const dialogExit = document.querySelector('.dialog-exit');
    let game;

    const fillForm = () => {
        startButton.addEventListener('click', (event) => {
            event.preventDefault();

            const firstPlayerName = document.querySelector('.firstPlayerBox').value.trim();
            const secondPlayerName = document.querySelector('.secondPlayerBox').value.trim();

            if (!firstPlayerName || !secondPlayerName) {
                alert("Please enter both player names.");
                return;
            }

            const restartButton = document.querySelector('.restart');
            const gameContainer = document.querySelector('.game-container');
            const formContainer = document.querySelector('.form-container');

            formContainer.style.display = 'none'
            restartButton.style.display = 'block';
            gameContainer.style.display = 'grid';

            game = GameController(firstPlayerName, secondPlayerName);
            renderMarkers();
            restartGame();
        });
    };

    const renderMarkers = () => {
        cells.forEach(cell => {
            cell.textContent = "";
            cell.addEventListener('click', (event) => {
                const target = Number(event.target.getAttribute('data-value'));
                if (cell.textContent === "" && !game.getGameOver()) {
                    const currentPlayer = game.getCurrentPlayer();
                    cell.textContent = currentPlayer.playerMarker;
                    game.playRound(target);
                }
            });
        });
    };

    const restartGame = () => {
        restartButton.addEventListener('click', () => {
            cells.forEach(cell => cell.textContent = "");
            if (game) game.restart();
        });
    };

    const setupDialogExit = () => {
        dialogExit.addEventListener('click', () => {
            const winningDialog = document.querySelector('.winning-dialog');
            winningDialog.close();
        });
    };

    setupDialogExit();
    fillForm();

    return {};
})();
