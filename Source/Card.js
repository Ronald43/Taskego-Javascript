class Card extends Drawable {

  constructor(id = -1, name, items = [new CardItem(-1, "")]) {
    super();

    //Empty the array if it is the default parameter array
    if (items != null) {
      if (items[0] != undefined) {
        if (items[0].id == -1) {
          items = []
        }
      }
    }

    this.id = id;
    this.name = name;
    this.items = items;

  }

  static DataTemplate =
  {
    "cardElement": null,
    "header": null,
    "body": null,
    "closebtn": null,
    "addBtn": null,
    "title": null,
    "textInput": null,
    "itemList": null,
  }

  Draw(container, board = new Board()) {
    var elements = this.RenderElements(container)
    this.SetupEvents(elements, board)
  }

  RenderElements(container) {

    var cardElement = document.createElement('div')
    cardElement.className = 'card'
    cardElement.id = "card" + this.id

    var header = document.createElement('div')
    header.className = 'card-header'

    var body = document.createElement('div')
    body.className = 'card-body'

    var title = document.createElement('h1')
    title.innerHTML = this.name

    var textInput = document.createElement('input')
    textInput.className = 'textInput'

    var closebtn = document.createElement('span')
    closebtn.innerHTML = 'X'
    closebtn.className = 'card-close'

    var addBtn = document.createElement('span')
    addBtn.innerHTML = 'Add'
    addBtn.className = 'btn'

    var itemList = document.createElement('ul')
    itemList.id = 'item-list'

    header.appendChild(closebtn)
    header.appendChild(title)
    header.appendChild(textInput)
    header.appendChild(addBtn)

    body.appendChild(itemList)

    cardElement.appendChild(header)
    cardElement.appendChild(body)

    container.appendChild(cardElement)

    return {
      "cardElement": cardElement,
      "header": header,
      "body": body,
      "closebtn": closebtn,
      "addBtn": addBtn,
      "title": title,
      "textInput": textInput,
      "itemList": itemList,
    }

  }

  SetupEvents(elements = Card.DataTemplate, board) {
    var isBoardValid = board.id != -1

    this.items.forEach(item => {
      item.Draw(elements.itemList, this)
    });

    elements.title.ondblclick = (ev) => {
      this.EditTitle(elements.title)
    }

    elements.cardElement.ondragover = (ev) => {
      ev.preventDefault()
    }

    elements.cardElement.ondrop = (ev) => {
      this.Drop(ev,elements.itemList)
    }

    elements.closebtn.onclick = () => {
      if (isBoardValid == true) {
        board.Delete(this.id)
        elements.cardElement.remove()
      }
    }

    elements.addBtn.onclick = () => {
      this.AddItem(elements.itemList,elements.textInput)
    }

  }

  EditTitle(title = new Element()) {
    if (Input.isEditing == true)
      return

    Input.Edit(title, this.name)

    Input.OnEditEnd = (text) => {

      if (text.trim().charAt(0) == "|") {
        title.innerText = this.name
        text = this.name
      }

      this.name = text
      AppState.Save()
    }
  }

  AddItem(itemList,textInput) {
    
    var name = textInput.value
    
    var id = this.items.length

    var item = new CardItem(id, name)

    item.Draw(itemList, this)
    this.items.push(item)
    AppState.Save()

  }

  Drop(ev, itemList)
  {
    ev.preventDefault()

    var type = ev.dataTransfer.getData("type")
    if (type != "item") {
      return;
    }

    var itemId = ev.dataTransfer.getData("itemId");
    var cardId = ev.dataTransfer.getData("cardId")

    var card = AppState.GetCurrentBoard().cards[cardId]
    var item = card.items[itemId]

    card.Delete(item.id)
    item.id = this.items.length
    this.items.push(item)
    AppState.Save()

    var oldElementId = ev.dataTransfer.getData("itemElementId")
    document.getElementById(oldElementId).remove()

    item.Draw(itemList, this)

  }
  
  Delete(id) {
    
    this.items = this.items.filter(item => item.id != id)

    //Refresh id's
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.id = i
    }

    AppState.Save();

  }

  static parse(cardJson) {
    
    var card = new Card(cardJson.id, cardJson.name, null)
    var items = []

    cardJson.items.forEach(cardItemJson => {
      var cardItem = CardItem.parse(cardItemJson)
      items.push(cardItem)
    });

    card.items = items;
    return card;

  }

}
