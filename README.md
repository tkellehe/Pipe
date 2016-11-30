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
|`.`|Copies content of the current cell into the pipe|
|`,`|Consume item from the pipe and place into the current cell|


With those commands we can create a simple program:

[SNIPPET](https://tkellehe.github.io/Pipe/?input=&code=%2B%2B%2B%5B.-%5D)
```
+++[.-]
```
__OUTPUT:__
```
321
```

A further break down of the program:
```
+++     // Increments the current cell by one three times.
   [    // Checks to see if the current cell is non zero.
    .   // Buffers the value of the current cell into the pipe.
     -  // Decrements the current cell by one.
      ] // Jump back to the '[' (Because is the last command pushes pipe into stdout).
```

Now, let us try to use `,` to take in a three which will look like:

[SNIPPET](https://tkellehe.github.io/Pipe/?input=3&code=%2C%5B.-%5D)
```
,[.-]
```
__OUTPUT:__
```
33
```

Well that did not work... Essentially, _Pipe_ has data types which are currently `NUMBER`, `STRING`, and `ARRAY`.
What we just did was place a `STRING` into the current cell from the pipe which came from the stdin. Then the `[` evaluated
the `STRING` and check if is non zero (has characters). This then got to `.` which copied the current cell into the pipe.
When you decrement a `STRING` it removes the first character placing it into the pipe. So, the pipe still contains two `STRING`s
which are `"3"` and `"3"`.
```
,     // Places item from the pipe into the current cell.
 [    // Checks to see if the STRING has any more characters.
  .   // Buffers the value of the current cell into the pipe.
   -  // Pops the first character off of the STRING into the pipe.
    ] // Jump back to the '[' (Because is the last command pushes pipe into stdout).
```

To fix this merely place a `#` in after the `,`. This will `numberify` the current cell which for a `STRING` turns
it directly into a `NUMBER`.

[SNIPPET](https://tkellehe.github.io/Pipe/?input=3&code=%2C%23%5B.-%5D)
```
,#[.-]
```
__OUTPUT:__
```
321
```
