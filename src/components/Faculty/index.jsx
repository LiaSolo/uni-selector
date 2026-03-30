import {useEffect, useState} from "react";
import cn from 'classnames';
import './styles.scss'


// facultyInfo: logo, name, styles (config.js)
export default function Faculty({facultyInfo, className = '', points, onDoubleClick}) {
    const [gradient, setGradient] = useState(false);
    const [showInfo, setShowInfo] = useState(className !== 'winnerReleased');
    
    useEffect(() => {
        if (!facultyInfo) {
            setShowInfo(false);
            return;
        }
        
        if (className === 'winnerReleased') {
            setGradient(true);

            setTimeout(() => {
                setShowInfo(true);
            }, 1000);

            setTimeout(() => {
                setGradient(false);
            }, 2000);
        }
    }, [className, facultyInfo]);

    //useEffect(() => console.log(showInfo, facultyInfo), [showInfo, facultyInfo]);

    return (
        <div className={cn("faculty", className)} onDoubleClick={onDoubleClick}>
            {showInfo && facultyInfo && 
                <>
                    <img src={`/assets/logos/${facultyInfo.logo}`}/>
                    {facultyInfo.name}
                    <span className='points'>
                        <span style={{color: 'red'}}>{points}</span>
                        <span>{points}</span>
                    </span>
                    
                </>
            }
            {gradient && <div className="gradient"  style={facultyInfo.styles}/>}         
        </div>
    );
}
