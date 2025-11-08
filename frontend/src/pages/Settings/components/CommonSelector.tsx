import { useState } from "react";

interface SelectorProps {
    label: string;            
    options: string[];       
    defaultValue?: string;  
    onChange?: (value: string) => void;
  }

  const Selector: React.FC<SelectorProps> = ({ label, options, defaultValue, onChange }) => {
    const [selected, setSelected] = useState(defaultValue ?? options[0]);
  
    const handleSelect = (value: string) => {
      setSelected(value);
      if (onChange) onChange(value); // notify parent if callback provided
    };
  
    return (
      <div>
        <div>{label}</div>
        <div>
          {options.map(option => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                border: selected === option ? "2px solid #007bff" : "1px solid gray",
                backgroundColor: selected === option ? "#e6f0ff" : "#fff",
                fontWeight: selected === option ? "bold" : "normal",
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

export default Selector;