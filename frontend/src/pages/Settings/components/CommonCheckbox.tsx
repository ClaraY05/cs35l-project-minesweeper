import { useState } from "react";

interface CheckboxProps {
    label: string;           
    defaultChecked?: boolean;
  }

const Checkbox:React.FC<CheckboxProps> = ({ label, defaultChecked = false })=>{
    // set state vars
    const [checked, setChecked] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);};

    return (
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
          />
          {label}
        </label>
    );
};

export default Checkbox;