var body = d3.select(document.body)
  , svg
  , taco
  , shell
  , frown
  , heart
  , smile
  , tag
  , drag
  , draggables
  , speech
  , ingredient
  , list

function reinit () {
  list = {
    meat: 1,
    leaf: 3,
    tomato: 2,
    cheese: 1
  }
  taco = d3.select("#taco")
  
  taco.remove()
  
  body
      .style("background-color", "LightSlateGray")
      .style("background", "linear-gradient(to bottom, LightSlateGray  0%, dimgray 100%)")
  
  d3.xml("assets/images/sadtaco2.svg", "image/svg+xml", function(xml) {
    svg = xml.documentElement
    body[0][0].appendChild(document.importNode(svg, true))
    
    taco = d3.select("#taco")
    shell = d3.selectAll(".shell")
    frown = d3.select("#mouth0")
    smile = d3.select("#mouth1")
    heart = d3.select("#heart")
    drag = d3.behavior.drag()
    draggables = d3.selectAll(".cheese, .meat, .leaf, .tomato")
    
    draggables
        .style("cursor", "move")
        .on("touchstart", setIngredient)
        .on("mousedown", setIngredient)
        .on("touchend", addIngredient)
        .on("mouseup", addIngredient)

    
    speech = d3.select("#speechBubble")
    
    drag
        .on("drag", dragged)
    
    shell
        .on("mouseover", addIngredient)
    
    draggables.call(drag)
    
    resize()
  })
}

function setIngredient () {
  ingredient = d3.select(this)
  
  speech.style("display", "none")
}

function addIngredient () {
  if (ingredient) {
    var ingredientName = ingredient.attr("class")
    list[ingredientName] -= 1
    
    d3.select("#"+ingredientName+list[ingredientName]).style("display", null)
    ingredient.remove()
    
    ingredient = void(0)
    checkWin()
  }
}

function checkWin() {
  if(list.meat === 0 && list.leaf === 0 && list.tomato === 0 && list.cheese === 0) {
    frown.style("display", "none")
    smile.style("display", null)
    heart.style("display", null)
    
    body
        .style("background-color", "hotpink")
        .style("background", "linear-gradient(0deg, hsl(0,100%,100%), hotpink)")
    
    taco.select("#game").style("cursor", "pointer")
    
    shell.on("click", eatMe)
  }
}

function eatMe() {
  taco.select("#game").style("display", "none")
  
  var eatMe = d3.select("#eatMe, #tag, #heart")
    .style("display", null)
    .style("cursor", "pointer")
  
  var mouth2 = eatMe.select("#mouth2")
    , mouth3 = eatMe.select("#mouth3")
  
  mouth2.style("display", "none")
  mouth3.style("display", null)
  
  setTimeout(function () {
    mouth3.style("display", "none")
    mouth2.style("display", null)
    
    setTimeout(function () {
      mouth2.style("display", "none")
      mouth3.style("display", null)
      
      taco.select("#game").on("click", reinit)
    }, 400)
  }, 300)
}


function dragged (d, i) {
  var bBox = this.getBBox()
  this.setAttribute("x", d3.event.x - bBox.x - bBox.width / 2)
  this.setAttribute("y", d3.event.y - bBox.y - bBox.height / 2)
}

function resize () {
  taco
    .attr("width", body[0][0].offsetWidth)
    .attr("height", body[0][0].offsetHeight)
    
  window.onresize = resize
  
  redraw()
}

function redraw () {
}

reinit()