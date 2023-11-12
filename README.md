# htmx-preserve-attr
A simple [</> htmx](https://htmx.org) extension for preserving attributes while swaping content with `hx-swap="outerHTML"`. 
May be useful if you work with [alpine.js](https://alpinejs.dev/)..

## quick start
Include `htmx-preserve-attr.js` script in `head` tag after htmx initialization
```html
<head>
  <script src="https://unpkg.com/htmx.org@latest" defer></script>
  <script src="htmx-preserve-attr.js" defer></script>
</head>
```
Add `hx-ext="preserve-attr"` to body tag.
```html
<body hx-ext="preserve-attr">
```
For each attribute you want to preserve while swaping, add `hx:` as a prefix..
For example `hx:foo="bar"`
```html
<div hx:foo="bar" hx-get="/new-content" hx-swap="outerHTML" hx-trigger="load"></div>
```
And you should get the following output:
```html
<div foo="bar">
<!-- new content.. -->
</div>
```
