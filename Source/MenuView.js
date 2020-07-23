
var createButton = document.getElementById("create-board-btn")
var nameField = document.getElementById("board-name-field")
var content = document.getElementById("content")

createButton.onclick = () => {
  var id = AppState.GetBoardsCount();
  var name = nameField.value
  var newBoard = new Board(id, name, [])

  newBoard.Save()
  Reload()
  
}

Draw()

// #region Functions
function Reload() {
  content.innerHTML = ""
  Draw();
}

// Draws a list of boards
function Draw() {
  
  // Get all boards saved in the app
  var boards = AppState.GetBoards();
  

  // Foreach board found
  boards.forEach(board => {
    var container =document.createElement("div")
    container.className = "menu-item"

    var boardElement = document.createElement("div");
    boardElement.id = "Board_" + board.id;
    boardElement.innerText = board.name;

    var boardCloseBtn = document.createElement("span")
    boardCloseBtn.innerText =  "X"
    boardCloseBtn.className = "close"
    
    container.appendChild(boardElement)
    container.appendChild(boardCloseBtn)

    content.appendChild(container)
    
    // When the board is clicked on
    boardElement.onclick = () => {
      // Set it to be the current board the app is using
      AppState.SetCurrentBoardId(board.id)
      // Go to the board viewing/editing page
      window.location.assign("board.html")
    }

    // When close button is clicked
    boardCloseBtn.onclick = () =>
    {
      OnDeleteClicked(board.id)
    }

  });

}

function OnDeleteClicked(id)
{
  AppState.DeleteBoard(id)
  Reload()
}

// #endregion