import { useState, useEffect } from "react";

interface SliderProps {
    label: string;        
    nowValue: number;  
    min?: number;      
    max?: number;
    onChange?: (nowValue: number) => void;
    displayValue?: (value: number) => string; // Add this line
  }
  
const Slider: React.FC<SliderProps> = ({label, nowValue, min = 1, max = 100, onChange, displayValue}) => {
    const [value, setValue] = useState(nowValue);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      setValue(next);
      if (onChange) onChange(next)
    };
    useEffect(()=>{setValue(nowValue)},[nowValue])
  
    const percentage = ((value - min) / (max - min)) * 100;
  
    return (
      <div className="w-full relative flex flex-row justify-between items-center">
        <label className="flex flex-shrink-0">
          <span className="font-bold uppercase text-xl p-1">{label}</span>
        </label>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          className="slider absolute left-[20%] w-[60%] flex flex-shrink-0"
          style={{ '--value': `${percentage}%` } as React.CSSProperties}
          onChange={handleChange}
        />
        <span className="font-bold uppercase p-1 text-xl absolute left-[80%] ml-2 flex flex-shrink-0">
          {displayValue ? displayValue(value) : `${value}%`}
        </span>
      </div>
    );
  };
  
  export default Slider;