// global types for board data
// possible states of cell
export type CellState = 'hidden' | 'revealed' | 'flagged';
// possible numbers contained in cell
export type CellNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/** The underlying content of a cell */
export type CellData =
{
  readonly Data: { readonly Content: 'mine' } | { readonly Content: 'number'; readonly Number: CellNumber }, 
  readonly State: CellState
}