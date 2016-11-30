(function(global) {
// Handles rare bug where specific special characters get a character prepended.
function hr(char) { return (char.length === 1 ? char : char[char.length-1]); }
function fixChar(char) {
  if(char === "<") return "&lt;";
  if(char === ">") return "&gt;";
  if(char === '"') return "&quot;";
  if(char === " ") return "&nbsp;";
  if(char === hr("¡")) return "&iexcl;";
  return char;
}
function fixChars(text) {
  var s = "";
  for(var i = 0; i < text.length; ++i) s+=fixChar(text[i]);
  return s;
}
function setMark(marks, mark, index, capture) {
  marks[index] = mark + fixChars(capture) + '</mark>';
  console.log(marks);
  for(++index;index < capture.length; ++index) {
    marks[index] = "";
  }
}
String.prototype.mark = function(arg1, classes) {
  if(this.marks === undefined) {
    this.marks = [];
    for(var i = this.length; i--;) this.marks.unshift(fixChar(this[i]));
  }
  if(arg1 === undefined) return this;
  var css = "";
  for(var i = classes.length; i--;) css += classes[i] + " ";
  var mark = '<mark class="'+css+'">';
  if(arg1 instanceof RegExp) {
    if(arg1.flags.search("g") === -1) {
      var res = arg1.exec(this);
      if(res) {
        setMark(this.marks,mark,res.index,res[0]);
      }
    } else {
      var res = arg1.exec(this);
      while(res) {
        setMark(this.marks,mark,res.index,res[0]);
        res = arg1.exec(this);
      }
    }
  }
  return this;
}
String.prototype.markup = function() {
  if(this.marks === undefined) return this;
  var s = "";
  for(var i = 0, l = this.marks.length; i < l; ++i) {
    s += this.marks[i];
  }
  return s;
}

function Syntaxer($textarea) {
  this.$textarea = $textarea.clone();
  
  this.cols = ($textarea.prop("cols")*Syntaxer.px) + "px";
  this.rows = ($textarea.prop("rows")*Syntaxer.px) + "px";
  
  this.$container = $('<div class="container"></div>');
  this.$backdrop = $('<div class="backdrop"></div>');
  this.$highlights = $('<div class="highlights"></div>');
  this.$container.append(this.$backdrop.append(this.$highlights)).append(this.$textarea);
  $textarea.replaceWith(this.$container);
  
  // Resize the textarea.
  this.$container.css({
    width: this.cols,
    height: this.rows
  });
  this.$backdrop.css({
    width: this.cols,
    height: this.rows
  });
  this.$textarea.css({
    width: this.cols,
    height: this.rows
  });
  
  if (Syntaxer.isIOS) {
    this.fixIOS();
  }
  
  var self = this;
  this.$textarea.on({
    'input': function(){self.handleInput()},
    'scroll': function(){self.handleScroll()}
  });
  
  this.handleInput();
}
Syntaxer.prototype.fixIOS = function() {
  // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
  this.$highlights.css({
    'padding-left': '+=3px',
    'padding-right': '+=3px'
  });
}
Syntaxer.prototype.handleInput = function() {
  this.$highlights.html(this.applyParse(this.$textarea.val()));
}
Syntaxer.prototype.handleScroll = function() {
  this.$backdrop.scrollTop(this.$textarea.scrollTop());
  this.$backdrop.scrollLeft(this.$textarea.scrollLeft());  
}
Syntaxer.prototype.parse = function(text) {
  return text;
}
Syntaxer.prototype.applyParse = function(text) {
  text = this.parse(text.replace(/\n$/g, '\n\n').mark()).markup();
  
  // IE wraps whitespace differently in a div vs textarea, this fixes it.
  if (Syntaxer.isIE) {
    text = text.replace(/ /g, ' <wbr>');
  }
  
  return text;
}

Syntaxer.px = 5;

Syntaxer.ua = window.navigator.userAgent.toLowerCase();
Syntaxer.isIE = !!Syntaxer.ua.match(/msie|trident\/7|edge/);
Syntaxer.isWinPhone = Syntaxer.ua.indexOf('windows phone') !== -1;
Syntaxer.isIOS = !Syntaxer.isWinPhone && !!Syntaxer.ua.match(/ipad|iphone|ipod/);

global.Syntaxer = Syntaxer;

})(this)
