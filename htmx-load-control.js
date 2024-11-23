//--  HTMX Load control extension
//--  created by: maᴚko.  
function parse_attr(target) {
  let input = target.attributes["hx-load"]?.value || false
  let [load, selector] = ""
  if (input) {
    [load, selector] = input.split(/:(.+)/gm)
  }
  return [load, selector]
}
Node.prototype.insertAfter = function (newNode, referenceNode) {
  if (referenceNode && referenceNode.parentNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }
}
htmx.defineExtension("load-control", {
  onEvent : function(name, evt) {
    let response
    if (name === "htmx:beforeSwap" && evt.detail.serverResponse.length > 0) {
      response = new DOMParser().parseFromString(evt.detail.serverResponse, "text/html")
      childrens = Array.from(response.body.children)
      let target, elt, load_type
      childrens.forEach((child) => {
        [load, selector] = parse_attr(child)
        if ((load && selector) !== undefined) {
          load_type = load
          elt = child
          target = response.querySelector(selector)
          target.remove()
        }
      })
      evt.detail.serverResponse = response.body.innerHTML
      htmx.on("htmx:load", (evt) => {
        if ((target && elt) !== undefined) {
          if (evt.target.toString() === elt.toString()) {
            if (load_type === "beforebegin") {
              evt.target.parentNode.insertAfter(target, evt.target)
            }
            if (load_type === "afterbegin") {
              evt.target.parentNode.insertBefore(target, evt.target)
            }
          }
        }
      })
    }
  }
})
