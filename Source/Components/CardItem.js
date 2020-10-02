//Base class for all card items
class CardItem {

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.isChecked = false
  }

  Draw(containerDOM = new Element(), card = new Card()) {
    var itemDOMElement = document.createElement("li")
    itemDOMElement.innerHTML = this.name
    itemDOMElement.id = "card" + card.id + "- item" + this.id
    itemDOMElement.className = (this.isChecked) ? 'checked' : ''
    itemDOMElement.draggable = true

    var closeBtn = document.createElement('span')
    closeBtn.className = 'close'
    closeBtn.innerHTML = 'X'
    
    itemDOMElement.appendChild(closeBtn)
    containerDOM.appendChild(itemDOMElement)

    itemDOMElement.onclick = (ev) => {
      
      if(Input.isEditing == true)
        return;
      
      itemDOMElement.classList.toggle('checked')
      this.isChecked = !this.isChecked
      AppState.Save()
    }
    
    itemDOMElement.ondblclick= (ev) => {
      
      if (Input.isEditing == true)
        return

      Input.Edit(itemDOMElement, this.name)

      Input.OnEditEnd = (text) => {

        if (text.trim().charAt(0) == "|") {
          itemDOMElement.innerText = this.name
          text = this.name
        }

        this.name = text
        AppState.Save()
      }

    }

    itemDOMElement.ondragstart = (ev) => {
      ev.dataTransfer.setData("type","item")
      ev.dataTransfer.setData("itemId",JSON.stringify(this.id))
      ev.dataTransfer.setData("cardId",JSON.stringify(card.id))
      ev.dataTransfer.setData("itemElementId",ev.target.id)
    }

    itemDOMElement.ondragover = (ev) => {
      ev.preventDefault()
    }

    closeBtn.addEventListener('click', () => {
      card.Delete(this.id)
      itemDOMElement.remove()
    })

  }

  static parse(cardItemJson) {
    var cardItem = new CardItem(cardItemJson.id, cardItemJson.name)
    cardItem.isChecked = cardItemJson.isChecked
    return cardItem;
  }

}