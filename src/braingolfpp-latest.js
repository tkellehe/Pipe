(function(global){

// The current verion of braingolfpp.
var version = "1.00.00.00",

//-----------------------------------------------------------------------------
// Symbol look up.
Symbols = {
  "+": [],
  "-": [],
  ">": [],
  "<": [],
  "[": [],
  "]": [],
  ".": [],
  ",": []
}

//-----------------------------------------------------------------------------
// Commands.
function Command(f) {
  this.execute = f;
}

//-----------------------------------------------------------------------------
// The lexical analyzer.
function Token(start, code) {

}

//-----------------------------------------------------------------------------
function Cell(x,y) {
  this.x = x;
  this.y = y;
  this.value = undefined;
}
function Memory() {
  this.__arrays__ = [[new Cell(0,0)]];
}
Memory.prototype.access = function(pos) {
  if(this.__arrays__[pos.x] === undefined) {
    this.__arrays__[pos.x] = [];
  }
  if(this.__arrays__[pos.x][pos.y] === undefined) {
    this.__arrays__[pos.x][pos.y] = new Cell(pos.x, pos.y);
  }
  return this.__arrays__[pos.x][pos.y];
}

//-----------------------------------------------------------------------------
// The main clas for starting the program.
function Program(code) {
  this.memory = new Memory();
  this.pc = 0;
  this.code = code;
  this.pos = { x:0, y: 0 };
}

//-----------------------------------------------------------------------------
// The main function for processing and executing the code.
braingolfpp = function(code) {
  return new Program(code);
}

//-----------------------------------------------------------------------------
// Sets all of the global variables defined earlier.
braingolfpp.version = version;
global.braingolfpp = braingolfpp;

})(this)