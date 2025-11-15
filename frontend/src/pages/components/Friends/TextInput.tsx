import { useState } from "react";

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

function TextInput ({placeholder = "Enter text...", value="", onChange, onSubmit,}: TextInputProps){
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    onSubmit(value);  
  };

  return (
    <form onSubmit={handleSubmit} >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      <button
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default TextInput;