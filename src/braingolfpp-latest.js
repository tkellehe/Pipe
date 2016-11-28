(function(global, parser){

// The current verion of braingolfpp.
var version = "1.00.00.00";

parser.Command.base = {
  "+": function(tkn,prgm) { var v = prgm.current_cell().increment(tkn,prgm); prgm.current_cell().value = v; },
  "-": function(tkn,prgm) { var v = prgm.current_cell().decrement(tkn,prgm); prgm.current_cell().value = v; },
  ">": function(tkn,prgm) { prgm.move_right() },
  "<": function(tkn,prgm) { prgm.move_left() },
  "[": function(tkn,prgm) {
    tkn.next_token =
    prgm.current_cell().is_non_zero(tkn,prgm) ? tkn.branches.at(0): tkn.branches.at(1).branches.at(1)
  },
  "]": function(tkn,prgm) { },
  ".": function(tkn,prgm) {
    var a = prgm.current_cell().printify(tkn,prgm);
    for(var i = 0, l = a.length; i < l; ++i) {
      prgm.outputs.back(a[i]);
    }
  },
  ",": function(tkn,prgm) { },
  "ƒ": function(tkn,prgm) { prgm.flip_dim(); },
  "'": function(tkn,prgm) {
    var cell = prgm.current_cell();
    if(cell.has()) {
      cell.value = cell.stringify(tkn,prgm);
    } else {
      cell.value = new Cell.types.STRING();
    }
  },
  "#": function(tkn,prgm) {
    var cell = prgm.current_cell();
    if(cell.has()) {
      cell.value = cell.numberify(tkn,prgm)[0];
    } else {
      cell.value = new Cell.types.NUMBER();
    }
  }
}

parser.Symbols["+"] = new parser.Pipe();
parser.Symbols["-"] = new parser.Pipe();
parser.Symbols[">"] = new parser.Pipe();
parser.Symbols["<"] = new parser.Pipe();
parser.Symbols["["] = new parser.Pipe();
parser.Symbols["]"] = new parser.Pipe();
parser.Symbols["."] = new parser.Pipe();
parser.Symbols[","] = new parser.Pipe();
parser.Symbols["ƒ"] = new parser.Pipe();
parser.Symbols["'"] = new parser.Pipe();
parser.Symbols["#"] = new parser.Pipe();

parser.Symbols["+"].front(function(cmd) {
  cmd.execute = parser.Command.base["+"];
});
parser.Symbols["-"].front(function(cmd) {
  cmd.execute = parser.Command.base["-"];
});
parser.Symbols[">"].front(function(cmd) {
  cmd.execute = parser.Command.base[">"];
});
parser.Symbols["<"].front(function(cmd) {
  cmd.execute = parser.Command.base["<"];
});
parser.Symbols["["].front(function(cmd) {
  cmd.execute = parser.Command.base["["];
  // Need to save to call the base tokenize.
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn) {
    tkn.next_token = tkn.branches.at(0);
    tkn.next = function() { return tkn.next_token; }
    return temp(tkn);
  }
});
parser.Symbols["]"].front(function(cmd) {
  cmd.execute = parser.Command.base["]"];
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn) {
    var p = tkn.parent;
    while(p.literal !== "[" || p.branches.length() !== 1) {
      p = p.parent;
    }
    p.branches.back(tkn);
    tkn.branches.back(p);
    tkn.next = function(){return p;};
    return temp(tkn);
  }
});
parser.Symbols["."].front(function(cmd) {
  cmd.execute = parser.Command.base["."];
});
parser.Symbols[","].front(function(cmd) {
  cmd.execute = parser.Command.base[","];
});
parser.Symbols["ƒ"].front(function(cmd) {
  cmd.execute = parser.Command.base["ƒ"];
});
parser.Symbols["'"].front(function(cmd) {
  cmd.execute = parser.Command.base["'"];
});
parser.Symbols["#"].front(function(cmd) {
  cmd.execute = parser.Command.base["#"];
});

//-----------------------------------------------------------------------------
function Cell(x,y) {
  this.x = x;
  this.y = y;
  this.value = undefined;
}
Cell.defaults = new parser.Pipe();
Cell.types = {}
Cell.characters = [
'¡','¢','£','¤','¥','¦','©','¬','®','µ','\n','¿','€','Æ','Ç','Ð',
'Ñ','×','Ø','Œ','Þ','ß','æ','ç','ð','ı','ȷ','ñ','÷','ø','œ','þ',
' ','!','"','#','$','%','&',"'",'(',')','*','+',',','-','.','/',
'0','1','2','3','4','5','6','7','8','9',':',';','<','=','>','?',
'@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
'P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^','_',
'`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
'p','q','r','s','t','u','v','w','x','y','z','{','|','}','~','½',
'°','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','⁺','⁻','⁼','⁽','⁾','Ɓ',
'Ƈ','Ɗ','Ƒ','Ɠ','Ƙ','¶','Ɲ','Ƥ','Ƭ','Ʋ','Ȥ','ɓ','ƈ','ɗ','ƒ','ɠ',
'ɦ','ƙ','ɱ','ɲ','ƥ','ʠ','ɼ','ʂ','ƭ','ʋ','ȥ','Ạ','Ḅ','Ḍ','Ẹ','Ḥ',
'Ị','Ḳ','Ḷ','Ṃ','Ṇ','Ọ','Ṛ','Ṣ','Ṭ','Ụ','Ṿ','Ẉ','Ỵ','Ẓ','Ȧ','Ḃ',
'Ċ','Ḋ','Ė','Ḟ','Ġ','Ḣ','İ','Ŀ','Ṁ','Ṅ','Ȯ','Ṗ','Ṙ','Ṡ','Ṫ','Ẇ',
'Ẋ','Ẏ','Ż','ạ','ḅ','ḍ','ẹ','ḥ','ị','ḳ','ḷ','ṃ','ṇ','ọ','ṛ','ṣ',
'ṭ','ụ','ṿ','ẉ','ỵ','ẓ','ȧ','ḃ','ċ','ḋ','ė','ḟ','ġ','ḣ','ŀ','ṁ',
'ṅ','ȯ','ṗ','ṙ','ṡ','ṫ','ẇ','ẋ','ẏ','ż','«','»','‘','’','“','”'
];
(function() {
  Cell.values = {length:Cell.characters.length};
  for(var i = Cell.characters.length; i--;) {
    // Added to fix strange browser bug where adds a character
    // at the beginning of some of the special characters.
    if(Cell.characters[i].length !== 1) {
      Cell.characters[i] = Cell.characters[i].substr(1,1);
    }
    Cell.values[Cell.characters[i]] = i;
  }
})()
Cell.prototype.has = function() {
  return this.value !== undefined;
}
Cell.prototype.content = function() {
  if(!this.has()) this.value = new (Cell.defaults.at(0));
  return this.value;
}
Cell.prototype.increment = function(tkn,prgm) {
  return this.content().increment(this,tkn,prgm);
}
Cell.prototype.decrement = function(tkn,prgm) {
  return this.content().decrement(this,tkn,prgm);
}
Cell.prototype.is_non_zero = function(tkn,prgm) {
  return this.content().is_non_zero(this,tkn,prgm);
}
Cell.prototype.printify = function(tkn,prgm) {
  return this.content().printify(this,tkn,prgm);
}
Cell.prototype.stringify = function(tkn,prgm) {
  return this.content().stringify(this,tkn,prgm);
}
Cell.prototype.byteify = function(tkn,prgm) {
  return this.content().byteify(this,tkn,prgm);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cell.types.NUMBER = function(v) { this.value = v || 0; }
Cell.types.NUMBER.prototype.type = "NUMBER";
Cell.defaults.front(Cell.types.NUMBER);
Cell.types.NUMBER.prototype.toString = function() {
  return this.stringify().value;
}
Cell.types.NUMBER.prototype.increment = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(this.value + 1);
}
Cell.types.NUMBER.prototype.decrement = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(this.value - 1);
}
Cell.types.NUMBER.prototype.is_non_zero = function(cell,tkn,prgm) {
  return !this.value;
}
Cell.types.NUMBER.prototype.printify = function(cell,tkn,prgm) {
  return [new Cell.types.NUMBER(this.value)];
}
Cell.types.NUMBER.prototype.stringify = function(cell,tkn,prgm) {
  return new Cell.types.STRING(this.value+"");
}
Cell.types.NUMBER.prototype.numberify = function(cell,tkn,prgm) {
  return [new Cell.types.NUMBER(this.value)];
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cell.types.STRING = function(s) { this.value = s || ""; this.type = "STRING" }
Cell.types.STRING.prototype.toString = function() {
  return this.stringify().value;
}
Cell.types.STRING.prototype.increment = function(cell,tkn,prgm) {
  var obj = prgm.inputs.front();
  var value = this.value;
  if(obj) {
    obj = obj.stringify(cell,tkn,prgm);
    value += obj.value;
  }
  return new Cell.types.STRING(value);
}
Cell.types.STRING.prototype.decrement = function(cell,tkn,prgm) {
  prgm.inputs.front(new Cell.types.STRING(this.value[this.value.length-1]));
  return new Cell.types.STRING(this.value.slice(0,this.value.length-1));
}
Cell.types.STRING.prototype.is_non_zero = function(cell,tkn,prgm) {
  return !!this.value.length;
}
Cell.types.STRING.prototype.printify = function(cell,tkn,prgm) {
  return [new Cell.types.STRING(this.value)];
}
Cell.types.STRING.prototype.stringify = function(cell,tkn,prgm) {
  return new Cell.types.STRING(this.value);
}
Cell.types.STRING.prototype.numberify = function(cell,tkn,prgm) {
  var a = [];
  for(var i = this.value.length; i--;) {
    a.unshift(new Cell.types.NUMBER(+b));
  }
  return a;
}
//-----------------------------------------------------------------------------
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
  this.dimlr = "y";
  this.dimud = "x";
  this.pos = { x:0, y: 0 };
  // Does the path instantiation onto the Program object.
  parser.Path.apply(this, [code]);
}
// Makes them appear to be the same class.
Program.prototype = parser.Path.prototype;
Program.prototype.move_left = function() {
  --this.pos[this.dimlr];
}
Program.prototype.move_right = function() {
  ++this.pos[this.dimlr];
}
Program.prototype.move_up = function() {
  ++this.pos[this.dimud];
}
Program.prototype.move_down = function() {
  --this.pos[this.dimud];
}
Program.prototype.flip_dim = function() {
  var temp = this.dimud;
  this.dimud = this.dimlr;
  this.dimlr = temp
}
Program.prototype.current_cell = function() {
  return this.memory.access(this.pos)
}

//-----------------------------------------------------------------------------
// The main function for processing and executing the code.
var braingolfpp = function(code) {
  return new Program(code);
}

//-----------------------------------------------------------------------------
// Sets all of the global variables defined earlier.
braingolfpp.Memory = Memory;
braingolfpp.Cell = Cell;
braingolfpp.version = version;
global.braingolfpp = braingolfpp;

})(this, this.parser)
