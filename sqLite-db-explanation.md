# Database Setup

```
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('conveyor.db');
```

- Imports the SQLite3 library (verbose mode for detailed errors).

- Creates/connects to a SQLite database file named conveyor.db.

## Table Creation

```

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY,
    unusedA INTEGER,
    unusedB INTEGER,
    productsC INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});
```

- db.serialize() ensures queries run sequentially.

- Creates a table named results (if it doesn’t exist) with:

i. id: Auto-incrementing primary key.

ii. unusedA/unusedB: Counters for unused components.

iii. productsC: Counter for assembled products.

iii. timestamp: Automatically records insertion time.


## Saving Results


```
function saveResults(unusedA, unusedB, productsC) {
  db.run(`INSERT INTO results (unusedA, unusedB, productsC) VALUES (?, ?, ?)`, 
    [unusedA, unusedB, productsC]);
}

```


- Inserts data into the results table with:

- Placeholders (?) to prevent SQL injection.

- Values passed as an array [unusedA, unusedB, productsC].

- Automatically adds the current timestamp (from DEFAULT CURRENT_TIMESTAMP).

## Key Purpose

- Tracks factory metrics:

i. Unused components (unusedA, unusedB).

ii. Products assembled (productsC).

iii. Timestamps for analysis over time.

## Example Usage

```
saveResults(5, 3, 10); // Logs: unusedA=5, unusedB=3, productsC=10

```
- This would insert a row into the results table with the provided values.
