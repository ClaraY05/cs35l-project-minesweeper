/** global types for board data */

// possible states of cell
export type CellState = 'hidden' | 'revealed' | 'flagged';
// possible numbers contained in cell
export type CellNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
// cell contents
export type CellContent = { readonly Type: 'mine' } | { readonly Type: 'number'; readonly Number: CellNumber };
// full data representation of cell
export type CellData =
{
  readonly Content: CellContent, 
  readonly State: CellState
}