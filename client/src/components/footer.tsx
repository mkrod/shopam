import React from 'react'
import "./css/footer.css";
import { appLogoUri } from '@/constants';
import { useGlobalProvider } from '@/constants/provider';



const Footer : React.FC = () : React.JSX.Element => {
    const { display } = useGlobalProvider();
  return (
    <div className='footer_container'>
        <div className="home_newsletter_section_container">
            {!display.mobile && <h1 className="home_newsletter_head_text">Subscribe for newsletter</h1>}
            {display.mobile && <h2 className="home_newsletter_head_text">Subscribe for newsletter</h2>}
            <div className="home_newsletter_sub_text">Enter your email if you'll like to get updates on new products, offers, event, and more...</div>
            <div className="home_newsletter_input_container">
                <input type="text" name=""placeholder='Enter your email' className="home_newsletter_input" />
                <button className='home_newsletter_button'>Subscribe</button>
            </div>
        </div>
        <div className="footer_container_up">
            <div className="footer_container_up_section">
                <span className='footer_container_up_section_header'>
                    <img src={appLogoUri} className='footer_app_logo_image' />
                </span>
                <a className='footer_container_up_section_text'></a>
            </div>
            <div className="footer_container_up_section">
                <span className='footer_container_up_section_header'>Company</span>
                <a href='/' className='footer_container_up_section_text'>Home</a>
                <a href='/about' className='footer_container_up_section_text'>About</a>
                <a href='/support' className='footer_container_up_section_text'>Contact us</a>
                <a href='/term-of-service' className='footer_container_up_section_text'>Term of service</a>
            </div>
            <div className="footer_container_up_section">
                <span className='footer_container_up_section_header'>Get in touch</span>
                <a href='' className='footer_container_up_section_text'>Email</a>
                <a href='https://www.mkgameo.xyz' className='footer_container_up_section_text'>Developer</a>
            </div>
        </div>
        
        <div className="footer_container_down">
        Copyright {new Date().getFullYear()} &copy; MkTech.dev All Right Reserved
        </div>
    </div>
  )
}

export default Footer