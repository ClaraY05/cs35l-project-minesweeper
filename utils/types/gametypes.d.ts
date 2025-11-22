/**
 * Global types for board data, to be respected by both frontend and backend
 */
declare namespace GameTypes {
    /**
     * Every possible number (of adjacent mines) a cell can contain.
     */
    type CellNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    /**
     * Server-side truth of what each cell contains. Safe to pass to frontend on reveal only.
     */
    type CellContent = { readonly Type: 'mine' } | { readonly Type: 'number'; readonly Number: CellNumber };
    /**
     * Server-side truth of what each cell *is*.
     */
    type CellData = { readonly Content: CellContent; readonly Position: number; }
}
