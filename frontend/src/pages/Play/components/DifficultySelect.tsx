import './difficulty-select.css'

interface Props {
  value: GameTypes.Difficulty;
  onChange: (d: GameTypes.Difficulty) => void;
}

export default function DifficultySelect({ value, onChange }: Props) {
  return (
    <select id="difficulty-select" value={value} onChange={(e) => onChange(e.target.value as GameTypes.Difficulty)}>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>
  );
}
