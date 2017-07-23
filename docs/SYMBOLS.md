## Symbol Table Notes
```
{ 
  define: ...
  range: [0, 100]
  symbols: { ... }
}
```
_Note: Remember vars vs let/const and function scoping._

Assumption:
Each symbol has a scope inside a code range e.g [22, 49]

Use ranges as this should enable lookup from anywhere in the AST

Lets say we have:
`var a = 5 + n;`
at range [100, 114]

- We want to look up 'n'. We start at root scope e.g. [0, 1000]
- This might contain the scopes [0, 99], [100, 199], etc ...
- Check the symbols here. If we find n, remember it.
- Recurse into [100, 199], keep doing so until we reach current scope.
- The most nested 'n' is the one we want. 
- Look at the definition (In future, if n was imported, we could parse another file). 

We should be able to figure out the type for primitives such as number, string and boolean.

We might then be able to say what types a function was called with, and determine it's type signature.

We should be able to figure out whether to use const or let.




Insertion:

What type of symbol is n?
is it a scope symbol or not?



