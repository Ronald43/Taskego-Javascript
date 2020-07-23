
// A utility class used mostly by other classes to modify and access the state of the app 
class AppState
{

  // Get the board that is currently being viewed/edited
  static GetCurrentBoard()
  {
    var id = parseInt(localStorage.getItem("currentBoard"))
    return this.boards[id]
  }

  // Set the board that is being viewed/edited
  static SetCurrentBoardId(value)
  {
    localStorage.setItem("currentBoard", value)
  }

  // Return the total number of saved boards the user owns
  static GetBoardsCount()
  {
    // load the list of boards from locaStarage
    var savedBoards = JSON.parse(localStorage.getItem("Boards"));
    
    if(savedBoards == null){
      return 0;
    }

    return savedBoards.length;
  }

  // An array of all the boards the user owns 
  // NOTE: initialize the array with a "null" board so code completion works (I can't work without)
  static boards = [new Board(-1,"null",[])];

  // Get the array of all the boards the user owns
  static GetBoards()
  {
    // if the array is "empty"
    if(this.boards[0].id == -1)
    {
      this.Load() //Load them from locaStorage
    }
    
    return this.boards;
  }

  // Delete a board by its id
  static DeleteBoard(id)
  {

    // Delete the board on the boards list by
    // filtering for all the boards that don't have that id
    // and assigning the resulting list as the apps board list
    this.boards = this.boards.filter(b => b.id != id)
    
    // Reassign the id's of every board that was affected by the deletions
    // TODO: Could this be optimized somehow?
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