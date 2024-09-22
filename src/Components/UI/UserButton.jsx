import React, { useState } from "react";


const UserButton = ({ name }) => {
    const [ checkButton, setCheckButton ] = useState(false);
    const handleClick = () => {
        setCheckButton(!checkButton)
    }
    const clearLocalStorage = () => {
        localStorage.clear();
        window.location = "/"
    }
    return(
        <div className="user-wrapper">
            <div className="user-button" onClick={handleClick} >{name}</div>
            <button onClick={clearLocalStorage} className={checkButton ? 'active-button' : false} >Вихід</button>
        </div>
        
        
    )
}

export default UserButton