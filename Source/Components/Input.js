//Mainly used to edit text on elements such as names on cards or text on card items
class Input
{
  constructor(){

  }

  static element // the element being edited
  static editText = "" // the text on that element
  static isEditing = false;
  
  // used to save the styles that would be overriten on the element
  static styles = {
    "background" : undefined, 
    "color" : undefined, 
    "fontWeight" : undefined,
    "border" : undefined, 
    "borderRadius" : undefined
  }
  
  // Used to start editing an element
  static Edit(element = new Element(), text = "")
  {
    
    // Save the styles the element has
    this.styles.background = element.style.background
    this.styles.color = element.style.color
    this.styles.fontWeight = element.style.color
    this.styles.border = element.style.border
    
    // Apply some styling to make the element look like an input bar
    element.style.background = "#fff"
    element.style.color = "#aaa"
    element.style.fontWeight = "100"
    element.style.border = "ridge white 2px"

    this.element = element
    this.editText = text
    this.isEditing = true

    
  }

  // Called when we finish editing an element
  static EndEdit()
  {
    // Call this "event" to let the interested elements know that editing has ended
    this.OnEditEnd(this.editText)

    // Restore the elements original styling
    this.element.style.background = this.styles.background
    this.element.style.color = this.styles.color
    this.element.style.fontWeight = this.styles.fontWeight
    this.element.style.border = this.styles.border

    Input.isEditing = false
    Input.element = null
    Input.editText = ""

  }

  static OnEditEnd(text = ""){}
}

// Key stroke input
document.onkeydown = (ev) => {
  
  if(Input.isEditing == false)
  {
    return;
  }

  var text = Input.editText;

  // Erase character
  if(ev.key == "Backspace"){
    Input.editText = text.slice(0,text.length - 1)
    if(Input.editText.trim().length == 0)
    {
      Input.editText  = "|"
    }
  }

  if(ev.key == "Space"){
    Input.editText += " "
  }

  // Write character
  if(ev.key.length == 1){
    if(Input.editText.trim().charAt(0) == '|')
    {
      Input.editText = ""
    }
    Input.editText += ev.key
  }
  
  Input.element.innerText = Input.editText
  
  //Finish editing
  if(ev.key == "Enter"){
    Input.EndEdit()
  }

}
