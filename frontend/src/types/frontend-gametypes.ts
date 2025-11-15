// full public data representation of cell
// necessary because we want null to be assignable for unknown Content values (stored on server)
export type PublicCellData =
{
  readonly Content: GameTypes.CellContent | null; 
  readonly State: GameTypes.CellState;
}