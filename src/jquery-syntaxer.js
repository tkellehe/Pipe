(function($) {

$.fn.syntaxer = function(options) {
  if(this.prop("tagName") !== "TEXTAREA") return this;
  
  this.$textarea = this.clone();
  
  this.cols = $.fn.syntaxer.colsToPx(this.prop("cols"));
  this.rows = $.fn.syntaxer.rowsToPx(this.prop("rows"));
  
  this.$container = $('<div class="container"></div>');
  this.$backdrop = $('<div class="backdrop"></div>');
  this.$highlights = $('<div class="highlights"></div>');
  this.$container.append(this.$backdrop.append(this.$highlights)).append(this.$textarea);
  
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
  
  // Clean up for iOS.
  if ($.fn.syntaxer.isIOS) {
    // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
    this.$highlights.css({
      'padding-left': '+=3px',
      'padding-right': '+=3px'
    });
  }
  
  // Set up all of the events.
  var self = this;
  this.$textarea.on({
    'input': function(){$.fn.syntaxer.handleInput(self)},
    'scroll': function(){$.fn.syntaxer.handleScroll(self)}
  });
  
  $.fn.syntaxer.handleInput(self);
  
  this.replaceWith(this.$container);
  return this.$textarea;
}
$.fn.syntaxer.handleInput = function(self) {
  var text = self.$textarea.val();
  var utext = self.parse(text);
  
  var ctext = text.replace(/\n$/g, '\n\n');
  // IE wraps whitespace differently in a div vs textarea, this fixes it.
  if ($.fn.syntaxer.isIE) {
    ctext = ctext.replace(/ /g, ' <wbr>');
  }

  
  self.$highlights.html(self.applyParse());
}
$.fn.syntaxer.handleScroll = function() {
  this.$backdrop.scrollTop(this.$textarea.scrollTop());
  this.$backdrop.scrollLeft(this.$textarea.scrollLeft());  
}

$.fn.syntaxer.ua = window.navigator.userAgent.toLowerCase();
$.fn.syntaxer.isIE = !!$.fn.syntaxer.ua.match(/msie|trident\/7|edge/);
$.fn.syntaxer.isWinPhone = $.fn.syntaxer.ua.indexOf('windows phone') !== -1;
$.fn.syntaxer.isIOS = !$.fn.syntaxer.isWinPhone && !!$.fn.syntaxer.ua.match(/ipad|iphone|ipod/);

$.fn.syntaxer.colsToPx = function(cols) {
  return (cols * 5) + "px"
}
$.fn.syntaxer.rowsToPx = function(rows) {
  return (rows * 5) + "px"
}

// Handles rare bug where specific special characters get a character prepended.
$.fn.syntaxer.lastChar = function(char) { return char[char.length-1]; }
$.fn.syntaxer.charToHtmlMap = {};
$.fn.syntaxer.mapCharToHtml = function(char,html) { this.charToHtmlMap[this.lastChar(char)] = html; return this }
$.fn.syntaxer.charToHtml = function(char) { return this.charToHtmlMap[char[0]]; }
$.fn.sytaxer.textToHtml = function(text) {
  var s = "";
  for(var i = 0; i < text.length; ++i) s += this.charToHtml(text[i]);
  return s;
}

$.fn.syntaxer
.mapCharToHtml("!", "&#33;")
.mapCharToHtml('"', "&#34;")
.mapCharToHtml("#", "&#35;")
.mapCharToHtml("$", "&#36;")
.mapCharToHtml("%", "&#37;")
.mapCharToHtml("&", "&#38;")
.mapCharToHtml("'", "&#39;")
.mapCharToHtml("(", "&#40;")
.mapCharToHtml(")", "&#41;")
.mapCharToHtml("*", "&#42;")
.mapCharToHtml("+", "&#43;")
.mapCharToHtml(",", "&#44;")
.mapCharToHtml("-", "&#45;")
.mapCharToHtml(".", "&#46;")
.mapCharToHtml("/", "&#47;")
.mapCharToHtml("0", "&#48;")
.mapCharToHtml("1", "&#49;")
.mapCharToHtml("2", "&#50;")
.mapCharToHtml("3", "&#51;")
.mapCharToHtml("4", "&#52;")
.mapCharToHtml("5", "&#53;")
.mapCharToHtml("6", "&#54;")
.mapCharToHtml("7", "&#55;")
.mapCharToHtml("8", "&#56;")
.mapCharToHtml("9", "&#57;")
.mapCharToHtml(":", "&#58;")
.mapCharToHtml(";", "&#59;")
.mapCharToHtml("<", "&#60;")
.mapCharToHtml("=", "&#61;")
.mapCharToHtml(">", "&#62;")
.mapCharToHtml("?", "&#63;")
.mapCharToHtml("@", "&#64;")
.mapCharToHtml("A", "&#65;")
.mapCharToHtml("B", "&#66;")
.mapCharToHtml("C", "&#67;")
.mapCharToHtml("D", "&#68;")
.mapCharToHtml("E", "&#69;")
.mapCharToHtml("F", "&#70;")
.mapCharToHtml("G", "&#71;")
.mapCharToHtml("H", "&#72;")
.mapCharToHtml("I", "&#73;")
.mapCharToHtml("J", "&#74;")
.mapCharToHtml("K", "&#75;")
.mapCharToHtml("L", "&#76;")
.mapCharToHtml("M", "&#77;")
.mapCharToHtml("N", "&#78;")
.mapCharToHtml("O", "&#79;")
.mapCharToHtml("P", "&#80;")
.mapCharToHtml("Q", "&#81;")
.mapCharToHtml("R", "&#82;")
.mapCharToHtml("S", "&#83;")
.mapCharToHtml("T", "&#84;")
.mapCharToHtml("U", "&#85;")
.mapCharToHtml("V", "&#86;")
.mapCharToHtml("W", "&#87;")
.mapCharToHtml("X", "&#88;")
.mapCharToHtml("Y", "&#89;")
.mapCharToHtml("Z", "&#90;")
.mapCharToHtml("[", "&#91;")
.mapCharToHtml("\\", "&#92;")
.mapCharToHtml("]", "&#93;")
.mapCharToHtml("^", "&#94;")
.mapCharToHtml("_", "&#95;")
.mapCharToHtml("`", "&#96;")
.mapCharToHtml("a", "&#97;")
.mapCharToHtml("b", "&#98;")
.mapCharToHtml("c", "&#99;")
.mapCharToHtml("d", "&#100;")
.mapCharToHtml("e", "&#101;")
.mapCharToHtml("f", "&#102;")
.mapCharToHtml("g", "&#103;")
.mapCharToHtml("h", "&#104;")
.mapCharToHtml("i", "&#105;")
.mapCharToHtml("j", "&#106;")
.mapCharToHtml("k", "&#107;")
.mapCharToHtml("l", "&#108;")
.mapCharToHtml("m", "&#109;")
.mapCharToHtml("n", "&#110;")
.mapCharToHtml("o", "&#111;")
.mapCharToHtml("p", "&#112;")
.mapCharToHtml("q", "&#113;")
.mapCharToHtml("r", "&#114;")
.mapCharToHtml("s", "&#115;")
.mapCharToHtml("t", "&#116;")
.mapCharToHtml("u", "&#117;")
.mapCharToHtml("v", "&#118;")
.mapCharToHtml("w", "&#119;")
.mapCharToHtml("x", "&#120;")
.mapCharToHtml("y", "&#121;")
.mapCharToHtml("z", "&#122;")
.mapCharToHtml("{", "&#123;")
.mapCharToHtml("|", "&#124;")
.mapCharToHtml("}", "&#125;")
.mapCharToHtml("~", "&#126;")
.mapCharToHtml(" ", "&#160;")
.mapCharToHtml("¡", "&#161;")
.mapCharToHtml("¢", "&#162;")
.mapCharToHtml("£", "&#163;")
.mapCharToHtml("¤", "&#164;")
.mapCharToHtml("¥", "&#165;")
.mapCharToHtml("¦", "&#166;")
.mapCharToHtml("§", "&#167;")
.mapCharToHtml("¨", "&#168;")
.mapCharToHtml("©", "&#169;")
.mapCharToHtml("ª", "&#170;")
.mapCharToHtml("«", "&#171;")
.mapCharToHtml("¬", "&#172;")
.mapCharToHtml("®", "&#174;")
.mapCharToHtml("¯", "&#175;")
.mapCharToHtml("°", "&#176;")
.mapCharToHtml("±", "&#177;")
.mapCharToHtml("²", "&#178;")
.mapCharToHtml("³", "&#179;")
.mapCharToHtml("´", "&#180;")
.mapCharToHtml("µ", "&#181;")
.mapCharToHtml("¶", "&#182;")
.mapCharToHtml("·", "&#183;")
.mapCharToHtml("¸", "&#184;")
.mapCharToHtml("¹", "&#185;")
.mapCharToHtml("º", "&#186;")
.mapCharToHtml("»", "&#187;")
.mapCharToHtml("¼", "&#188;")
.mapCharToHtml("½", "&#189;")
.mapCharToHtml("¾", "&#190;")
.mapCharToHtml("¿", "&#191;")
.mapCharToHtml("À", "&#192;")
.mapCharToHtml("Á", "&#193;")
.mapCharToHtml("Â", "&#194;")
.mapCharToHtml("Ã", "&#195;")
.mapCharToHtml("Ä", "&#196;")
.mapCharToHtml("Å", "&#197;")
.mapCharToHtml("Æ", "&#198;")
.mapCharToHtml("Ç", "&#199;")
.mapCharToHtml("È", "&#200;")
.mapCharToHtml("É", "&#201;")
.mapCharToHtml("Ê", "&#202;")
.mapCharToHtml("Ë", "&#203;")
.mapCharToHtml("Ì", "&#204;")
.mapCharToHtml("Í", "&#205;")
.mapCharToHtml("Î", "&#206;")
.mapCharToHtml("Ï", "&#207;")
.mapCharToHtml("Ð", "&#208;")
.mapCharToHtml("Ñ", "&#209;")
.mapCharToHtml("Ò", "&#210;")
.mapCharToHtml("Ó", "&#211;")
.mapCharToHtml("Ô", "&#212;")
.mapCharToHtml("Õ", "&#213;")
.mapCharToHtml("Ö", "&#214;")
.mapCharToHtml("×", "&#215;")
.mapCharToHtml("Ø", "&#216;")
.mapCharToHtml("Ù", "&#217;")
.mapCharToHtml("Ú", "&#218;")
.mapCharToHtml("Û", "&#219;")
.mapCharToHtml("Ü", "&#220;")
.mapCharToHtml("Ý", "&#221;")
.mapCharToHtml("Þ", "&#222;")
.mapCharToHtml("ß", "&#223;")
.mapCharToHtml("à", "&#224;")
.mapCharToHtml("á", "&#225;")
.mapCharToHtml("â", "&#226;")
.mapCharToHtml("ã", "&#227;")
.mapCharToHtml("ä", "&#228;")
.mapCharToHtml("å", "&#229;")
.mapCharToHtml("æ", "&#230;")
.mapCharToHtml("ç", "&#231;")
.mapCharToHtml("è", "&#232;")
.mapCharToHtml("é", "&#233;")
.mapCharToHtml("ê", "&#234;")
.mapCharToHtml("ë", "&#235;")
.mapCharToHtml("ì", "&#236;")
.mapCharToHtml("í", "&#237;")
.mapCharToHtml("î", "&#238;")
.mapCharToHtml("ï", "&#239;")
.mapCharToHtml("ð", "&#240;")
.mapCharToHtml("ñ", "&#241;")
.mapCharToHtml("ò", "&#242;")
.mapCharToHtml("ó", "&#243;")
.mapCharToHtml("ô", "&#244;")
.mapCharToHtml("õ", "&#245;")
.mapCharToHtml("ö", "&#246;")
.mapCharToHtml("÷", "&#247;")
.mapCharToHtml("ø", "&#248;")
.mapCharToHtml("ù", "&#249;")
.mapCharToHtml("ú", "&#250;")
.mapCharToHtml("û", "&#251;")
.mapCharToHtml("ü", "&#252;")
.mapCharToHtml("ý", "&#253;")
.mapCharToHtml("þ", "&#254;")
.mapCharToHtml("ÿ", "&#255;")
.mapCharToHtml("\n", "<br>")

})(jQuery)
