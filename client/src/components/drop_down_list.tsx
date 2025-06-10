import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import "./css/drop_down_list.css";



interface Option {
  label: string;
  value: string | number;
}

interface DropDownListProps {
  options: Option[];
  defaultLabel?: string;
  onSelect?: (option: Option) => void;
  otherStyle?: CSSProperties;
}

const DropDownList: React.FC<DropDownListProps> = ({
  options,
  defaultLabel = 'Select an option',
  onSelect,
  otherStyle
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={otherStyle} className="drop_down_list_container" ref={ref}>
      <div className="dropdown_down_list_toggle" onClick={handleToggle}>
        {selected ? selected.label : defaultLabel}
        <span className="dropdown_down_list_arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <ul className="dropdown_down_list_menu">
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown_down_list_item"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDownList;
