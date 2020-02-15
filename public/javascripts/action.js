var body = document.querySelector('body')
var whiteback = document.getElementById("whiteback")
body.addEventListener("click", function (event) {
  console.log(event.target.id)
  if (event.target.id === 'delete') {
    event.preventDefault()
    // console.log(event)
    // console.log(event.target.attributes.href.value)
    whiteback.querySelector('form').action = `/admin/restaurant/${event.target.attributes.href.value}?_method=DELETE`
    whiteback.style.display = "block"

  }
  if (event.target.id == 'cancel' || event.target.id == "whiteback") {
    whiteback.style.display = "none"
  }

});