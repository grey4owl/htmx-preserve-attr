//--  HTMX Preserve attributes extension
//--  created by: maᴚko.  
htmx.defineExtension("preserve-attr", {
  onEvent : function(name, evt) {
    /* if (name === "htmx:beforeOnLoad") {
      let new_attributes = evt.detail.target["htmx-internal-data"]
      console.log(new_attributes)
    } */
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
        filter.map((response) => {
          let attr_name = response.name
          attr_name = attr_name.replace("hx:", "")
          let attr_value = response.value
          let new_attr = document.createAttribute(attr_name)
          new_attr.value = attr_value
          new_attributes.setNamedItem(new_attr)
        })
      }
    }
  }
})
