//--  HTMX Preserve attributes extension
//--  created by: maᴚko.  
function format_object(obj) {
  return `{${Object.entries(obj).map(([key, value]) => {
    if (Array.isArray(value)) {
      const formatted_array = value.map(item => {
        if (Array.isArray(item)) {
          return `[${item.join(', ')}]`
        } else if (typeof item === 'object' && item !== null) {
          return format_object(item)
        } else {
          return item;
        }
      }).join(', ')
      return `'${key}': [${formatted_array}]`
    } else if (typeof(value) === "object" && value !== null) {
      return `${key}: ${format_object(value)}`
    } else if (typeof(value) === "string") {
      return `${key}: '${value}'`
    } else if (typeof(value) === "function") {
      return value
    } else {
      return `${key}: ${value}`
    }
  }).join(',')}}`
}
function morph_alpine_data(data, new_data) {
  data = eval("(" + data + ")")
  new_data = eval("(" + new_data + ")")
  let morph = Object.assign({}, data, new_data)
  morph = format_object(morph)
  // console.log(morph)
  return morph
}
htmx.defineExtension("preserve-attr", {
  onEvent : function(name, evt) {
    if (name === "htmx:beforeSwap" && evt.detail.serverResponse.length > 0) {
      // console.log(`${evt.type}`, evt.timeStamp)
      let target = evt.target
      let swap_type = target.attributes["hx-swap"] ? target.attributes["hx-swap"].value : false
      const is_preservable = Object.values(target.attributes).some(attr => attr.name.startsWith("hx:"))
      if (swap_type === "outerHTML" && is_preservable) {
        let get_attributes = Array.from(target.attributes)
        filter = get_attributes.filter((attribute) => {
          return attribute.name.startsWith("hx:")
        })
        let response = new DOMParser().parseFromString(evt.detail.serverResponse, "text/html");
        let new_target = response.body.firstChild
        filter.map((attr) => {
          let new_attribute = document.createAttribute(attr.name.replace("hx:", ""))
          let get_data = new_attribute.name === "x-data" ? new_attribute.value : false
          if (attr.name === "x-data") {
            new_attribute.value = morph_alpine_data(attr.value, get_data)
          } else {
            new_attribute.value = attr.value
          }
          new_target.setAttributeNode(new_attribute)
        })
        evt.detail.serverResponse = response.body.innerHTML
        // console.log(evt)
      }
    }
  }
})
