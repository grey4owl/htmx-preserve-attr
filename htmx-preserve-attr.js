//--  HTMX Preserve attributes extension
//--  created by: maᴚko.  
htmx.defineExtension("preserve-attr", {
  onEvent : function(name, evt) {
    if (name === "htmx:afterSwap") {
      let target = evt.detail.target
      let attributes = Array.from(target.attributes)
      let swap_type = target.getAttribute("hx-swap")
      let filter = attributes.filter((attribute) => {
        return attribute.name.startsWith("hx:")
      })
      if (swap_type === "outerHTML") {
        filter.map((response) => {
          let attr_name = response.name
          let attr_value = response.value
          target = evt.detail.elt
          attr_name = attr_name.replace("hx:", "")
          target.setAttribute(attr_name, attr_value)
          htmx.on(evt.target, "htmx:load", (evt) => {
            target = evt.detail.elt
            attr_name = attr_name.replace("hx:", "")
            target.setAttribute(attr_name, attr_value)
          })
        })
      }
    }
  }
})
