let gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];
    let size = 9;
    let moveCount = 0;
    let hasWinner = false;
    let isOver = false;
    let result = "";
    let players = [];
    
    let placeMarker = function (e) {
        if (isOver) {
            return;
        }
        let position = e.target.dataset.id;
        // board position already filled
        if (board[position]) {
            return 
        }
        let marker = moveCount % 2 == 0 ? 'x' : 'o';
        moveCount++;
        setBoardSlot(position, marker);
        displayController.render();
        if(moveCount >= 9) {
            isOver = true;
        }
        checkForWinner();
        checkForDraw();
        if(isOver) {
            displayController.showResult(result);
            displayController.togglePlayerNames();
        }
    }
    
    let getBoardSlot = function(position) {
        if(position >= 9) return
        return board[position];
    }

    let setBoardSlot = function(position, marker) {
        board[position] = marker;
    }

    let checkForWinner = function() {
        // check lines
        sameMark(getBoardSlot(0), getBoardSlot(1), getBoardSlot(2))
        sameMark(getBoardSlot(3), getBoardSlot(4), getBoardSlot(5))
        sameMark(getBoardSlot(6), getBoardSlot(7), getBoardSlot(8))

        // check rows
        sameMark(getBoardSlot(0), getBoardSlot(3), getBoardSlot(6))
        sameMark(getBoardSlot(1), getBoardSlot(4), getBoardSlot(7))
        sameMark(getBoardSlot(2), getBoardSlot(5), getBoardSlot(8))

        // check diagonals
        sameMark(getBoardSlot(0), getBoardSlot(4), getBoardSlot(8))
        sameMark(getBoardSlot(2), getBoardSlot(4), getBoardSlot(6))
    }

    let checkForDraw = function() {
        if(isOver && !hasWinner) {
            result = 'Game over! It\'s a Draw';
        }

    }

    let setWinner = function(winningMarker) {
        hasWinner = true;
        isOver = true;
        let winnerName = players[winningMarker == 'x' ? 0 : 1].getName();
        result = (`Game over! ${winnerName} won.`)
    }

    let sameMark = function (one, two, three) {
        if (one && two && three) {
            if (one == two && two == three) {
                setWinner(one);
                return true;
            }
        }
    }

    let startGame = function () {
        let p1 = playerFactory(displayController.getPlayerName(1), 'x')
        let p2 = playerFactory(displayController.getPlayerName(2), 'o')
        players.push(p1, p2);
        displayController.startGame();
    }

    let restartGame = function() {
        board = ["", "", "", "", "", "", "", "", ""]
        moveCount = 0;
        hasWinner = false;
        isOver = false;
        result = "";
        players = [];
        displayController.showResult(result);
        startGame();
    }

    return {
        placeMarker, getBoardSlot, startGame, restartGame, size
    };
})();

let displayController = (function(doc) {
    let render = function() {
        let field = doc.querySelector("#boardGUI");
        field.innerHTML="";
        for (let i = 0; i < gameboard.size; i++) {
            let position = doc.createElement("div");
            position.classList.add('spot');
            position.dataset.id = i;
            let mark = gameboard.getBoardSlot(i);
            position.textContent = mark;
            position.addEventListener("click", gameboard.placeMarker)
            field.appendChild(position);
        }
    };

    let showResult = function(result) {
        let resultWindow = doc.querySelector("#result")
        resultWindow.textContent = result;
    }

    let getPlayerName = function(playerNumber) {
        let playerName = doc.querySelector(`#p${playerNumber}`).value;
        return playerName;
    }

    let startGame = function() {
        render();
        togglePlayerNames();
    }

    let togglePlayerNames = function() {
        let p1 = doc.querySelector("#p1");
        let p2 = doc.querySelector("#p2");
        p1.disabled = !p1.disabled;
        p2.disabled = !p2.disabled;
    }

    return {
        render, 
        showResult,
        getPlayerName,
        startGame,
        togglePlayerNames,
    };
})(document);

const playerFactory = (name, marker) => {
    const getName = () => {
        return name;
    };
    const getMarker = () => {
        return marker;
    };
    return {getName, getMarker}
}