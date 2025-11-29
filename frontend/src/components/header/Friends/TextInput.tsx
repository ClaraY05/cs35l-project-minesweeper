import { useState } from "react";

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const TextInput = ({placeholder = "Enter text...", value="", onChange, onSubmit,}: TextInputProps) => {
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