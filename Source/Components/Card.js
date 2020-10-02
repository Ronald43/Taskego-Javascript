class Card {

  constructor(id = -1, name, items = [new CardItem(-1, "")]) {

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

  // Used as enum of card elements
  static DataTemplate =
  {
    "mainDiv": null,
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

    var mainDiv = document.createElement('div')
    mainDiv.className = 'card'
    mainDiv.id = "card" + this.id

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

    mainDiv.appendChild(header)
    mainDiv.appendChild(body)

    container.appendChild(mainDiv)

    //Return the created elements as formated a DataTemplate
    return {
      "mainDiv": mainDiv,
      "header": header,
      "body": body,
      "closebtn": closebtn,
      "addBtn": addBtn,
      "title": title,
      "textInput": textInput,
      "itemList": itemList,
    }

  }

  // cardTemplate defaulted to DataTemplate for better intelisence
  SetupEvents(cardTemplate = Card.DataTemplate, board) {
    var isBoardValid = board.id != -1

    this.items.forEach(item => {
      item.Draw(cardTemplate.itemList, this)
    });

    cardTemplate.title.ondblclick = (ev) => {
      this.EditTitle(cardTemplate.title)
    }

    cardTemplate.mainDiv.ondragover = (ev) => {
      ev.preventDefault()
    }

    cardTemplate.mainDiv.ondrop = (ev) => {
      this.Drop(ev,cardTemplate.itemList)
    }
    
    cardTemplate.closebtn.onclick = () => {
      if (isBoardValid == true) {
        board.Delete(this.id)
        cardTemplate.mainDiv.remove()
      }
    }

    cardTemplate.addBtn.onclick = () => {
      this.AddItem(cardTemplate.itemList,cardTemplate.textInput)
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
