import React, { useState } from 'react'
import "./css/mobile.css";
import { useNavigate } from 'react-router'

export interface Bar{
    name: string;
    icon: {
        solid: React.ReactNode,
        outline: React.ReactNode,
    };
    color?: string;
    path: string;
}

interface Props {
    tabs: Bar[];
}

const MobileNavbar : React.FC<Props> = (prop) : React.JSX.Element => {
    const [active, setActive] = useState<string>(window.location.pathname);
    const navigate = useNavigate();

    const Icon  : React.FC<Bar> = (prop) : React.JSX.Element => {

        const isActive = active === prop.path;

        return(
            <div onClick={() => {
                navigate(prop.path);
                setActive(prop.path);
                }} className='mobile_tab_bar_icon_container'>
                <div 
                style={{backgroundColor: isActive ? "var(--accent)" : "var(--background-color)"}} 
                className='mobile_tab_bar_icon_active_bar'></div>
                <div className='mobile_tab_bar_icon'>{isActive ? prop.icon.solid : prop.icon.outline}</div>
                <span style={{color: isActive ? "var(--accent)" : "var(--color)"}} className='mobile_tab_bar_icon_label'>{prop.name}</span>
            </div>
        )
    }


  return (
    <div className='mobile_tab_bar_container'>
        {prop.tabs && prop.tabs.length > 0 && prop.tabs.map((item: Bar, index: number) => (
            <Icon 
             key={index}
             name={item.name}
             icon={item.icon}
             path={item.path}
             />
        ))}
    </div>
  )
}

export default MobileNavbar