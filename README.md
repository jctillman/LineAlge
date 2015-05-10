# LineAlge

LineAlge is a linear algebra library with chaining.

It is not particularly fast, but it should be clear and easy to understand.

Matrix and Vector are the two chief constructor functions.  Vector is a subclass of Matrix, so all of the operations that work on Matrix should also work on Vector.

Matrix may be passed either a two-dimensional array, a one-dimensional array (will assume these are a vector), or a bunch of parameters (will assume these are a vector as well).

It has many methods.

.rows(): Returns an array of the rows in the matrix.

.cols(): Returns an array of the columns in the matrix.

.row(n): Returns the nth row.

.col(n): Returns the nth col.

.trace(): Returns the array found by going along the diagonal of a matrix.

.dimensions(): Returns {'row': [Number of Rows], 'col': [Number of Columns]}


.frobenius(): Returns the Frobenius norm for a matrix.

.isSquare(): Is the matrix square?

.equals(mat): Is the matrix equal to another matrix?  Allows equality within a range of tolerance.

.isSymmetric(): Is the matrix equal to its transposition?

.isOrthogonal(): Etc.


//todo: fill this out further.
