(function($) {
// Handles rare bug where specific special characters get a character prepended.
function hr(char) { return char[char.length-1]; }
var charToHtmlMap = {};
charToHtmlMap[hr("!")] = "&#33;";
charToHtmlMap[hr('"')] = "&#34;";
charToHtmlMap[hr("#")] = "&#35;";
charToHtmlMap[hr("$")] = "&#36;";
charToHtmlMap[hr("%")] = "&#37;";
charToHtmlMap[hr("&")] = "&#38;";
charToHtmlMap[hr("'")] = "&#39;";
charToHtmlMap[hr("(")] = "&#40;";
charToHtmlMap[hr(")")] = "&#41;";
charToHtmlMap[hr("*")] = "&#42;";
charToHtmlMap[hr("+")] = "&#43;";
charToHtmlMap[hr(",")] = "&#44;";
charToHtmlMap[hr("-")] = "&#45;";
charToHtmlMap[hr(".")] = "&#46;";
charToHtmlMap[hr("/")] = "&#47;";
charToHtmlMap[hr("0")] = "&#48;";
charToHtmlMap[hr("1")] = "&#49;";
charToHtmlMap[hr("2")] = "&#50;";
charToHtmlMap[hr("3")] = "&#51;";
charToHtmlMap[hr("4")] = "&#52;";
charToHtmlMap[hr("5")] = "&#53;";
charToHtmlMap[hr("6")] = "&#54;";
charToHtmlMap[hr("7")] = "&#55;";
charToHtmlMap[hr("8")] = "&#56;";
charToHtmlMap[hr("9")] = "&#57;";
charToHtmlMap[hr(":")] = "&#58;";
charToHtmlMap[hr(";")] = "&#59;";
charToHtmlMap[hr("<")] = "&#60;";
charToHtmlMap[hr("=")] = "&#61;";
charToHtmlMap[hr(">")] = "&#62;";
charToHtmlMap[hr("?")] = "&#63;";
charToHtmlMap[hr("@")] = "&#64;";
charToHtmlMap[hr("A")] = "&#65;";
charToHtmlMap[hr("B")] = "&#66;";
charToHtmlMap[hr("C")] = "&#67;";
charToHtmlMap[hr("D")] = "&#68;";
charToHtmlMap[hr("E")] = "&#69;";
charToHtmlMap[hr("F")] = "&#70;";
charToHtmlMap[hr("G")] = "&#71;";
charToHtmlMap[hr("H")] = "&#72;";
charToHtmlMap[hr("I")] = "&#73;";
charToHtmlMap[hr("J")] = "&#74;";
charToHtmlMap[hr("K")] = "&#75;";
charToHtmlMap[hr("L")] = "&#76;";
charToHtmlMap[hr("M")] = "&#77;";
charToHtmlMap[hr("N")] = "&#78;";
charToHtmlMap[hr("O")] = "&#79;";
charToHtmlMap[hr("P")] = "&#80;";
charToHtmlMap[hr("Q")] = "&#81;";
charToHtmlMap[hr("R")] = "&#82;";
charToHtmlMap[hr("S")] = "&#83;";
charToHtmlMap[hr("T")] = "&#84;";
charToHtmlMap[hr("U")] = "&#85;";
charToHtmlMap[hr("V")] = "&#86;";
charToHtmlMap[hr("W")] = "&#87;";
charToHtmlMap[hr("X")] = "&#88;";
charToHtmlMap[hr("Y")] = "&#89;";
charToHtmlMap[hr("Z")] = "&#90;";
charToHtmlMap[hr("[")] = "&#91;";
charToHtmlMap[hr("\\")] = "&#92;";
charToHtmlMap[hr("]")] = "&#93;";
charToHtmlMap[hr("^")] = "&#94;";
charToHtmlMap[hr("_")] = "&#95;";
charToHtmlMap[hr("`")] = "&#96;";
charToHtmlMap[hr("a")] = "&#97;";
charToHtmlMap[hr("b")] = "&#98;";
charToHtmlMap[hr("c")] = "&#99;";
charToHtmlMap[hr("d")] = "&#100;";
charToHtmlMap[hr("e")] = "&#101;";
charToHtmlMap[hr("f")] = "&#102;";
charToHtmlMap[hr("g")] = "&#103;";
charToHtmlMap[hr("h")] = "&#104;";
charToHtmlMap[hr("i")] = "&#105;";
charToHtmlMap[hr("j")] = "&#106;";
charToHtmlMap[hr("k")] = "&#107;";
charToHtmlMap[hr("l")] = "&#108;";
charToHtmlMap[hr("m")] = "&#109;";
charToHtmlMap[hr("n")] = "&#110;";
charToHtmlMap[hr("o")] = "&#111;";
charToHtmlMap[hr("p")] = "&#112;";
charToHtmlMap[hr("q")] = "&#113;";
charToHtmlMap[hr("r")] = "&#114;";
charToHtmlMap[hr("s")] = "&#115;";
charToHtmlMap[hr("t")] = "&#116;";
charToHtmlMap[hr("u")] = "&#117;";
charToHtmlMap[hr("v")] = "&#118;";
charToHtmlMap[hr("w")] = "&#119;";
charToHtmlMap[hr("x")] = "&#120;";
charToHtmlMap[hr("y")] = "&#121;";
charToHtmlMap[hr("z")] = "&#122;";
charToHtmlMap[hr("{")] = "&#123;";
charToHtmlMap[hr("|")] = "&#124;";
charToHtmlMap[hr("}")] = "&#125;";
charToHtmlMap[hr("~")] = "&#126;";
charToHtmlMap[hr(" ")] = "&#160;";
charToHtmlMap[hr("¡")] = "&#161;";
charToHtmlMap[hr("¢")] = "&#162;";
charToHtmlMap[hr("£")] = "&#163;";
charToHtmlMap[hr("¤")] = "&#164;";
charToHtmlMap[hr("¥")] = "&#165;";
charToHtmlMap[hr("¦")] = "&#166;";
charToHtmlMap[hr("§")] = "&#167;";
charToHtmlMap[hr("¨")] = "&#168;";
charToHtmlMap[hr("©")] = "&#169;";
charToHtmlMap[hr("ª")] = "&#170;";
charToHtmlMap[hr("«")] = "&#171;";
charToHtmlMap[hr("¬")] = "&#172;";
charToHtmlMap[hr("®")] = "&#174;";
charToHtmlMap[hr("¯")] = "&#175;";
charToHtmlMap[hr("°")] = "&#176;";
charToHtmlMap[hr("±")] = "&#177;";
charToHtmlMap[hr("²")] = "&#178;";
charToHtmlMap[hr("³")] = "&#179;";
charToHtmlMap[hr("´")] = "&#180;";
charToHtmlMap[hr("µ")] = "&#181;";
charToHtmlMap[hr("¶")] = "&#182;";
charToHtmlMap[hr("·")] = "&#183;";¸
charToHtmlMap[hr("¸")] = "&#184;";
charToHtmlMap[hr("¹")] = "&#185;";
charToHtmlMap[hr("º")] = "&#186;";
charToHtmlMap[hr("»")] = "&#187;";
charToHtmlMap[hr("¼")] = "&#188;";
charToHtmlMap[hr("½")] = "&#189;";
charToHtmlMap[hr("¾")] = "&#190;";
charToHtmlMap[hr("¿")] = "&#191;";
charToHtmlMap[hr("À")] = "&#192;";
charToHtmlMap[hr("Á")] = "&#193;";
charToHtmlMap[hr("Â")] = "&#194;";
charToHtmlMap[hr("Ã")] = "&#195;";
charToHtmlMap[hr("Ä")] = "&#196;";
charToHtmlMap[hr("Å")] = "&#197;";
charToHtmlMap[hr("Æ")] = "&#198;";
charToHtmlMap[hr("Ç")] = "&#199;";
charToHtmlMap[hr("È")] = "&#200;";
charToHtmlMap[hr("É")] = "&#201;";
charToHtmlMap[hr("Ê")] = "&#202;";
charToHtmlMap[hr("Ë")] = "&#203;";
charToHtmlMap[hr("Ì")] = "&#204;";
charToHtmlMap[hr("Í")] = "&#205;";
charToHtmlMap[hr("Î")] = "&#206;";
charToHtmlMap[hr("Ï")] = "&#207;";
charToHtmlMap[hr("Ð")] = "&#208;";
charToHtmlMap[hr("Ñ")] = "&#209;";
charToHtmlMap[hr("Ò")] = "&#210;";
charToHtmlMap[hr("Ó")] = "&#211;";
charToHtmlMap[hr("Ô")] = "&#212;";
charToHtmlMap[hr("Õ")] = "&#213;";
charToHtmlMap[hr("Ö")] = "&#214;";
charToHtmlMap[hr("×")] = "&#215;";
charToHtmlMap[hr("Ø")] = "&#216;";
charToHtmlMap[hr("Ù")] = "&#217;";
charToHtmlMap[hr("Ú")] = "&#218;";
charToHtmlMap[hr("Û")] = "&#219;";
charToHtmlMap[hr("Ü")] = "&#220;";
charToHtmlMap[hr("Ý")] = "&#221;";
charToHtmlMap[hr("Þ")] = "&#222;";
charToHtmlMap[hr("ß")] = "&#223;";
charToHtmlMap[hr("à")] = "&#224;";
charToHtmlMap[hr("á")] = "&#225;";
charToHtmlMap[hr("â")] = "&#226;";
charToHtmlMap[hr("ã")] = "&#227;";
charToHtmlMap[hr("ä")] = "&#228;";
charToHtmlMap[hr("å")] = "&#229;";
charToHtmlMap[hr("æ")] = "&#230;";
charToHtmlMap[hr("ç")] = "&#231;";
charToHtmlMap[hr("è")] = "&#232;";
charToHtmlMap[hr("é")] = "&#233;";
charToHtmlMap[hr("ê")] = "&#234;";
charToHtmlMap[hr("ë")] = "&#235;";
charToHtmlMap[hr("ì")] = "&#236;";
charToHtmlMap[hr("í")] = "&#237;";
charToHtmlMap[hr("î")] = "&#238;";
charToHtmlMap[hr("ï")] = "&#239;";
charToHtmlMap[hr("ð")] = "&#240;";
charToHtmlMap[hr("ñ")] = "&#241;";
charToHtmlMap[hr("ò")] = "&#242;";
charToHtmlMap[hr("ó")] = "&#243;";
charToHtmlMap[hr("ô")] = "&#244;";
charToHtmlMap[hr("õ")] = "&#245;";
charToHtmlMap[hr("ö")] = "&#246;";
charToHtmlMap[hr("÷")] = "&#247;";
charToHtmlMap[hr("ø")] = "&#248;";
charToHtmlMap[hr("ù")] = "&#249;";
charToHtmlMap[hr("ú")] = "&#250;";
charToHtmlMap[hr("û")] = "&#251;";
charToHtmlMap[hr("ü")] = "&#252;";
charToHtmlMap[hr("ý")] = "&#253;";
charToHtmlMap[hr("þ")] = "&#254;";
charToHtmlMap[hr("ÿ")] = "&#255;";

charToHtmlMap["\n"] = "<br>";

$.syntaxer = {};
$.syntaxer.charToHtml = function(char) { return charToHtmlMap[char[0]]; }
$.sytaxer.textToHtml = function(text) {
  var s = "";
  for(var i = 0; i < text.length; ++i) s += $.syntaxer.charToHtml(text[i]);
  return s;
}

function setMark(marks, mark, index, capture) {
  marks[index++] = mark + $.sytaxer.textToHtml(capture) + '</mark>';
  for(var i = capture.length-1; i--;) {
    marks[index+i] = "";
  }
}

String.prototype.mark = function(arg1, classes) {
  if(this.marks === undefined) {
    this.marks = [];
    for(var i = this.length; i--;) this.marks.unshift($.sytaxer.textToHtml(this[i]));
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
  
  this.cols = Syntaxer.colsToPx($textarea.prop("cols"));
  this.rows = Syntaxer.rowsToPx($textarea.prop("rows"));
  
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
  //if (Syntaxer.isIE) {
  //  text = text.replace(/ /g, ' <wbr>');
  //}
  
  return text;
}

Syntaxer.ua = window.navigator.userAgent.toLowerCase();
Syntaxer.isIE = !!Syntaxer.ua.match(/msie|trident\/7|edge/);
Syntaxer.isWinPhone = Syntaxer.ua.indexOf('windows phone') !== -1;
Syntaxer.isIOS = !Syntaxer.isWinPhone && !!Syntaxer.ua.match(/ipad|iphone|ipod/);

Syntaxer.colsToPx = function(cols) {
  return (cols * 5) + "px"
}
Syntaxer.rowsToPx = function(rows) {
  return (rows * 5) + "px"
}

$.syntaxer.Syntaxer = Syntaxer;

})(jQuery)
