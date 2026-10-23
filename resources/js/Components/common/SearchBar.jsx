import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Rechercher...',
  debounceMs = 300,
  className = '',
  autoFocus = false,
  id,
}) {
  const [innerValue, setInnerValue] = useState(value);
  const isFirstMount = useRef(true);
  const timerRef = useRef(null);

  // Sync internal state when controlled value prop changes from outside
  useEffect(() => {
    if (value !== innerValue) {
      setInnerValue(value);
    }
  }, [value]);

  // Handle debounced search notification
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange?.(innerValue);
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [innerValue, debounceMs, onChange]);

  const handleInputChange = (e) => {
    setInnerValue(e.target.value);
  };

  const handleClear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setInnerValue('');
    onChange?.('');
  };

  return (
    <div className={`search-bar-wrapper ${className}`}>
      <Search className="search-bar-icon" size={18} />
      <input
        id={id}
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={innerValue}
        onChange={handleInputChange}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      {innerValue && (
        <button
          type="button"
          className="search-bar-clear-btn"
          onClick={handleClear}
          aria-label="Effacer la recherche"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
