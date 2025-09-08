'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "검색...",
  className = "",
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className={`search-input ${className}`}>
      <Search className="search-input__icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`search-input__field ${isFocused ? 'search-input__field--focused' : ''}`}
      />
      {value && (
        <button
          onClick={handleClear}
          className="search-input__clear"
        >
          <X className="search-input__clear-icon" />
        </button>
      )}
    </div>
  );
}
