//--  HTMX Preserve attributes extension
//--  created by: maᴚko.  
function morph_alpine_data(data, new_data) {
  data = eval("(" + data + ")")
  new_data = eval("(" + new_data + ")")
  let morph = Object.assign({}, data, new_data)
  morph = Object.entries(morph).map(([name, value]) => {
    if (typeof(value) === "function") {
      value = value.toString().replace(/^.*?\{([\s\S]*?)\}.*$/, '$1').trim()
      value = "{" + value + "}"
      name = name + "()"
    }
    return [name, value]
  })
  morph = Object.fromEntries(morph)
  morph = JSON.stringify(morph, null, 2)
  morph = morph.replace(/"/g, "").replace(/\):\s\}*/g, ")")
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
