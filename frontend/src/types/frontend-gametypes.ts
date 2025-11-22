// types only frontend cares about

/**
 * Public-facing data representation of cell, only for frontend.
 */
export type PublicCellData =
{
  readonly Content: GameTypes.CellContent | null; // necessary because we want null to be assignable for unknown Content values (stored on server)
  readonly State: CellState;
}

/**
 * Frontend representation of the cell's visual state.
 */
export type CellState = { readonly Visibility: 'revealed' } | { readonly Visibility: 'hidden'; readonly Flagged: boolean };