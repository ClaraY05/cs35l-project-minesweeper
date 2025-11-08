import { useState } from "react";

interface SliderProps {
    label: string;        
    defaultValue?: number;  
    min?: number;      
    max?: number;             
  }
  
const Slider: React.FC<SliderProps> = ({label, defaultValue = 67, min = 1, max = 100,}) => {
    const [value, setValue] = useState(defaultValue);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(Number(e.target.value));
    };
  
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