//--  HTMX Load control extension
//--  created by: maᴚko.  
function parse_attr(target) {
  if (target.nodeType === Node.ELEMENT_NODE) {
    let input = target.attributes["hx-load"]?.value || false
    if (input) {
      return [load, selector]= input.split(/:(.+)/gm)
    }
  }
  return [ undefined, undefined ] 
}
Node.prototype.insertAfter = function (newNode, referenceNode) {
  if (referenceNode && referenceNode.parentNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }
}
function load_control(evt, res) {
  if (evt.type === "htmx:beforeSwap" && evt.detail.serverResponse.length > 0) {
    console.log("htmx:beforeSwap")
    let response = new DOMParser().parseFromString(evt.detail.serverResponse, "text/html")
    if (response) {
      // childrens = Array.from(response.documentElement.children)
      let childrens = Array.from(response.body.children)
      let target, elt, load = undefined
      childrens.forEach((child) => {
        [ get_load, selector ] = parse_attr(child)
        if ((get_load && selector) !== undefined) {
          let init_hash = evt.detail.target["htmx-internal-data"].initHash
          load = get_load
          child.setAttribute("init_hash", init_hash)
          elt = child
          target = response.querySelector(selector)
          if (target) {
            target.remove()
          }
        }
      });
      evt.detail.serverResponse = response.documentElement.innerHTML
      htmx.on("htmx:load", (evt) => {
        if (target && elt && evt.target.attributes.init_hash?.value === elt.attributes.init_hash?.value) {
          evt.target.removeAttribute("init_hash")
          if (load === "beforebegin") {
            evt.target.parentNode.insertAfter(target, evt.target)
          }
          if (load === "afterbegin") {
            evt.target.parentNode.insertBefore(target, evt.target)
          }
        }
      });
    }
  }
  if (evt.type === "htmx:beforeHeadMerge" && evt.detail.xhr.responseText.length > 0) {
    console.log("htmx:beforeHeadMerge")
    let response = new DOMParser().parseFromString(res, "text/html")

    if (response) {
      let childrens = Array.from(response.head.children)
      let target, elt, load = undefined
      response.head.childNodes.forEach((node) => {
        [ get_load, selector ] = parse_attr(node)
        if ((get_load && selector) !== undefined) {
          load = get_load
          console.log(node)
          elt = elt || node
          target = target || response.querySelector(selector)
          if (!document.head.contains(target)) {
            // target.remove()
            document.head.appendChild(elt)
            elt = document.head.lastElementChild
            // htmx.trigger(document.body, "htmx:bla", { bla: elt})
            target = document.querySelector(selector)
            // console.log(response.head.innerHTML)
            // console.log(document.head.innerHTML)
          }
        }
      });
      /*htmx.on("htmx:load", (evt) => {
        console.log(evt)
        if (target && elt && evt.target.outerHTML === elt.outerHTML) {
          if (load === "beforebegin") {
            if (!document.head.contains(target)) {
              document.head.appendChild(target)
            }
          }
          if (load === "afterbegin") {
            // console.log(document.head.contains(target))
            // console.log(target)
            if (!document.head.contains(target)) {
              // console.log(target)
              // console.log(elt)
              document.head.insertBefore(target, elt)
            }
          }
        }
      });*/
    }
  }
}
htmx.on("htmx:beforeHeadMerge", (evt) => {
  evt.preventDefault()
  load_control(evt, evt.detail.xhr.response)
});
htmx.defineExtension("load-control", {
  onEvent : function(name, evt) {
    if (name === "htmx:beforeSwap") {
      // load_control(evt)
    }
  }
})
