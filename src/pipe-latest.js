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
  "+,": function(tkn,prgm) {
    var f = tkn.inputs.front();
    if(f === undefined) {
      f = Cell.create_default();
    }
    tkn.outputs.back(f.increment(undefined,tkn,prgm));
  },
  "-,": function(tkn,prgm) {
    var f = tkn.inputs.front();
    if(f === undefined) {
      f = Cell.create_default();
    }
    tkn.outputs.back(f.decrement(undefined,tkn,prgm));
  },
  ">": function(tkn,prgm) { prgm.move_right() },
  "<": function(tkn,prgm) { prgm.move_left() },
  "[": function(tkn,prgm) {
    // First must carry over any items from the ']'.
    var end = tkn.branches.at(1);
    tkn.inputs.pipe(end.outputs);
    if(prgm.current_cell().is_non_zero(tkn,prgm)) {
      tkn.next_token = tkn.branches.at(0);
    } else {
      tkn.next_token = end.branches.at(1);
      // Go ahead and pipe everything correctly.
      tkn.outputs.pipe(tkn.inputs);
      end.inputs.pipe(tkn.outputs);
      end.execute(end,prgm);
    }
  },
  "]": function(tkn,prgm) {},
  "{": function(tkn,prgm) {
    // First must carry over any items from the '}'.
    var end = tkn.branches.at(1);
    tkn.inputs.pipe(end.outputs);
    var f = tkn.inputs.front();
    if(f !== undefined && f.is_non_zero(undefined,tkn,prgm)) {
      tkn.next_token = tkn.branches.at(0);
      // Puts the item back into the pipe.
      tkn.inputs.front(f);
    } else {
      tkn.next_token = end.branches.at(1);
      
      // Does not put item back into pipe.
      
      // Go ahead and pipe everything correctly.
      tkn.outputs.pipe(tkn.inputs);
      end.inputs.pipe(tkn.outputs);
      end.execute(end,prgm);
    }
  },
  "}": function(tkn,prgm) {},
  ":": function(tkn,prgm) {
    var cell = prgm.current_cell();
    if(cell.has()) {
      prgm.outputs.back(cell.copy(tkn,prgm));
    } else {
      prgm.outputs.back(Cell.create_default());
    }
  },
  ".": function(tkn,prgm) {
    var cell = prgm.current_cell();
    if(cell.has()) {
      tkn.outputs.back(cell.copy(tkn,prgm));
    } else {
      tkn.outputs.back(Cell.create_default());
    }
  },
  ".,": function(tkn,prgm) {
    var f = tkn.inputs.front();
    if(f === undefined) {
      tkn.outputs.back(Cell.create_default());
    } else {
      tkn.outputs.back(f.copy(undefined,tkn,prgm));
      tkn.inputs.front(f);
    }
  },
  ",": function(tkn,prgm) {
    prgm.current_cell().value = tkn.inputs.front();
  },
  ";": function(tkn,prgm) {
    prgm.current_cell().value = prgm.inputs.front();
  },
  "f": function(tkn,prgm) { prgm.flip_dim(); },
  "'": function(tkn,prgm) {
    if(tkn.content === undefined) {
      var cell = prgm.current_cell();
      if(cell.has()) {
        cell.value = cell.stringify(tkn,prgm);
      } else {
        cell.value = new Cell.types.STRING();
      }
    } else {
      tkn.outputs.back(new Cell.types.STRING(tkn.content));
    }
  },
  "',": function(tkn,prgm) {
    var f = tkn.inputs.front();
    if(f === undefined) {
      f = new Cell.type.STRING();
    } else {
      f = f.stringify(tkn,prgm);
    }
    tkn.outputs.back(f);
  },
  "#": function(tkn,prgm) {
    if(tkn.content === undefined) {
      var cell = prgm.current_cell();
      if(cell.has()) {
        cell.value = cell.numberify(tkn,prgm);
      } else {
        cell.value = new Cell.types.NUMBER();
      }
    } else {
      tkn.outputs.back(new Cell.types.NUMBER(tkn.content));
    }
  },
  "#,": function(tkn,prgm) {
    var f = tkn.inputs.front();
    if(f === undefined) {
      f = new Cell.type.NUMBER();
    } else {
      f = f.numberify(tkn,prgm);
    }
    tkn.outputs.back(f);
  },
  "@": function(tkn,prgm) {
    if(tkn.content === undefined) {
      var cell = prgm.current_cell();
      if(cell.has()) {
        cell.value = cell.arrayify(tkn,prgm);
      } else {
        cell.value = new Cell.types.ARRAY();
      }
    } else if(typeof tkn.content === "number") {
      var cell = prgm.current_cell();
      if(cell.has()) {
        tkn.outputs.back(cell.index(tkn,prgm,tkn.content));
      } else {
        tkn.outputs.back(new Cell.types.ARRAY());
      }
    } else if(tkn.content instanceof Array) {
      // Must be a range of numbers.
      if(typeof tkn.content[0] === "number") {
        var cell = prgm.current_cell();
        if(cell.has()) {
          var range = cell.range(tkn,prgm,tkn.content);
          for(var i = 0; i < range.length; ++i)
            tkn.outputs.back(range[i]);
        } else {
          for(var i = 0; i < tkn.content.length; ++i)
            tkn.outputs.back(new Cell.types.ARRAY());
        }
      }
    }
  },
  "@,": function(tkn,prgm) {
    var f = tkn.inputs.front();
    if(f === undefined) {
      tkn.outputs.back(new Cell.types.ARRAY());
    } else if(f.type === "NUMBER") {
      var cell = prgm.current_cell();
      if(cell.has()) {
        tkn.outputs.back(cell.index(tkn,prgm,f.value));
      } else {
        tkn.outputs.back(f.arrayify(tkn,prgm));
      }
    } else if(f.type === "STRING") {
      tkn.outputs.back(f.arrayify(tkn,prgm));
    } else if(f.type === "ARRAY") {
      // Must be a range of numbers.
      var temp = f.integerify(undefined,tkn,prgm);
      var cell = prgm.current_cell();
      if(cell.has()) {
        (function loop0(array) {
          for(var i = 0; i < array.value.length; ++i) {
            if(array.value[i].type === "ARRAY") {
              loop0(array.value[i]);
            } else {
              tkn.outputs.back(cell.index(tkn,prgm,array.value[i]));
            }
          }
        })(temp);
      } else {
        (function loop1(array) {
          for(var i = 0; i < array.value.length; ++i) {
            if(array.value[i].type === "ARRAY") {
              loop1(array.value[i]);
            } else {
              tkn.outputs.back(new Cell.types.ARRAY());
            }
          }
        })(temp);
      }
    }
  },
  "@,,": function(tkn,prgm) {
    var f = tkn.inputs.front(),
        g = tkn.inputs.front();
    if(f === undefined) {
      tkn.outputs.back(new Cell.types.ARRAY());
    } else if(g === undefined) {
      if(f.type === "NUMBER") {
        var cell = prgm.current_cell();
        if(cell.has()) {
          tkn.outputs.back(cell.index(tkn,prgm,f.value));
        } else {
          tkn.outputs.back(f.arrayify(tkn,prgm));
        }
      } else if(f.type === "STRING") {
        tkn.outputs.back(f.arrayify(tkn,prgm));
      } else if(f.type === "ARRAY") {
        // Must be a range of numbers.
        var temp = f.integerify(undefined,tkn,prgm);
        var cell = prgm.current_cell();
        if(cell.has()) {
          (function loop0(array) {
            for(var i = 0; i < array.value.length; ++i) {
              if(array.value[i].type === "ARRAY") {
                loop0(array.value[i]);
              } else {
                tkn.outputs.back(cell.index(tkn,prgm,array.value[i]));
              }
            }
          })(temp);
        } else {
          (function loop1(array) {
            for(var i = 0; i < array.value.length; ++i) {
              if(array.value[i].type === "ARRAY") {
                loop1(array.value[i]);
              } else {
                tkn.outputs.back(new Cell.types.ARRAY());
              }
            }
          })(temp);
        }
      }
    // f and g have been provided, therein we got a lot of work to do...
    } else if(f.type === "NUMBER" && g.type !== "NUMBER") {
      tkn.outputs.back(g.index(undefined,tkn,prgm,f.value));
    } else if(f.type === "NUMBER" && g.type === "NUMBER") {
      // Handle case for if it is a range.
      var a = [];
      // f is left and g is right.
      if(f.value < g.value) {
        for(var i = f.value; i <= g.value; ++i) a.push(i);
      } else {
        for(var i = f.value; g.value <= i; --i) a.push(i);
      }
      var cell = prgm.current_cell();
      if(cell.has()) {
        var range = cell.range(tkn,prgm,a);
        for(var i = 0; i < range.length; ++i)
          tkn.outputs.back(range[i]);
      } else {
        for(var i = 0; i < a.length; ++i)
          tkn.outputs.back(new Cell.types.ARRAY());
      }
    } else if(f.type === "ARRAY") {
      // Must be a range of numbers.
      var temp = f.integerify(undefined,tkn,prgm);
      (function loop(array) {
        for(var i = 0; i < array.value.length; ++i) {
          if(array.value[i].type === "ARRAY") {
            loop(array.value[i]);
          } else {
            tkn.outputs.back(g.index(undefined,tkn,prgm,array.value[i]));
          }
        }
      })(temp);
    } else {
      // Final case is to arrayify both then concat.
      f = f.arrayify(undefined,tkn,prgm);
      g = g.arrayify(undefined,tkn,prgm);
      tkn.outputs.back(new Cell.types.ARRAY(f.value.concat(g.value)));
    }
  },
  "I": function(tkn,prgm) {
    if(tkn.content === undefined) {
      var cell = prgm.current_cell();
      if(cell.has()) {
        cell.value = cell.integerify(tkn,prgm);
      } else {
        cell.value = new Cell.types.NUMBER();
      }
    } else {
      tkn.outputs.back(new Cell.types.NUMBER(tkn.content));
    }
  },
  "c": function(tkn,prgm) {
    delete prgm.current_cell().value;
  },
  '"': function(tkn,prgm) {
    tkn.outputs.back(new Cell.types.STRING(tkn.content));
  },
  'n': function(tkn,prgm) {
    tkn.outputs.back(new Cell.types.STRING("\n"));
  },
  "b": function(tkn,prgm) { },
  "W": function(tkn,prgm) {
    prgm.outputs.wipe()
  },
  "l": function(tkn,prgm) {
    var cell = prgm.current_cell();
    if(cell.has()) {
      tkn.outputs.back(cell.length(tkn,prgm));
    } else {
      tkn.outputs.back(new Cell.types.NUMBER());
    }
  },
  "l,": function(tkn,prgm) {
    var f = tkn.inputs.front();
    if(f !== undefined) {
      tkn.outputs.back(f.length(undefined,tkn,prgm));
      tkn.inputs.front(f);
    } else {
      tkn.outputs.back(new Cell.types.NUMBER());
    }
  },
  "d": function(tkn,prgm) {
    tkn.inputs.front();
  },
  "e": function(tkn,prgm) {
    var f = tkn.inputs.front(),
        g = tkn.inputs.front();
    if(f === undefined) {
      if(g !== undefined) {
        tkn.inputs.front(g);
      }
    } else if(g === undefined) {
      tkn.inputs.front(f);
    } else {
      // Reverse g and f.
      tkn.inputs.front(f);
      tkn.inputs.front(g);
    }
  },
  "E": function(tkn,prgm) {
    var f = tkn.inputs.front(),
        g = tkn.inputs.back();
    if(f === undefined) {
      if(g !== undefined) {
        tkn.inputs.front(g);
      }
    } else if(g === undefined) {
      tkn.inputs.back(f);
    } else {
      // Reverse g and f.
      tkn.inputs.back(f);
      tkn.inputs.front(g);
    }
  },
  "//": function(tkn,prgm) { },
  "&": function(tkn,prgm) {
    var cell = prgm.current_cell();
    if(cell.has()) {
      tkn.outputs.back(new Cell.types.REFERENCE(cell.value));
    } else {
      var f = tkn.inputs.front();
      if(f !== undefined) {
        tkn.outputs.back(new Cell.types.REFERENCE(f));
        tkn.inputs.front(f);
      }
    }
  },
  "\n": function(tkn,prgm) { },
  " ": function(tkn,prgm) { }
}

parser.Symbols["+"] = new parser.Pipe();
parser.Symbols["-"] = new parser.Pipe();
parser.Symbols[">"] = new parser.Pipe();
parser.Symbols["<"] = new parser.Pipe();
parser.Symbols["["] = new parser.Pipe();
parser.Symbols["]"] = new parser.Pipe();
parser.Symbols["{"] = new parser.Pipe();
parser.Symbols["}"] = new parser.Pipe();
parser.Symbols[":"] = new parser.Pipe();
parser.Symbols["."] = new parser.Pipe();
parser.Symbols[","] = new parser.Pipe();
parser.Symbols[";"] = new parser.Pipe();
parser.Symbols["f"] = new parser.Pipe();
parser.Symbols["'"] = new parser.Pipe();
parser.Symbols["#"] = new parser.Pipe();
parser.Symbols["@"] = new parser.Pipe();
parser.Symbols[" "] = new parser.Pipe();
parser.Symbols["c"] = new parser.Pipe();
parser.Symbols['"'] = new parser.Pipe();
parser.Symbols['b'] = new parser.Pipe();
parser.Symbols['W'] = new parser.Pipe();
parser.Symbols['//'] = new parser.Pipe();
parser.Symbols['\n'] = new parser.Pipe();
parser.Symbols['n'] = new parser.Pipe();
parser.Symbols['I'] = new parser.Pipe();
parser.Symbols['l'] = new parser.Pipe();
parser.Symbols['l,'] = new parser.Pipe();
parser.Symbols['d'] = new parser.Pipe();
parser.Symbols['#,'] = new parser.Pipe();
parser.Symbols["',"] = new parser.Pipe();
parser.Symbols["@,"] = new parser.Pipe();
parser.Symbols["+,"] = new parser.Pipe();
parser.Symbols["-,"] = new parser.Pipe();
parser.Symbols[".,"] = new parser.Pipe();
parser.Symbols["@,,"] = new parser.Pipe();
parser.Symbols["e"] = new parser.Pipe();
parser.Symbols["E"] = new parser.Pipe();

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
parser.Symbols["+,"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["+,"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["-,"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["-,"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols[".,"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base[".,"];
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
parser.Symbols["{"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["{"];
  // Need to save to call the base tokenize.
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn) {
    tkn.next_token = tkn.branches.at(0);
    tkn.next = function() { return tkn.next_token; }
    return temp.call(this, tkn);
  }
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["}"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["}"];
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn) {
    var p = tkn.parent;
    while(p.literal !== "{" || p.branches.length() !== 1) {
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
parser.Symbols["f"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["f"];
  cmd.execute = parser.Command.internal.pipe_io;
});

parser.Symbols["I"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["I"];
  
  var checkR = /[0-9]/;
  function check(c) { return !!checkR.exec(c); }
  
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn,prgm) {
    tkn.content = "";
    var offset = 1;
    if(tkn.code[tkn.end+1] === "-") { tkn.content = "-"; ++offset; }
    for(var i = tkn.end+offset; i < tkn.code.length && check(tkn.code[i]);++i) {
      tkn.content += tkn.code[i];
    }
    // Remove the '-' if it ends with one.
    if(tkn.content[tkn.content.length-1] === "-") tkn.content = "";
    // If the content is empty then do nothing.
    if(tkn.content.length === 0) {
      tkn.content = undefined;
    } else {
      tkn.end = tkn.start + tkn.content.length + (tkn.literal.length-1);
      // Turn it into a number.
      tkn.content = +tkn.content;
    }
    
    return temp.call(this, tkn);
  }
  
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["'"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["'"];
  
  var checkR = /[a-zA-Z0-9_ ]/;
  function check(c) { return !!checkR.exec(c); }
  
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn,prgm) {
    tkn.content = "";
    for(var i = tkn.end+1; i < tkn.code.length && check(tkn.code[i]);++i) {
      tkn.content += tkn.code[i];
    }
    // If the content is empty then do nothing.
    if(tkn.content.length === 0) {
      tkn.content = undefined;
    } else {
      tkn.end = tkn.start + tkn.content.length + (tkn.literal.length-1);
    }
    
    return temp.call(this, tkn);
  }
  
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["#"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["#"];
  
  var checkR = /[\d\.\-]/;
  function check(c) { return !!checkR.exec(c); }
  
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn,prgm) {
    tkn.content = "";
    var found = 0, offset = 1;
    if(tkn.code[tkn.end+1] === "-") { tkn.content = "-"; ++offset; }
    for(var i = tkn.end+offset; i < tkn.code.length && check(tkn.code[i]) && found < 2;++i) {
      if(tkn.code[i] === ".") ++found;
      tkn.content += tkn.code[i];
    }
    // Remove the '.' or '-' if it ends with one.
    while(tkn.content[tkn.content.length-1] === "." || tkn.content[tkn.content.length-1] === "-")
      tkn.content = tkn.content.slice(0,tkn.content.length-1);
    // If the content is empty then do nothing.
    if(tkn.content.length === 0) {
      tkn.content = undefined;
    } else {
      tkn.end = tkn.start + tkn.content.length + (tkn.literal.length-1);
      // Turn it into a number.
      tkn.content = +tkn.content;
    }
    
    return temp.call(this, tkn);
  }
  
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["@"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["@"];
  
  var checkDigitR = /[0-9]/;
  function checkDigit(c) { return !!checkDigitR.exec(c); }
  
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn,prgm) {
    tkn.content = "";
    
    var which = "NONE";
    
    //*************************************************************************
    // Tries to get a range.
    var offset = 1, bail = false;
    if(tkn.code[tkn.end+1] === "-") {
      tkn.content = "-";
      if(checkDigit(tkn.code[tkn.end+2])) {
        tkn.content += tkn.code[tkn.end+2];
      } else {
        bail = true;
      }
      offset+=2;
    }
    if(!bail) {
      var mid = -1;
      for(var i = tkn.end+offset; i < tkn.code.length;++i) {
        if(checkDigit(tkn.code[i])) {
          tkn.content += tkn.code[i];
        } else if(tkn.code[i] === "-") {
          if(mid === -1) {
            mid = tkn.content.length;
            tkn.content += "-";
            // If another dash after go ahead and get it.
            if(tkn.code[i+1] === "-") {
              ++i;
              tkn.content += "-";
            }
          } else {
            break;
          }
        }
      }
    }
    // If the last token is a minus then do not get a range.
    if(tkn.content[tkn.content.length-1] === "-" || mid === -1) tkn.content = "";

    if(tkn.content.length !== 0) which = "RANGE";
    
    //*************************************************************************
    if(which === "NONE") {
      // Tries to get an integer.
      var offset = 1;
      if(tkn.code[tkn.end+1] === "-") { tkn.content = "-"; ++offset; }
      for(var i = tkn.end+offset; i < tkn.code.length && checkDigit(tkn.code[i]);++i) {
        tkn.content += tkn.code[i];
      }
      // If the last token is a minus then do not get a number.
      if(tkn.content[tkn.content.length-1] === "-") tkn.content = "";

      if(tkn.content.length !== 0) which = "INTEGER";
    }
    //*************************************************************************
    
    if(which === "NONE") {
      tkn.content = undefined;
    } else if(which === "INTEGER") {
      tkn.end = tkn.start + tkn.content.length + (tkn.literal.length-1);
      tkn.content = +tkn.content;
    } else if(which === "RANGE") {
      tkn.end = tkn.start + tkn.content.length + (tkn.literal.length-1);
      var left = +tkn.content.slice(0,mid),
          right = +tkn.content.slice(mid+1);
      tkn.content = [];
      if(left < right) {
        for(var i = left; i <= right; ++i) tkn.content.push(i);
      } else {
        for(var i = left; right <= i; --i) tkn.content.push(i);
      }
    }
    
    return temp.call(this, tkn);
  }
  
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols[" "].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base[" "];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["\n"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["\n"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["n"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["n"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["c"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["c"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["W"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["W"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["b"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["b"];
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
    tkn.end = tkn.start + tkn.content.length + 1 + (tkn.literal.length-1); // +1 for the line feed.
    return temp.call(this, tkn);
  }
  
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols['//'].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base['//'];
  
  var temp = cmd.tokenize;
  cmd.tokenize = function(tkn,prgm) {
    tkn.content = "";
    for(var i = tkn.end+1; i < tkn.code.length && (tkn.code[i] !== "\n");++i) {
      tkn.content += tkn.code[i];
    }
    tkn.end = tkn.start + tkn.content.length + 1 + (tkn.literal.length-1); // +1 for the line feed.
    return temp.call(this, tkn);
  }
  
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["l"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["l"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["l,"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["l,"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["d"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["d"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["#,"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["#,"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["',"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["',"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["@,"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["@,"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["@,,"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["@,,"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["e"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["e"];
  cmd.execute = parser.Command.internal.pipe_io;
});
parser.Symbols["E"].front(function(cmd) {
  cmd.execute = parser.Command.internal.pipe_oi;
  cmd.execute = parser.Command.base["E"];
  cmd.execute = parser.Command.internal.pipe_io;
});

//-----------------------------------------------------------------------------
function Cell(x,y) {
  this.x = x;
  this.y = y;
  this.value = undefined;
}
Cell.defaults = new parser.Pipe();
Cell.create_default = function() {
  return new (Cell.defaults.at(0))();
}
Cell.types = {}
Cell.isType = function(o) {
  for(var i in Cell.types) {
    if(o instanceof Cell.types[i]) return true;
  }
  return false;
}
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
  if(!this.has()) this.value = Cell.create_default();
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
Cell.prototype.integerify = function(tkn,prgm) {
  return this.content().numberify(this,tkn,prgm);
}
Cell.prototype.arrayify = function(tkn,prgm) {
  return this.content().arrayify(this,tkn,prgm);
}
Cell.prototype.length = function(tkn,prgm) {
  return this.content().length(this,tkn,prgm);
}
Cell.prototype.index = function(tkn,prgm,i) {
  return this.content().index(this,tkn,prgm,i);
}
Cell.prototype.range = function(tkn,prgm,r) {
  return this.content().range(this,tkn,prgm,r);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cell.types.NUMBER = function(v) { this.value = v || 0; }
Cell.types.NUMBER.prototype.type = "NUMBER";
Cell.types.NUMBER.prototype.actual = "NUMBER";
Cell.defaults.front(Cell.types.NUMBER);
Cell.types.NUMBER.prototype.toString = function() {
  return this.stringify().value;
}
Cell.types.NUMBER.prototype.smallest_unit = function() {
  var s = this.value+"", i = s.search("\\.");
  if(i === -1) return 1;
  var l = i;
  for(var j = i+1;j<s.length;++j) {
    if(s[j] !== "0") l = j;
  }
  l -= i;
  s = "0.";
  for(;--l;) s+="0"
  s+="1";
  return +s;
}
Cell.types.NUMBER.prototype.increment = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(this.value + this.smallest_unit());
}
Cell.types.NUMBER.prototype.decrement = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(this.value - this.smallest_unit());
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
Cell.types.NUMBER.prototype.integerify = function(cell,tkn,prgm) {
  var copy = this.copy(cell,tkn,prgm);
  copy.value = Math.floor(copy.value);
  return copy;
}
Cell.types.NUMBER.prototype.arrayify = function(cell,tkn,prgm) {
  return new Cell.types.ARRAY([this.copy(cell,tkn,prgm)]);
}
Cell.types.NUMBER.prototype.length = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER((this.value+"").replace(".","").length);
}
Cell.types.NUMBER.prototype.index = function(cell,tkn,prgm,i) {
  var s = this.value + "",
  // Finds the decimal location.
      d = s.search("\\.");
  // Removes the decimal from the lookup.
  s = s.replace(".","");
  var l = s.length;
  // Make sure that d is not negative one.
  d = (d === -1) ? 0 : d;
  // Calculates the actual position of the digit.
  var c = s[l - (i + d) - 1];
  return new Cell.types.NUMBER((c === undefined) ? 0 : (+c * Math.pow(10,i)));
}
Cell.types.NUMBER.prototype.range = function(cell,tkn,prgm,r) {
  var d = 0;
  for(var i = 0; i < r.length; ++i) d += this.index(cell,tkn,prgm,r[i]).value;
  return [new Cell.types.NUMBER(d)];
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cell.types.STRING = function(s) { this.value = s || ""; }
Cell.types.STRING.prototype.type = "STRING";
Cell.types.STRING.prototype.actual = "STRING";
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
Cell.types.STRING.prototype.integerify = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(Math.floor(+this.value));
}
Cell.types.STRING.prototype.arrayify = function(cell,tkn,prgm) {
  return new Cell.types.ARRAY([this.copy(cell,tkn,prgm)]);
}
Cell.types.STRING.prototype.length = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(this.value.length);
}
Cell.types.STRING.prototype.index = function(cell,tkn,prgm,i) {
  return new Cell.types.STRING(this.value[i]);
}
Cell.types.STRING.prototype.range = function(cell,tkn,prgm,r) {
  var s = "";
  for(var i = 0; i < r.length; ++i) s += this.index(cell,tkn,prgm,r[i]).value;
  return [new Cell.types.STRING(s)];
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cell.types.ARRAY = function(a) { this.value = a || []; }
Cell.types.ARRAY.prototype.type = "ARRAY";
Cell.types.ARRAY.prototype.actual = "ARRAY";
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
Cell.types.ARRAY.prototype.integerify = function(cell,tkn,prgm) {
  var a = [];
  for(var i = this.value.length;i--;) a.unshift(this.value[i].integerify(cell,tkn,prgm));
  return new Cell.types.ARRAY(a);
}
Cell.types.ARRAY.prototype.arrayify = function(cell,tkn,prgm) {
  return this.copy(cell,tkn,prgm);
}
Cell.types.ARRAY.prototype.length = function(cell,tkn,prgm) {
  return new Cell.types.NUMBER(this.value.length);
}
Cell.types.ARRAY.prototype.index = function(cell,tkn,prgm,i) {
  var v = this.value[i];
  if(v === undefined) return new Cell.types.ARRAY();
  return v.copy(cell,tkn,prgm);
}
Cell.types.ARRAY.prototype.range = function(cell,tkn,prgm,r) {
  var a = [];
  for(var i = 0; i < r.length; ++i) a.push(this.index(cell,tkn,prgm,r[i]));
  return a;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Cell.types.REFERENCE = function(o) {
  // Forces the object created to be destroyed and undefined is returned.
  if(o === undefined || !Cell.isType(o)) return undefined;
  
  this.type = o.type;
  
  this.object = o;
  
  Object.definedProperty(this,"value",{
    get: function() {
      return o.value;
    },
    set: function(v) {
      o.value = v;
    },
    enumerable: true
  });
}
Cell.types.REFERENCE.prototype.actual = "REFERENCE";
Cell.types.REFERENCE.prototype.toString = function() {
  return this.object.toString();
}
Cell.types.REFERENCE.prototype.smallest_unit = function() {
  return this.object.smallest_unit();
}
Cell.types.REFERENCE.prototype.increment = function(cell,tkn,prgm) {
  this.object = this.object.increment(cell,tkn,prgm);
  return this;
}
Cell.types.REFERENCE.prototype.decrement = function(cell,tkn,prgm) {
  this.object = this.object.decrement(cell,tkn,prgm);
  return this;
}
Cell.types.REFERENCE.prototype.is_non_zero = function(cell,tkn,prgm) {
  return this.object.is_non_zero(cell,tkn,prgm);
}
Cell.types.REFERENCE.prototype.copy = function(cell,tkn,prgm) {
  return new Cell.types.REFERENCE(this.object);
}
Cell.types.REFERENCE.prototype.stringify = function(cell,tkn,prgm) {
  this.object = this.object.stringify(cell,tkn,prgm);
  return this;
}
Cell.types.REFERENCE.prototype.numberify = function(cell,tkn,prgm) {
  this.object = this.object.numberify(cell,tkn,prgm);
  return this;
}
Cell.types.REFERENCE.prototype.integerify = function(cell,tkn,prgm) {
  this.object = this.object.integerify(cell,tkn,prgm);
  return this;
}
Cell.types.REFERENCE.prototype.arrayify = function(cell,tkn,prgm) {
  this.object = this.object.arrayify(cell,tkn,prgm);
  return this;
}
Cell.types.REFERENCE.prototype.length = function(cell,tkn,prgm) {
  return this.object.length(cell,tkn,prgm);
}
Cell.types.REFERENCE.prototype.index = function(cell,tkn,prgm,i) {
  return this.object.index(cell,tkn,prgm,i);
}
Cell.types.REFERENCE.prototype.range = function(cell,tkn,prgm,r) {
  return this.object.range(cell,tkn,prgm,r);
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
