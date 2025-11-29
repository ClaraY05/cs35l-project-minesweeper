import './difficulty-select.css'

// game difficulty. might move to globals later.
export type Difficulty = "easy" | "medium" | "hard";

interface Props {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
}

export default function DifficultySelect({ value, onChange }: Props) {
  return (
    <select id="difficulty-select" value={value} onChange={(e) => onChange(e.target.value as Difficulty)}>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>
  );
}
