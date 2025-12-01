import { useState } from "react";

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  buttonText?: string;
  disabled?:boolean;
}

const TextInput = ({placeholder = "Enter text...", value="", onChange, onSubmit, buttonText = "Search", disabled=false}: TextInputProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    onSubmit(value);  
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-stone-900 rounded-sm p-1 focus:outline-none focus:border focus:border-white"
        disabled={disabled}
      />

      <button
        type="submit"
        className="hover:font-bold"
        disabled={disabled}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default TextInput;