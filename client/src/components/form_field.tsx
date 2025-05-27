import React, { HTMLInputTypeAttribute } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';



interface Prop {
    value: string | number;
    changeHandler: (value?: string | number) => void;
    icon: React.ReactElement;
    type: HTMLInputTypeAttribute;
    show?: boolean;
    toggleShow?: (value?: boolean) => void;
}

const FormField : React.FC<Prop> = ({ value, changeHandler, icon, type, show, toggleShow }) : React.JSX.Element => {


  return (
    <div className="auth_input_box_container">
    <div className="auth_input_box_icon_container">
        {icon}
    </div>
    <input type={type} value={value} onChange={(e) => {
        const value = e.target.value;
        changeHandler(value);
    }} name="" className="auth_input" placeholder='Enter your password' />
    {type === "password" && <div onClick={() => toggleShow ? toggleShow(!show) : null} className="auth_input_show_hide">
        {type !== "password" && <AiFillEye size={20} />}
        {type === "password" && <AiFillEyeInvisible size={20} />}
    </div>}
    </div>
  )
}

export default FormField