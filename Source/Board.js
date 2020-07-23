class Board extends Drawable {

  // Default values used so types can be known
  constructor(id = -1, name = "", cards = [new Card(-1,"","1")]) {
    super()
    
    //Empty the array if it is the default parameter array
    if (cards != null) {
      if (cards[0] != undefined) {
        if (cards[0].id == -1) {
          cards = []
        }
      }
    }

    this.id = id;
    this.name = name
    this.cards = cards;
  }


  // Used to add a card to the board
  Add(card = new Card(-1,1,0))
  {
    if(this.cards.find(c => c == card) == undefined)
    {
      this.cards.push(card)
      AppState.Save()
      return;
    }

    this.cards[card.id] = card
    AppState.Save()

  }

  // Deletes a card from the board specified by an id
  Delete(id)
  {
    var newCards = this.cards.filter(c => c.id != id)
    this.cards = newCards

    //Refresh id's
    for (let i = 0; i < this.cards.length; i++) {
      const c = this.cards[i];
      c.id = i
    }
    
    this.Save();
    AppState.Save();
  }

  Draw(container) {
    
  }

  // Adds this board instance to the app state if it is not already there
  // Then saves the state of the app
  Save()
  {

    // Check if the board is not alrady in the array of boards
    if(AppState.GetBoards().find(x => x.id == this.id) == undefined)
    {
      AppState.GetBoards().push(this)
      AppState.Save()
      return;
    }

    AppState.GetBoards()[this.id] = this;
    AppState.Save()

  }

  // Utility function to parse a board from a json formatted data
  static parse(boardJson)
  {
    // create a new board instance from jsonData
    var board = new Board(boardJson.id,boardJson.name, null);
    var cards = [];
        
    // Parse all cards
    boardJson.cards.forEach(cardJson => {

      var card = Card.parse(cardJson)
      cards.push(card)
    });

    // set board cards
    board.cards = cards

    return board;
  }

}