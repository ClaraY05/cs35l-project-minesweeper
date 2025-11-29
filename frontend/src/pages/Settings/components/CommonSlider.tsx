import { useState, useEffect } from "react";

interface SliderProps {
    label: string;        
    nowValue: number;  
    min?: number;      
    max?: number;
    onChange?: (nowValue: number) => void;             
  }
  
const Slider: React.FC<SliderProps> = ({label, nowValue, min = 1, max = 100, onChange}) => {
    const [value, setValue] = useState(nowValue);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      setValue(next);
      if (onChange) onChange(next)
    };
    useEffect(()=>{setValue(nowValue)},[nowValue])
  
    return (
      <div>
        <label >
          <span>{label}</span>
        </label>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
        />
        <span>{value}%</span>
      </div>
    );
  };
  
  export default Slider;