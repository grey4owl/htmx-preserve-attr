//--  HTMX Preserve attributes extension
//--  created by: maᴚko.  
htmx.defineExtension("preserve-attr", {
  onEvent : function(name, evt) {
    if (name === "htmx:afterSwap") {
      let target = evt.detail.target
      Array.from(target.attributes).map((response) => {
        let attr_name = response.name
        let attr_value = response.value
        let swap_type = target.getAttribute("hx-swap")
        if (attr_name.startsWith("hx:") && swap_type === "outerHTML") {
          attr_name = attr_name.replace("hx:", "")
          htmx.on(evt.target, "htmx:load", (evt) => {
            target = evt.detail.elt
            target.setAttribute(attr_name, attr_value)
          })
        }
      })
    }
  }
})
