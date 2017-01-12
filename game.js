var gameOfLife = {

  width: 12,
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function() {

    // create <table> element
    var goltable = document.createElement("tbody");

    // build Table HTML
    var tablehtml = '';
    for (var h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function(iteratorFunc) {
    /*
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    for (var h = 0; h < this.height; h++) {
      for (var w = 0; w < this.width; w++) {
        var el = document.getElementById(this.generateID(w, h))
        iteratorFunc(el, w, h);
      }
    }

  },

  generateID: function(w, h) {
    return w + "-" + h;

  },

  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board

    var onCellClick = function(e) {

      // QUESTION TO ASK YOURSELF: What is "this" equal to here?

      // how to set the style of the cell when it's clicked
      if (this.getAttribute('data-status') == 'dead') {
        this.className = "alive";
        this.setAttribute('data-status', 'alive');
      } else {
        this.className = "dead";
        this.setAttribute('data-status', 'dead');
      }

    };

    this.forEachCell(function(el, w, h) {
      el.addEventListener('click', onCellClick);
    });
    // var cell = document.getElementById('board');
    //  board.addEventListener('click', onCellClick);
    // board.addEventListener('click',onCellClick);


    var clearBtn = document.getElementById('clear_btn');

    var clear = function(cell) {

      // Makes sure that any alive cell is reset to "dead"
      if (cell.getAttribute('data-status') == 'alive') {
        cell.className = "dead";
        cell.setAttribute('data-status', 'dead');
      }
    };

    var clearEvent = function() {
      this.forEachCell(clear)
    };
    clearEvent = clearEvent.bind(this);

    clearBtn.addEventListener('click', clearEvent) // forEachCell(clear.bind()) )


    var randomBtn = document.getElementById('reset_btn');

    var reset = function(cell) {
      //randomizes board
      var randomNum = Math.random()
      if (randomNum < .5){
        cell.className = "dead";
        cell.setAttribute('data-status', 'dead');
      } else {
        cell.className = "alive";
        cell.setAttribute('data-status', 'alive');
      }
    };

    var randomEvent = function() {
      this.forEachCell(reset)
    };
    randomEvent = randomEvent.bind(this);
    randomBtn.addEventListener('click', randomEvent) // forEachCell(clear.bind()) )


  },

  checkNeighbors: function(w,h){

  },
  checkStatus: function()

  step: function() {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    for (var h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w = 0; w < this.width; w++) {
        var currentCell=document.getElementByID(generateID(w,h));
        var status;
        var aliveN=0;
        var deadN=0;

        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

  },

  enableAutoPlay: function() {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
  }

};

gameOfLife.createAndShowBoard();
