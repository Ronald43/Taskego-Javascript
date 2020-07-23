class AppState
{

  static GetCurrentBoard()
  {
    var id = parseInt(localStorage.getItem("currentBoard"))
    return this.boards[id]
  }

  static SetCurrentBoardId(value)
  {
    localStorage.setItem("currentBoard", value)
  }

  static GetBoardsCount()
  {
    var savedBoards = JSON.parse(localStorage.getItem("Boards"));
    
    if(savedBoards == null){
      return 0;
    }

    return savedBoards.length;
  }

  static boards = [new Board(-1,"null",[])];

  static GetBoards()
  {
    if(this.boards[0].id == -1)
    {
      this.Load()
    }
    
    return this.boards;
  }

  static DeleteBoard(id)
  {
    // NOTE: Could this be optimized somehow?

    // Delete the board on the boards list by
    // filtering for all the boards that don't have that id
    // and assigning the resulting list as the apps board list
    this.boards = this.boards.filter(b => b.id != id)
    
    // Reassign the id's of every board that was affected by the deletions
    for (let i = id; i < this.boards.length; i++) {
      const b = this.boards[i];
      b.id = i
    }
    
    this.Save();

  }

  // Loads all saved boards data
  static Load()
  {
    // Empty the board array
    this.boards = []

    // than load the saved board data
    // NOTE: This is just a list of boards formatted as JSON strings
    var boardsJsonList = JSON.parse(localStorage.getItem("Boards"))
    
    for(var i = 0; i < this.GetBoardsCount(); i++)
    {
      // Board parse the board JSON string into a board object
      var board = Board.parse(boardsJsonList[i])
      // Add the created board object into the app's boards list
      this.boards.push(board)
    }

  }

  // Saves all boards data
  static Save()
  {
    localStorage.setItem("Boards",JSON.stringify(this.boards))
  }

}