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
    if (name === "htmx:afterOnLoad") {
      let target = evt.detail.target
      let swap_type = target.attributes["hx-swap"] ? target.attributes["hx-swap"].value : false
      let init_hash = target["htmx-internal-data"].initHash
      if (swap_type === "outerHTML" && init_hash === null) {
        let get_attributes = Array.from(target.attributes)
        let filter = get_attributes.filter((attribute) => {
          return attribute.name.startsWith("hx:")
        })
        let new_attributes = target["htmx-internal-data"].replacedWith["attributes"]
        let get_data = new_attributes["x-data"] ? new_attributes["x-data"].value : false
        filter.map((response) => {
          let attr_name = response.name
          attr_name = attr_name.replace("hx:", "")
          let attr_value = response.value
          let new_attr = document.createAttribute(attr_name)
          if (attr_name === "x-data") {
            new_attr.value = morph_alpine_data(attr_value, get_data)
          } else { new_attr.value = attr_value }
          new_attributes.setNamedItem(new_attr)
        })
      }
    }
  }
})
