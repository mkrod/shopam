import React, { useEffect, useState } from 'react'
import "./css/activity_loader.css";

const ActivityIndicator : React.FC<{size: "small" | "medium" | "large"}> = ({size}) : React.JSX.Element => {
    const [width, setWidth] = useState<string>("");

    useEffect(() => {
        const width = size === "small" ? "20px" : size === "medium" ? "30px" : "40px";
        setWidth(width);
    }, [])
  return (
    <div style={{width: width}} className='activity_indicator_loader'>
    </div>
  )
}

export default ActivityIndicator