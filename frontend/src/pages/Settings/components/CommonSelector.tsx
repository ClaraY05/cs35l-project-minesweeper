import { useState, useEffect } from "react";

interface SelectorProps {
    label: string;            
    options: string[];       
    // defaultValue?: string;
    value: string;  
    onChange?: (value: string) => void;
  }

  // const Selector: React.FC<SelectorProps> = ({ label, options, defaultValue, onChange }) => {
  const Selector: React.FC<SelectorProps> = ({ label, options, value, onChange }) => {
    const [selected, setSelected] = useState(value);
  
    const handleSelect = (value: string) => {
      setSelected(value);
      if (onChange) onChange(value); // notify parent if callback provided
    };
    useEffect(()=> {setSelected(value)},[value]); // sync child with parent if parent's value changed through other reasons
  
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