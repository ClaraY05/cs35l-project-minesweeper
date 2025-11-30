import { useState, useEffect } from "react";

interface CheckboxProps {
    label: string;           
    // defaultChecked?: boolean;
    nowChecked: boolean;
    onChange?: (nowChecked: boolean) => void;
  }

// const Checkbox:React.FC<CheckboxProps> = ({ label, defaultChecked = false })=>{
const Checkbox:React.FC<CheckboxProps> = ({ label, nowChecked, onChange })=>{

    // set state vars
    const [checked, setChecked] = useState(nowChecked);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        setChecked(next);
        if (onChange) onChange(next); // notify parent if callback provided
    };
    useEffect(()=>{setChecked(nowChecked)},[nowChecked]);

    return (
        <label className="flex items-center gap-2 uppercase font-bold text-xl">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="custom-checkbox w-6 h-6 cursor-pointer"
          />
          {label}
        </label>
    );
};

export default Checkbox;