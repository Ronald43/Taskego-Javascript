class BoardView {

  static board = new Board(-1)

  static LoadView() {

    AppState.Load()
    this.board = AppState.GetCurrentBoard()
    this.DrawContent()
    this.SetupControls()
    
  }

  static ReloadView() {
    content.innerHTML = ""
    this.LoadView()
  }

  static SetupControls() {

    var cardNameField = document.getElementById("card-name-field")
    var addCardBtn = document.getElementById("add-card-btn")

    addCardBtn.onclick = () => {
      var id = this.board.cards.length
      var name = cardNameField.value
      var card = new Card(id, name, [])

      this.board.Add(card)
      this.ReloadView()

      cardNameField.value = ""
    }
  }

  static DrawContent() {
    //Get elements
    var title = document.getElementById("title")
    title.innerText = "Taskego - " + this.board.name;

    var content = document.getElementById("content")

    this.board.cards.forEach(card => {
      card.Draw(content, this.board)
    });

  }
}

BoardView.LoadView()



