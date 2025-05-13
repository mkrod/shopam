import React, { useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5'
import "./css/search_box.css";

interface Prop {
    onsearch: (value: string) => void; 
    clickEvevnt?: () => void; 
    editable?: boolean;
    onValueChange?: (searchTerm: string) => void;
}

const SearchBox : React.FC<Prop> = ({onsearch, clickEvevnt, editable = true, onValueChange}) : React.JSX.Element => {
    const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div onClick={clickEvevnt} className='search_box_container'>
        <IoSearchSharp />
        <input onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if(searchTerm.length < 1) return;
            if(e.key === "Enter") {
                onsearch(searchTerm);
                //return setSearchTerm("");
            }
        }} onChange={(e:  React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.currentTarget.value);
            onValueChange ? onValueChange(e.currentTarget.value) : null;
        }} 
        value={searchTerm}
        type='text' 
        className='search_box_input_field' 
        placeholder='Search' 
        readOnly={!editable}/>
    </div>
  )
}

export default SearchBox