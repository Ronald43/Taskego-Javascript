// A class responsible for drawing the currently loaded board
class BoardView {

  static board = new Board(-1)

  // Load the page and the board currenlty being edited
  static LoadView() {

    AppState.Load()
    this.board = AppState.GetCurrentBoard()
    this.DrawElements()
    this.SetupControls()
    
  }

  // Reload the page
  static ReloadView() {
    content.innerHTML = ""
    this.LoadView()
  }

  // Setup all the controls/buttons and their events
  static SetupControls() {

    var cardNameField = document.getElementById("card-name-field")
    var addCardBtn = document.getElementById("add-card-btn")

    addCardBtn.onclick = () => {
      this.CreateNewCard(cardNameField.value)
      cardNameField = ""
    }
  }

  // Creates a new card on the board
  static CreateNewCard(name)
  {
    var id = this.board.cards.length
    var card = new Card(id, name, [])
    this.board.Add(card)
    this.ReloadView()
  }

  // Draws the page
  static DrawElements() {
    //Get the DOM elements
    var title = document.getElementById("title")
    title.innerText = "Taskego - " + this.board.name;

    var content = document.getElementById("content")

    this.board.cards.forEach(card => {
      card.Draw(content, this.board)
    });

  }
  
}

BoardView.LoadView()



