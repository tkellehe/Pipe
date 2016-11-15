# Braingolf++
_Braingolf++_ is the next version of _braingolf_ in which was the base design for the language. _Braingolf_ is a language that directly translates into _brainf*ck_. This means that the same compiler for _brainf*ck_ works for _braingolf_ after it has been translated. But _braingolf++_ merely uses the same memory model and basic commands of _brainf*ck_. 

I chose the word _golf_ because it was another four letter curse word. I hope this language challenges the mind in the form of creative thinking that _brainf*ck_ does, but also challenge programmers to utilize the least amount of characters to complete a task.

---

## Intro

_Braingolf++_ follows the same memory model as _brainf*ck_. Essentially, a single "infinite" array of bytes going in either direction all initialized to zero. The following commands are the most primitive to _braingolf++_:

|cmd|description|
|:---:|:---:|
|`>`|Move the ptr right one byte|
|`<`|Move the ptr left one byte|
|`+`|Increment cell where ptr is at|
|`-`|Decrement cell where ptr is at|
|`.`|Print cell where ptr is at|
|`,`|Consume byte from input and write to cell where ptr is at|
