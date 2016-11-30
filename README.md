# Pipe
_Pipe_ is a language that was originally based off of _brainf*ck_, but has evolved into something different. The language moves data down through the different commands which can be interacted with. There also is an "infinite" two-diminsional array that can be interfaced with as well.

I hope this language challenges the mind in the form of creative thinking that _brainf*ck_ does, but also challenge programmers to utilize the least amount of characters to complete a task.

---

## Intro

_Pipe_ follows the same memory model as _brainf*ck_ except for the fact that it is a two-diminsional "infinite" array of cells going in either direction all initialized to zero. Each index into the array is called a cell. There is a ptr that represents the current active cell. The following commands are the most primitive to _Pipe_:

|cmd|description|
|:---:|:---:|
|`>`|Move the ptr right one cell|
|`<`|Move the ptr left one cell|
|`+`|Increment cell where ptr is at|
|`-`|Decrement cell where ptr is at|
|`[`|Continues to run the contained code until the current cell is zero|
|`]`|Ends a `[` command|
|`:`|Copies the data in the current cell and places it into the output|
|`;`|Consume item from input and writes it to the current cell|

__Note:__ The commands `.` and `,` are valid, but not as simple as `:` and `;`.

With those commands we can create a simple [program](https://tkellehe.github.io/Pipe/?input=&code=%2B%2B%2B%2B%2B%2B%5B%3A-%5D):

```
++++++[:-]
```
__OUTPUT:__
```
654321
```

A further break down of the program:
```
++++++     // Increments the current cell by one six times.
      [    // Checks to see if the current cell is non zero.
       :   // Buffers the value of the current cell into the output.
        -  // Decrements the current cell by one.
         ] // Jump back to the '['.
```
