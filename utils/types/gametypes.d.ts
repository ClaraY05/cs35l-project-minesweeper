/** global types for board data */

declare namespace GameTypes {
// possible states of cell. frontend managed
    type CellState = { readonly Visibility: 'revealed' } | { readonly Visibility: 'hidden'; readonly Flagged: boolean };
// possible numbers contained in cell
    type CellNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
// cell contents. this is what the server manages
    type CellContent = { readonly Type: 'mine' } | { readonly Type: 'number'; readonly Number: CellNumber };
}
