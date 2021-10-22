const g = "#graphArea";
const graphWidth = window.innerWidth * .65;
const graphHeight = window.innerHeight * .7;
const margin = {left: "50px", right: "20px", top: "10px", bottom: "10px"};
let X_AXIS = 0
let X_TYPE = 'null'
//TODO: Change Y_AXIS to a Set and iterate through it in the graphs
let Y_AXIS = 1
let Y_TYPE = 'null'
let Y_TYPES = new Set()
let svg
let rawText
let data
let count

let file
const inputElement = document.getElementsByClassName("fileInput")[0];
/*
 * When the file changes it loads the variables
 * Also resets everything
 */
inputElement.addEventListener("change", onFileChange, false);
function onFileChange() {
  file = inputElement.files[0]
  var reader = new FileReader()
  reader.addEventListener('load', function(event){
    rawText = event.target.result
    var name = file.name
    if(name.length > 50) {
      name = name.substring(0, 50)
    }
    document.getElementById("current").textContent = "current file: " + name
    displayColumns()
    templateGraph()
  })
  if(file != null) {
    reader.readAsText(file)
  }
}

/*
 * Generates template graphs so the user can play around with dropping variables
 */
window.addEventListener('load',function() {
  templateGraph();
  displayColumns();
})

/*
 * Creates two divs that receive the information regarding the dropped variables
 */
function appendOnDrop() {
  var position = document.getElementById("Y-AXIS").getBoundingClientRect();
  overlay = document.createElement("div")

  overlay.style.position = "absolute"
  overlay.style.zIndex = 100
  overlay.style.left = position.left + "px"
  overlay.style.top = position.top + "px"
  overlay.style.minHeight = position.height + "px"
  overlay.style.minWidth = position.width + "px"
  overlay.setAttribute("ondragover", "allowDrop(event)")
  overlay.setAttribute("ondrop", "onDrop(event, 'y')")
  document.getElementsByTagName("body")[0].append(overlay)

  position = document.getElementById("X-AXIS").getBoundingClientRect();
  overlay = document.createElement("div")

  overlay.style.position = "absolute"
  overlay.style.zIndex = 100
  overlay.style.left = position.left + "px"
  overlay.style.top = position.top + "px"
  overlay.style.minHeight = position.height + "px"
  overlay.style.minWidth = position.width + "px"
  overlay.setAttribute("ondragover", "allowDrop(event)")
  overlay.setAttribute("ondrop", "onDrop(event, 'x')")
  document.getElementsByTagName("body")[0].append(overlay)
}

/*
 * When the user drops the item into a valid zone
 * Data is loaded into the variables
 */
function onDrop(event, axis) {
  const data = event.dataTransfer.getData("text/plain");
  const split = data.split(":")
  const name = split[0]
  const index = split[1]
  const type = split[2]
  if(axis == 'x') {
    document.getElementById("X-AXIS").textContent = name
    X_AXIS = index
    X_TYPE = type
  }
  if(axis == 'y') {
    document.getElementById("Y-AXIS").textContent = name
    Y_AXIS = index
    Y_TYPE = type
  }
  console.log(data)
  event.preventDefault()
}
function allowDrop(event) {
  //console.log(event)
  event.preventDefault()
}

/*
 * A template graph
 */
function templateGraph() {
  clearGraphs()
  const labelMargin = getRightMargin("Y-Axis Variable")

    var x = d3.scaleBand()
    .range([ 0, graphWidth ])
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + graphHeight + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", graphWidth)
        .attr("y", graphHeight+40 )
        .text("X-Axis Variable")
        .attr("id", "X-AXIS")
        .attr("class", "variable")

    var y = d3.scaleLinear()
    .range([ graphHeight, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", labelMargin)
        .attr("y", -10)
        .text("Y-Axis Variable")
        .attr("id", "Y-AXIS")
        .attr("class", "variable")

    appendOnDrop()
}

/*
 * Grabs data from each column and creates a draggable text blob for each column.
 * Also labels each data type as either NUMBER, STRING, or OTHER
 * TODO: Make these radio buttons probably
 */
function displayColumns() {
  var filename = 'test.csv'
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    var count = 0;
    if(this.readyState == 4 && this.status == 200) {
      if(file == null) {
        rawText = this.responseText;
      }
      data = d3.csvParse(rawText);

      var columns = data.columns;
      var divs = document.getElementsByClassName("columns")
      for(var ele = 0; ele < divs.length; ele++) {
        divs[ele].innerHTML = ""
        for(var i = 0; i < columns.length; i++) {
          var label = document.createElement("label")
          label.textContent = columns[i]
          label.setAttribute("id", ele + ":" + i)
          label.setAttribute("draggable", true)

          //Assigns data as either a number or a string
          if(data[0][columns[i]].includes("/[a-zA-Z]/g")) {
            label.setAttribute("class", "variable strings")
            label.setAttribute("ondragstart", "event.dataTransfer.setData('text/plain', '"+ columns[i] + ":" + i + ":string')")
          }
          else {
            label.setAttribute("class", "variable numbers")
            label.setAttribute("ondragstart", "event.dataTransfer.setData('text/plain', '"+ columns[i] + ":" + i + ":number')")
          }

          divs[ele].append(label)
          divs[ele].append(document.createElement("br"))
          divs[ele].append(document.createElement("br"))

          count = Math.max(count, i)
        }
      }

    }
  }
  xhttp.open("GET", "./" + filename, true);
  xhttp.send();
}

//Sets up the graphing area for the next graph
function clearGraphs() {
    d3.select(g).html("");
    svg = d3.select("#graphArea")
  .append("svg")
    .classed("graph", true)
    .attr("width", graphWidth + 150)
    .attr("height", graphHeight + 150)
    .append("g")
      .attr("transform",
            "translate(" + 120 + "," + 50 + ")");
}

function loadFile(type) {
  //Default file
  var filename = "test.csv"
  //If the user uploads a custom file
  var file = inputElement.files[0]
  var reader = new FileReader()
  reader.addEventListener('load', function(event){
    rawText = event.target.result
  })
  if(file != null) {
    reader.readAsText(file)
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //If the user has NOT uploaded a file
      if(file == null) {
        rawText = this.responseText;
      }
      data = d3.csvParse(rawText)
      count = data.columns.length
      clearGraphs()
      //Finds the type of graph requested and renders the graph
      //Also makes sure the types are correct for the data type
      if(type === "bargraph") {
          //Bar graphs can have numbers or strings in the X axis.
          //Y axis must be numeric
          if(Y_TYPE === 'number') {
            barplot()
          }
      }
      else if(type === "dotplot") {
          //Requires both to be numeric
          if(X_TYPE === 'number' && Y_TYPE === 'number') {
            dotplot()
          }
      }
      else if(type === "linegraph") {
        //Requires both to be numeric
        if(X_TYPE === 'number' && Y_TYPE === 'number') {
          linegraph()  
        }
      }
      
    }
  };
  xhttp.open("GET", "./" + filename, true);
  xhttp.send();
}

//Calculates the right margin based on string length
function getRightMargin(str) {
    return str.length * 5
}