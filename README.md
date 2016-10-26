An extremely lightweight CLI options parser.

Treats everything as if a string. Doesn't allow multiple uses of same option (as in `-a b -a c` or `--ab c --ab d`). Doesn't allow use of `=` to assign value to option (as in `-a=b` or `-ab=b`). Doesn't allow number immediately following single-letter option (as in `-a13`). Doesn't allow dotted option (as in `-a.b` or `--ab.c`).
