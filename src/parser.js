(function(global){

// The current verion of braingolfpp.
var version = "1.00.00.00",

//-----------------------------------------------------------------------------
// Symbol look up.
Symbols = {}

//=============================================================================
// Pipe type.
//-----------------------------------------------------------------------------
function Pipe() {
  this.array = [];
  var self = this;
  self.front = function(v) {
    if(v !== undefined) this.front.add(v)
    else return this.front.remove()
  }
  self.back = function(v) {
    if(v !== undefined) this.back.add(v)
    else return this.back.remove()
  }
  self.front.remove = function() {
    return self.array.shift();
  };
  self.front.add = function(v) {
    self.array.unshift(v);
  };
  self.back.remove = function() {
    return self.array.pop();
  };
  self.back.add = function(v) {
    self.array.push(v);
  };
}

//-----------------------------------------------------------------------------
Pipe.prototype.length = function() {
  return this.array.length
}

//-----------------------------------------------------------------------------
Pipe.prototype.end = function() {
  return this.length() - 1
}

//-----------------------------------------------------------------------------
Pipe.prototype.at = function(i,v) {
  if(v !== undefined) this.array[i] = v;
  return this.array[i];
}

//-----------------------------------------------------------------------------
Pipe.prototype.find = function(v) {
  for(var i = this.length(); i--;) {
    if(this.at(i) === v) return i;
  }
  return -1;
}

//-----------------------------------------------------------------------------
Pipe.prototype.removeAt = function(i) {
  if(0 <= i && i < this.length()) {
    return this.array.splice(i,1)[0];
  }
}

//-----------------------------------------------------------------------------
Pipe.prototype.remove = function(v) {
  var i = this.find(v);
  this.removeAt(i);
  return i;
}

//-----------------------------------------------------------------------------
Pipe.prototype.has = function(v) {
  for(var i = this.length(); i--;) {
    if(this.at(i) === v) return true;
  }
  return false;
}

//-----------------------------------------------------------------------------
Pipe.prototype.pipe = function(o) {
  var i;
  while(i = o.front()) {
    this.back(i);
  }
}

//-----------------------------------------------------------------------------
Pipe.prototype.each = function(f) {
  for(var i = 0, l = this.length(); i < l;++i) {
    f(this.at(i))
  }
}

//-----------------------------------------------------------------------------
Pipe.prototype.toString = function() {
  var s = "";
  for(var i = 0; i < this.length(); ++i) {
    s += this.at(i);
  }
  return s;
}

//=============================================================================
// The lexical analyzer.
//-----------------------------------------------------------------------------
function Token(start, code, parent) {
  this.parent = parent;

  this.branches = new Pipe();
  this.inputs = new Pipe();
  this.outputs = new Pipe();

  // First get all of the information and data needed such that when
  // the command tokenizes it will have everything to work off of.
  var result = Token.analyze.at(0)(start, 0, code, this);
  while(((result.next.amount+result.next.start-1) < code.length)
    && result.cmd === undefined) {
    result = Token.analyze.at(0)(
      result.next.start,
      result.next.amount,
      result.next.code,
      this);
  }
  this.code = result.code;
  this.start = result.start;
  this.literal = result.literal;
  this.end = result.end;
  this.cmd = result.cmd;
}
Token.prototype.next = function(path) {
  return this.branches.at(0);
}
Token.prototype.execute = function(path) {
  return this.cmd.execute(this,path);
}

//-----------------------------------------------------------------------------
Token.analyze = new Pipe();
Token.analyze.front(function(start, amount, code, tkn){
  // If there is an amount of characters provided then attempt to check them.
  if(amount) {
    // Extract what could be the literal.
    var result = {literal: code.substr(start, amount)};
    // If can successfully recognize the given characters as a valid symbol...
    if(Symbols[result.literal] !== undefined
       // Either there is not any more characters.
      && (code[start+amount] === undefined
       // Or, the current literal plus the next character is not a command.
        || Symbols[result.literal+code[start+amount]] === undefined)) {
      // Create a Command based off of the information stored in the Symbols.
      result.cmd = new Command(Symbols[result.literal].at(0));
      // Set the start and end of the token as well as the code.
      result.start = start;
      result.end = start+amount-1;
      result.code = code;
      // The information to start parsing the next token.
      result.next = {start:result.end+1,amount:0,code:code}
      return result;
    }
  }
  // Tell what to pass in to keep looping.
  return {next:{start:start,amount:amount+1,code:code}}
});

//-----------------------------------------------------------------------------
Token.prototype.tokenize = function() {
  if(this.cmd !== undefined) {
    return this.cmd.tokenize(this);
  }
  return this;
}

//=============================================================================
// The Execution of the actual token.
//-----------------------------------------------------------------------------
function Command(f) {
  // Allows a Command to do multiple functions.
  var exec = new Pipe();
  exec.front(function(tkn,path){});
  Object.defineProperty(this,"execute",{
    get: function() { return function(tkn,path) { exec.each(function(i) { i(tkn,path) }) } },
    set: function(v) { exec.front(v) }
  });
  
  // Sets up the Command object.
  if(typeof f === "function") {
    f(this);
  } else if(typeof f === "string") {
    this.tokenize = function(tkn) {
      this.path = new Path(f);
      tkn.branches.back(this.path.entry);
      var n = new Token(tkn.end+1,tkn.code,this.path.exit);
      return n.tokenize();
    }
  }
}
Command.prototype.tokenize = function(tkn) {
  var n = new Token(tkn.end+1,tkn.code,tkn);
  tkn.branches.back(n);
  return n.tokenize();
}

//=============================================================================
// The main class for tokenizing a string of symbols.
//-----------------------------------------------------------------------------
function Path(code) {
  this.code = code;
  this.entry = new Token(0, this.code);
  // Make the exit an actual token with a command if possible.
  this.exit = this.entry.tokenize();
  if(this.exit.parent) {
    this.exit.parent.branches.remove(this.exit);
    this.exit = this.exit.parent;
  }
  this.current = this.entry;
  this.outputs = new Pipe();
  this.inputs = new Pipe();
  this.num_steps = 0;
}

//-----------------------------------------------------------------------------
Path.prototype.step = function(f) {
  if(this.current !== undefined) {
    this.current.execute(this);
    if(f) f.call(this);
    ++this.num_steps;
    this.current = this.current.next(this);
    return true;
  }
  return false;
}

//-----------------------------------------------------------------------------
Path.prototype.exec = function(c,f,r) {
  var self = this;
  if(this.step(f)) {
    setTimeout(function() {self.exec(c,f,r)}, r === undefined ? 100: r);
  } else if(c) {
    c.call(this);
  }
}

//=============================================================================
// Sets all of the global variables defined earlier.
global.parser = {};
global.parser.Symbols = Symbols;
global.parser.Pipe = Pipe;
global.parser.Token = Token;
global.parser.Command = Command;
global.parser.Path = Path;
global.parser.version = version;

})(this)
