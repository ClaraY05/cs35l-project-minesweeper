# Minesweeper API

Default port is 8000. If your react port for some reason isn't 5173, you'll have to change the cors setting in `index.ts` to match your port

Just like for the frontend, try to use subfolders under `routes/` to subdivide routing. You can also create additional js or ts files to store helper functions within the subdirectories you create and make your code more readable.

`db/` contains db setup helper functions

## Statefulness problems

tsx attempts to rerun your server every time it detects a typescript file change. For certain methods like `revealRegion()` this will not work because it clears any local memory the server process was using, i.e. `boardData`, so methods that rely on server state will fail. to fix this just restart the whole app with `npm run dev`