import React from 'react'
import "./css/footer.css";
import { appLogoUri } from '@/constants';



const Footer : React.FC = () : React.JSX.Element => {
  return (
    <div className='footer_container'>
        <div className="footer_container_up">
            <div className="footer_container_up_section">
                <span className='footer_container_up_section_header'>
                    <img src={appLogoUri} className='footer_app_logo_image' />
                </span>
                <a className='footer_container_up_section_text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, velit. Nulla beatae temporibus, velit ex natus laudantium illo. Tenetur possimus, sequi soluta quia mollitia atque. Adipisci quidem quo nulla voluptatum.</a>
            </div>
            <div className="footer_container_up_section">
                <span className='footer_container_up_section_header'>Company</span>
                <a href='' className='footer_container_up_section_text'>Home</a>
                <a href='' className='footer_container_up_section_text'>About</a>
                <a href='' className='footer_container_up_section_text'>Contact us</a>
                <a href='' className='footer_container_up_section_text'>Privacy policy</a>
            </div>
            <div className="footer_container_up_section">
                <span className='footer_container_up_section_header'>Get in touch</span>
                <a href='' className='footer_container_up_section_text'>+234 812 345 6789</a>
                <a href='' className='footer_container_up_section_text'>mkrodsullivan@gmail.com</a>
            </div>
        </div>
        <div className="footer_container_down">
        Copyright {new Date().getFullYear()} &copy; MkTech.dev All Right Reserved
        </div>
    </div>
  )
}

export default Footer