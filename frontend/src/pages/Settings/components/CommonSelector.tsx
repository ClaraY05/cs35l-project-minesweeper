import { useState, useEffect } from "react";

interface SelectorProps {
    label: string;            
    options: string[];       
    value: string;  
    onChange?: (value: string) => void;
  }

  const Selector: React.FC<SelectorProps> = ({ label, options, value, onChange }) => {
    const [selected, setSelected] = useState(value);
  
    const handleSelect = (value: string) => {
      setSelected(value);
      if (onChange) onChange(value); // notify parent if callback provided
    };
    useEffect(()=> {setSelected(value)},[value]); // sync child with parent if parent's value changed through other reasons
  
    return (
      <div className="flex flex-col w-full py-2">
        <div className="uppercase font-semibold text-xl">{label}</div>
        <div className="flex w-full">
          {options.map(option => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                border: selected === option ? "2px solid white" : "1px solid gray",
                backgroundColor: selected === option ? "rgba(192, 38, 211, 0.5)" : "rgba(0, 0, 0, 0.5)",
                fontWeight: selected === option ? "bold" : "normal",
                color: selected === option ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)",
              }}
              className="py-1 px-2 flex-1"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

export default Selector;