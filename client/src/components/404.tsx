import React from 'react';
import "./css/404.css";
import { useNavigate } from 'react-router';
import { useGlobalProvider } from '@/constants/provider';


const NotFound : React.FC = () => {
  const navigate = useNavigate()
  const {display} = useGlobalProvider();

  return (
    <div className="not-found-container">
      <h3 className="not-found_nav">404 Not found</h3>
        <div className="not-found_display">
          {!display.mobile && <div className="not-found-display__img">
            <img src="/Scarecrow.png" alt="404-Scarecrow" className='not-found_image' />
          </div>}
          <div className="not-found-display__content">
              <h2 className="not-found-display__content--info">I have bad news for you</h2>
              <p className="not-found-display__content--text">
                The page you are looking for might be removed or is temporarily
                unavailable
              </p>
              <button onClick={() => navigate("/", {replace: true})} className="not-found_btn">Back to homepage</button>
          </div>
        </div>
      </div>
  )
}

export default NotFound