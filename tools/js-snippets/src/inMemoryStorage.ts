import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';

/*
Use the in-memory implementations of the blockstore and datastore.

```html
    <script src="https://cdn.jsdelivr.net/npm/datastore-core/dist/index.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/blockstore-core/dist/index.min.js"></script>
```

The library is now available in the global scope as `DatastoreCore` and `BlockstoreCore`
    
```js
    const g = globalThis as any;
    const MemoryDatastore = g.DatastoreCore.MemoryDatastore;
    const MemoryBlockstore = g.BlockstoreCore.MemoryBlockstore;
```
*/
  
// the blockstore is where we store the blocks that make up files
const blockstore = new MemoryBlockstore()

// application-specific data lives in the datastore
const datastore = new MemoryDatastore()