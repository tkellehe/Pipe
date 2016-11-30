(function(global, parser){

// The current verion of pipe.
var version = "1.00.00.00";

parser.Command.internal = {
  pipe_oi: function(tkn,prgm) {
    if(tkn.parent === undefined) {
      tkn.inputs.pipe(prgm.inputs.copy());
    } else {
      tkn.inputs.pipe(tkn.parent.outputs);
    }
  },
  pipe_io: function(tkn,prgm) {
    tkn.outputs.pipe(tkn.inputs);
  }
}
parser.Command.base = {
  "+": function(tkn,prgm) {
    var v = prgm.current_cell().increment(tkn,prgm);
    prgm.current_cell().value = v;
  },
  "-": function(tkn,prgm) {
    var v = prgm.current_cell().decrement(tkn,prgm);
    prgm.current_cell().value = v;
  },
  ">": function(tkn,prgm) { prgm.move_right() },
  "<": function(tkn,prgm) { prgm.move_left() },
  "[": function(tkn,prgm) {
    tkn.next_token =
    prgm.current_cell().is_non_zero(tkn,prgm) ? tkn.branches.at(0): tkn.branches.at(1).branches.at(1)
  },
  "]": function(tkn,prgm) {},
  ":": function(tkn,prgm) {
    prgm.outputs.back(prgm.current_cell().copy(tkn,prgm));
  },
  ".": function(tkn,prgm) {
    tkn.outputs.back(prgm.current_cell().copy(tkn,prgm));
  },
  ",": function(tkn,prgm) {
    prgm.current_cell().value = tkn.inputs.front();
  },
  ";": function(tkn,prgm) {
    prgm.current_cell().value = prgm.inputs.front();
  },
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
      cell.value = cell.numberify(tkn,prgm);
    } else {
      cell.value = new Cell.types.NUMBER();
    }
  },
  "@": function(tkn,prgm) {
    var cell = prgm.current_cell();
    if(cell.has()) {
      cell.value = cell.arrayify(tkn,prgm);
    } else {
      cell.value = new Cell.types.ARRAY();
    }
  },
  "ç": function(tkn,prgm) {
    delete prgm.current_cell().value;
  },
  '"': function(tkn,prgm) {
    tkn.outputs.back(new Cell.types.STRING(tkn.content));
  },
  "w": function(tkn,prgm) { },
  "W": function(tkn,prgm) {
    prgm.outputs.wipe()
  },
  " ": function(tkn,prgm) { }
}

parser.Symbols["+"] = new parser.Pipe();
parser.Symbols["-"] = new parser.Pipe();
parser.Symbols[">"] = new parser.Pipe();
parser.Symbols["<"] = new parser.Pipe();
parser.Symbols["["] = new parser.Pipe();
parser.Symbols["]"] = new parser.Pipe();
parser.Symbols[":"] = new parser.Pipe();
parser.Symbols["."] = new parser.Pipe();
parser.Symbols[","] = new parser.Pipe();
parser.Symbols[";"] = new parser.Pipe();
parser.Symbols["ƒ"] = new parser.Pipe();
parser.Symbols["'"] = new parser.Pipe();
parser.Symbols["#"] = new parser.Pipe();
parser.Symbols["@"] = new parser.Pipe();
parser.Symbols[" "] = new parser.Pipe();
parser.Symbols["ç"] = new parser.Pipe();
parser.Symbols['"'] = new parser.Pipe();
parser.Symbols['w'] = new parser.Pipe();
parser.Symbols['W'] = new parser.Pipe();

parser.Symbols["+"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["+"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["-"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["-"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols[">"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base[">"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["<"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["<"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["["].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["["];
  // Need to save to call the base tokenize.
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn) {
    tkn.next_token = tkn.branches.at(0);
    tkn.next = function() { return tkn.next_token; }
    return temp.call(this, tkn);
  }
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["]"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
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
    return temp.call(this, tkn);
  }
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols[":"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base[":"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["."].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["."];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols[";"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base[";"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols[","].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base[","];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["ƒ"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["ƒ"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["'"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["'"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["#"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["#"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["@"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["@"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols[" "].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base[" "];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["ç"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["ç"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["W"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["W"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["w"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["w"];
});
parser.Symbols['"'].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base['"'];
  
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn,prgm) {
    tkn.content = "";
    for(var i = tkn.end+1; i < tkn.code.length && (tkn.code[i] !== "\n");++i) {
        tkn.content += tkn.code[i];
    }
    tkn.end = tkn.start + tkn.content.length + 1; // +1 for the line feed.
    return temp.call(this, tkn);
  }
  
  cmd.execute = parser.Command.internal.pipe_io;
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
Cell.prototype.copy = function(tkn,prgm) {
  return this.content().copy(this,tkn,prgm);
}
Cell.prototype.stringify = function(tkn,prgm) {
  return this.content().stringify(this,tkn,prgm);
}
Cell.prototype.numberify = function(tkn,prgm) {
  return this.content().numberify(this,tkn,prgm);
}
Cell.prototype.arrayify = function(tkn,prgm) {
  return this.content().arrayify(this,tkn,prgm);
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
  return !!this.value;
}
Cell.types.NUMBER.prototype.copy = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(this.value);
}
Cell.types.NUMBER.prototype.stringify = function(cell,tkn,prgm) {
  return new Cell.types.STRING(this.value+"");
}
Cell.types.NUMBER.prototype.numberify = function(cell,tkn,prgm) {
  return this.copy(cell,tkn,prgm);
}
Cell.types.NUMBER.prototype.arrayify = function(cell,tkn,prgm) {
  return new Cell.types.ARRAY([this.copy(cell,tkn,prgm)]);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cell.types.STRING = function(s) { this.value = s || ""; }
Cell.types.STRING.prototype.type = "STRING";
Cell.types.STRING.prototype.toString = function() {
  return this.stringify().value;
}
Cell.types.STRING.prototype.increment = function(cell,tkn,prgm) {
  var obj = tkn.inputs.front();
  var value = this.value;
  if(obj) {
    obj = obj.stringify(cell,tkn,prgm);
    if(obj.type === "ARRAY") {
      for(var i = 0,l = obj.value.length;i < l;++i)
        value += obj.value[i].value;
    } else if(obj.type === "STRING") {
      value += obj.value;
    }
  }
  return new Cell.types.STRING(value);
}
Cell.types.STRING.prototype.decrement = function(cell,tkn,prgm) {
  tkn.outputs.front(new Cell.types.STRING(this.value[0]));
  return new Cell.types.STRING(this.value.slice(1,this.value.length));
}
Cell.types.STRING.prototype.is_non_zero = function(cell,tkn,prgm) {
  return !!this.value.length;
}
Cell.types.STRING.prototype.copy = function(cell,tkn,prgm) {
  return new Cell.types.STRING(this.value);
}
Cell.types.STRING.prototype.stringify = function(cell,tkn,prgm) {
  return this.copy(cell,tkn,prgm);
}
Cell.types.STRING.prototype.numberify = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(+this.value);
}
Cell.types.STRING.prototype.arrayify = function(cell,tkn,prgm) {
  return new Cell.types.ARRAY([this.copy(cell,tkn,prgm)]);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cell.types.ARRAY = function(s) { this.value = s || []; }
Cell.types.ARRAY.prototype.type = "ARRAY";
Cell.types.ARRAY.prototype.toString = function() {
  var a = this.stringify(), v = "";
  for(var i = 0, l = a.value.length; i < l; ++i) v += a.value[i].value;
  return v;
}
Cell.types.ARRAY.prototype.increment = function(cell,tkn,prgm) {
  var obj = tkn.inputs.front();
  var value = this.copy();
  if(obj) {
    value.value.push(obj);
  }
  return value;
}
Cell.types.ARRAY.prototype.decrement = function(cell,tkn,prgm) {
  tkn.outputs.front(this.value[0].copy(cell,tkn,prgm));
  return new Cell.types.ARRAY(this.value.slice(1,this.value.length));
}
Cell.types.ARRAY.prototype.is_non_zero = function(cell,tkn,prgm) {
  return !!this.value.length;
}
Cell.types.ARRAY.prototype.copy = function(cell,tkn,prgm) {
  var a = [];
  for(var i = this.value.length;i--;) a.unshift(this.value[i].copy(cell,tkn,prgm));
  return new Cell.types.ARRAY(a);
}
Cell.types.ARRAY.prototype.stringify = function(cell,tkn,prgm) {
  var a = [];
  for(var i = this.value.length;i--;) a.unshift(this.value[i].stringify(cell,tkn,prgm));
  return new Cell.types.ARRAY(a);
}
Cell.types.ARRAY.prototype.numberify = function(cell,tkn,prgm) {
  var a = [];
  for(var i = this.value.length;i--;) a.unshift(this.value[i].numberify(cell,tkn,prgm));
  return new Cell.types.ARRAY(a);
}
Cell.types.ARRAY.prototype.arrayify = function(cell,tkn,prgm) {
  return this.copy(cell,tkn,prgm);
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
// The main class for starting the program.
function Program(code) {
  this.memory = new Memory();
  this.dimlr = "y";
  this.dimud = "x";
  this.pos = { x:0, y: 0 };
  // Does the path instantiation onto the Program object.
  parser.Path.apply(this, [code]);
  
  // Allows for the pipe to move into the outputs.
  this.exit.cmd.execute = function(tkn,prgm) {
    prgm.outputs.pipe(tkn.outputs)
  }
}
// Makes them appear to be the same class.
Program.prototype = parser.Path.prototype;
Program.prototype.addArg = function(arg) {
  this.inputs.back(arg);
}
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
var pipe = function(code) {
  return new Program(code);
}

//-----------------------------------------------------------------------------
// Sets all of the global variables defined earlier.
pipe.Memory = Memory;
pipe.Cell = Cell;
pipe.version = version;
global.pipe = pipe;

})(this, this.parser)
