var gameOfLife = {

  width: 40,
  height: 40, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function() {

    // create <table> element
    var goltable = document.createElement("tbody");
    goltable.id="tbody";


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

    var clear = function(cell) {
      // Makes sure that any alive cell is reset to "dead"
      window.clearInterval(this.setInterval);
      if (cell.getAttribute('data-status') == 'alive') {
        cell.className = "dead";
        cell.setAttribute('data-status', 'dead');
      }

    };
    //clear button setup
    var clearBtn = document.getElementById('clear_btn');
    var clearEvent = function() {
      this.forEachCell(clear)
    };
    clearEvent = clearEvent.bind(this);
    clearBtn.addEventListener('click', clearEvent) //

    //random button setup
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
    var randomBtn = document.getElementById('reset_btn');
    randomEvent = randomEvent.bind(this);
    randomBtn.addEventListener('click', randomEvent)

    //step button setup
    var stepBtn = document.getElementById('step_btn')
    stepEvent = this.step.bind(this);
    stepBtn.addEventListener('click', stepEvent);
    //step button setup
    var playBtn = document.getElementById('play_btn')
    playEvent = this.enableAutoPlay.bind(this);
    playBtn.addEventListener('click', playEvent);

  },

  checkNeighbors: function(x,y){
    //check the neighboring cells and return count of alive.
    var alive=0;
    for (var h = (y-1); h <= (y+1); h++){
      for(var w = (x-1); w <= (x+1); w++){
        if(w!==x || h!==y){//WHAT
          var cell=document.getElementById(this.generateID(w,h));
          if(this.isAlive(cell)) alive++;
        }
      }
    }
    return alive;
  },

  isAlive: function(cell){
    //Checks the status, is it alive, of a cell
    if(cell){
      return cell.className==="alive"
    }else{
      return false;
    }
  },

  runTheRules: function(alive,status){
    //checks for new state:
    if(status===true && alive<2){
      return "dead";
    }else if(status===true && alive <=3){
      return "alive";
    }else if(status===true && alive > 3){
      return "dead";
    }else if(status === false && alive===3){
      return "alive"
    }else{
      return "dead";
    }
  },

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
      for (var w = 0; w < this.width; w++) {
        var currentCell=document.getElementById(this.generateID(w, h));
        var status=this.isAlive(currentCell);
        var aliveN=this.checkNeighbors(w,h);
        var newStatus=this.runTheRules(aliveN,status);
        function change(currentCell,newStatus){ setTimeout(function(){
          currentCell.className = newStatus;
          currentCell.setAttribute('data-status', newStatus)
        })}
        change(currentCell,newStatus);

      }
    }

  },

  enableAutoPlay: function() {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
      if(!this.stepInterval){
        this.stepInterval=window.setInterval(this.step.bind(this),200)
      }

  },

};

gameOfLife.createAndShowBoard();


