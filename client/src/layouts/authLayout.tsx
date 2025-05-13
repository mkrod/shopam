import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import "./css/auth_layout.css";
import { FaApple, FaFacebook } from 'react-icons/fa6';
import { appleAuth, fbAuth, googleAuth } from '@/constants/auth';
import { FcGoogle } from 'react-icons/fc';


export interface AuthContext {
    meta: Meta;
    setMeta: React.Dispatch<React.SetStateAction<Meta>>;
}
type Meta = {
    text: string;
    switchText: string;
    switchLink: string;
    switchLinkText: string;
}
const AuthLayout : React.FC = () : React.JSX.Element => {

    const [meta, setMeta] = useState<Meta>();
    
    const auth  : {
        icon: React.ReactElement;
        text: string;
        action: () => void;
    }[] = [
        {
            icon: <FcGoogle size={20} />,
            text: "Continue With Google",
            action: googleAuth,
        },
        {
            icon: <FaFacebook size={20} color='blue' />,
            text: "Continue With Facebook",
            action: fbAuth,
        },
        {
            icon: <FaApple size={20} />,
            text: "Continue With Apple",
            action: appleAuth,
        },
    ]

  return (
    <div className='auth_layout_container'>
        <div className="auth_layout_content">
            <div className="auth_layout_content_text_container">
                <h2>{meta && meta.text}</h2>
            </div>
            <div className="auth_layout_top_container">
                <Outlet context={{setMeta}} />
            </div>
            <div className='auth_layout_hr_line_or'>
                <div className='auth_layout_hr_line'></div>
                <span className='auth_layout_or_text'>OR</span>
            </div>
            <div className="auth_layout_oauth_container">
                {auth.map((method, index: number) => (
                    <div onClick={method.action} key={index} className='auth_layout_oauth'>
                        <div className="auth_layout_oauth_icon">
                            {method.icon}
                        </div>
                        <h5 className='auth_layout_oauth_text'>{method.text}</h5>
                    </div>
                ))}
            </div>

            <div className="auth_layout_ui_switch">
                <span className='auth_layout_ui_switch_text'>{meta && meta.switchText}</span>
                {meta && <NavLink to={meta.switchLink} className='auth_layout_ui_switch_link'>{meta.switchLinkText}</NavLink>}
            </div>
        </div>
    </div>
  )
}

export default AuthLayout