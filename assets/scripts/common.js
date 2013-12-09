var body = d3.select(document.body)
  , vis = d3.oxide()
  , elements = []
  , stage

function reinit (elements) {
    vis.elements([].concat(elements))
    vis(body)
    
    stage = d3.select("#stage")
    resize()
}

function resize () {
    var stageDim = [stage[0][0].clientWidth, stage[0][0].clientHeight]
    
    var max = (stageDim[0] > stageDim[1]) ? stageDim[0] : stageDim[1]
    redraw()
}

function redraw () {
    d3.oxide.imageAutoLoad(body.select("image")[0][0])
}

function rescale () {
    
}