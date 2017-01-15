var gameOfLife = {
  width: 40,
  height: 40, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game
  speed:200,

  getUserSettings:function(){
    //gets value
    var input=document.getElementById('set_values').value
    //resets input
    document.getElementById('set_values').value=""
    //parse input removing anything but numbers and commas, joins then returns
    //an array of three final numbers: speed, width, height.
    input=input.split("").filter(function(char){
      return /[0-9,]/.test(char);
    }).join("").split(",")

    // if user enters 1 argument or 3, the first one will be speed.
    if(input.length===1||input.length===3) this.speed=input[0]||200;
    //if user enters 3 arguments, set the w and h
    if(input.length===3){
      this.width=input[1]||40;
      this.height=input[2]||40;
    }
    //if user only enters 2, they are setting only width and height
    if(input.length==2){
      this.width=input[0]||40;
      this.height=input[1]||40;
    }
    document.getElementById("tbody").remove();
    this.createAndShowBoard();

  },

  createAndShowBoard: function() {

    // create <table> element
    var goltable = document.createElement("tbody");
    goltable.id="tbody";


    // build Table HTML
    var tablehtml = '';
    for (var h = 0; h < this.height; h++) {
      tablehtml += `<tr id='row+${h}'>`;
      for (var w = 0; w < this.width; w++) {
        tablehtml += `<td data-status='dead' id='${w}-${h}'></td>`;
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
//UTILITY FUNCTIONS
  forEachCell: function(iteratorFunc) {
    /*
      Loops over all cells in the board and calls the passed
      function on each cell, passing the function a cell,w and h parameter.
    */
    var self = this;
    Array.from(document.getElementsByTagName("td")).forEach(function(cell){
      var coords = self.getCoordsOfCell(cell);
      iteratorFunc(cell,coords[0],coords[1]);
    });
  },

  getCoordsOfCell: function(cell) {
    var cellID=cell.id
    return cellID.split("-").map(function(str){return +str});
  },

  getCellStatus:function(cell){
    return cell.getAttribute('data-status')
  },

  setCellStatus:function(cell,status){
    cell.className=status;
    cell.setAttribute('data-status',status)
  },

  toggleCellStatus:function(cell){
     //toggles status of each cell between dead/alive
      if (this.getCellStatus(cell)== 'dead') {
        this.setCellStatus(cell,"alive");
      } else {
        this.setCellStatus(cell,"dead");
      }
  },

  selectCell:function(x,y){
    return document.getElementById(`${x}-${y}`);
  },


  getNeighbors: function(cell){
    //check the neighboring cells and return count of alive.
    var neighbors=[];
    var thisCellCoords=this.getCoordsOfCell(cell);
    var cellX=thisCellCoords[0],cellY=thisCellCoords[1];

    //next to
    neighbors.push(this.selectCell(cellX+1,cellY))
    neighbors.push(this.selectCell(cellX-1,cellY))
    //above
    neighbors.push(this.selectCell(cellX+1,cellY+1))
    neighbors.push(this.selectCell(cellX,cellY+1))
    neighbors.push(this.selectCell(cellX-1,cellY+1))
    //below
    neighbors.push(this.selectCell(cellX+1,cellY-1))
    neighbors.push(this.selectCell(cellX,cellY-1))
    neighbors.push(this.selectCell(cellX-1,cellY-1))

    return neighbors.filter(function(n){
      return n!==null;
    });
    // var alive=0;
    // for (var h = (y-1); h <= (y+1); h++){
    //   for(var w = (x-1); w <= (x+1); w++){
    //     if(w!==x || h!==y){//WHAT
    //       var cell=document.getElementById(`${w}-${h}`);
    //       if(this.isAlive(cell)) alive++;
    //     }
    //   }
    // }
    // return alive;
  },

  getAliveNeighbors: function(cell){
    //Checks the status, is it alive, of a cell
    var all=this.getNeighbors(cell)
    var self=this;
    return all.filter(function(n){
      return self.getCellStatus(n)==="alive";
    });
  },

  runTheRules: function(alive,status){
    //checks for new state:
    if(status==="alive" && (alive<2 || alive >3)){
      return "dead";
    }else if(status==="alive" && alive <=3){
      return "alive";
    }else if(status==="alive" && alive > 3){
      return "dead";
    }else if(status ==="dead" && alive===3){
      return "alive"
    }else{
      return "dead";
    }
  },

  //GAME
  setupBoardEvents: function() {
    // attaches event listeners to every cell for "toggle" functionality
    //attaches event listeners to buttons step, clear, random and play.
    var self=this;

    //toggles status of each cell between dead/alive
    var onCellClick = function(e) {
      self.toggleCellStatus(this)
    }

    //adds event listener to every cell
    this.forEachCell(function(el, w, h) {
      el.addEventListener('click', onCellClick);
    });

    //clear button setup
    document.getElementById('clear_btn').addEventListener('click',function(e){
     self.clear();
    });
    //reset random button setup
    document.getElementById('reset_btn').addEventListener('click', function(e){
      self.randomize()
    })
    //step button setup
    document.getElementById('step_btn').addEventListener('click', function(e){
      self.step()
    })
    //play button setup
    document.getElementById('play_btn').addEventListener('click', function(e){
      self.enableAutoPlay()
    })
    //set button
    document.getElementById('set_btn').addEventListener('click', function(e){
      self.getUserSettings()
    })

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
    var self=this;
    var changeQueue=[]
    this.forEachCell(function(cell,x,y){
      var alive=self.getAliveNeighbors(cell).length;
      var status=self.getCellStatus(cell);
      var futureStatus=self.runTheRules(alive,status);
      if(status!==futureStatus){
        changeQueue.push(wrapper(cell,futureStatus));
      }
    })
    //saves these with context for future execution
    function wrapper(cell,futureStatus){
      return function(){
        self.setCellStatus(cell,futureStatus)
      }
    }

    changeQueue.forEach(function(el){
        el();
    })

    // for (var h = 0; h < this.height; h++) {
    //   for (var w = 0; w < this.width; w++) {
    //     var currentCell=document.getElementById(`${w}-${h}`);
    //     var status=this.isAlive(currentCell);
    //     var aliveN=this.checkNeighbors(w,h);
    //     var newStatus=this.runTheRules(aliveN,status);
    //     function change(currentCell,newStatus){ setTimeout(function(){
    //       currentCell.className = newStatus;
    //       currentCell.setAttribute('data-status', newStatus)
    //     })}
    //     change(currentCell,newStatus);

    //   }
    // }

  },

  clear: function(cell) {
    var self=this;
    window.clearInterval(this.stepInterval);
    this.stepInterval=null;
    this.forEachCell(function(cell){
      if (self.getCellStatus(cell) == 'alive') {
        self.setCellStatus(cell,"dead");
      }
    })
  },

  randomize: function(cell) {
    var self=this;
    self.forEachCell(function(cell){
      if (Math.random() < .5){
        self.setCellStatus(cell,"dead");
      } else {
        self.setCellStatus(cell,"alive");
      }
    })
  },

  enableAutoPlay: function() {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
      if(!this.stepInterval){
        this.stepInterval=window.setInterval(this.step.bind(this),200)
      }else{
        window.clearInterval(this.stepInterval);
        this.stepInterval=null;
      }

  },

};

gameOfLife.createAndShowBoard();


