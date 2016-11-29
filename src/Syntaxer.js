(function(global) {

String.prototype.mark = function(regex, classes) {
  var css = "";
  for(var i = classes.length; i--;) css += classes[i] + " ";
  return this.replace(regex, '<mark class="'+css+'">$&</mark>');
}

function Syntaxer($textarea) {
  this.$textarea = $textarea.clone();
  this.$container = $('<div class="container"></div>');
  this.$backdrop = $('<div class="backdrop"></div>');
  this.$highlights = $('<div class="highlights"></div>');
  this.$container.append(this.$backdrop.append(this.$highlights)).append(this.$textarea);
  $textarea.replaceWith(this.$container);
  
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
  var text = this.$textarea.val();
  var highlightedText = this.applyParse(text);
  this.$highlights.html(highlightedText);
}
Syntaxer.prototype.handleScroll = function() {
  var scrollTop = this.$textarea.scrollTop();
  this.$backdrop.scrollTop(scrollTop);
  
  var scrollLeft = this.$textarea.scrollLeft();
  this.$backdrop.scrollLeft(scrollLeft);  
}
Syntaxer.prototype.parse = function(text) {
  return text
    .mark(/[+-]/g, ["bg-blue"])
	.mark(/[\[\]]/g, ["bg-green"])
	.mark(/[\{\}]/g, ["fg-green"])
	.mark(/[\(\)]/g, ["bg-blue","fg-green"]);
}
Syntaxer.prototype.applyParse = function(text) {
  text = this.parse(text.replace(/\n$/g, '\n\n'));
  
  // IE wraps whitespace differently in a div vs textarea, this fixes it.
  if (Syntaxer.isIE) {
    text = text.replace(/ /g, ' <wbr>');
  }
  
  return text;
}

Syntaxer.ua = window.navigator.userAgent.toLowerCase();
Syntaxer.isIE = !!Syntaxer.ua.match(/msie|trident\/7|edge/);
Syntaxer.isWinPhone = Syntaxer.ua.indexOf('windows phone') !== -1;
Syntaxer.isIOS = !Syntaxer.isWinPhone && !!Syntaxer.ua.match(/ipad|iphone|ipod/);

global.Syntaxer = Syntaxer;

})(this)