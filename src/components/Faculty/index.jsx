import {useEffect, useLayoutEffect, useState} from "react";
import {motion} from 'framer-motion'
import cn from 'classnames';
import './styles.scss'


// facultyInfo: logo, name, styles, color (config.js)
export default function Faculty({
    facultyInfo, 
    className = '', 
    curPoints = '', 
    allPoints = '', 
    onDoubleClick
}) {
    const [gradient, setGradient] = useState(false);
    const [prevPoints, setPrevPoints] = useState({cur: '', total: ''});
    const [showInfo, setShowInfo] = useState(className !== 'winnerReleased');
    
    useLayoutEffect(() => {
        if (!facultyInfo) {
            setShowInfo(false);
        }
    }, [facultyInfo]);

    useEffect(() => {
        // TODO: if  (isReleased)
        if (className === 'winnerReleased' || curPoints) {
            setGradient(true);

            const timerInfo = 
                setTimeout(() => {
                    setShowInfo(true);
                }, 1000);

            const timerGradient =
                setTimeout(() => {
                    setGradient(false);
                }, 2000);

            return () => {
                clearTimeout(timerInfo);
                clearTimeout(timerGradient);
            }        
        }
    }, [className, curPoints, allPoints])

    useEffect(() => {
        const timer =
            setTimeout(() => {
                setPrevPoints({
                    cur: curPoints,
                    total: allPoints,
                });
            }, 1000);

        return () => clearTimeout(timer);

    }, [curPoints, allPoints])

    //useEffect(() => console.log(showInfo, facultyInfo), [showInfo, facultyInfo]);
    return (
        <motion.div 
            layout 
            transition={{ duration: 1 }}
            className={cn("faculty", className)} 
            onDoubleClick={onDoubleClick}
        >
            {showInfo && facultyInfo && 
                <>
                    <img src={`/assets/logos/${facultyInfo.logo}`}/>
                    <span className="facultyName">{facultyInfo.name}</span>
                    {(allPoints !== '') && 
                        <span className='points'>
                            <span className={!curPoints ? 'disappear': ''} style={{color: facultyInfo.color}}>{prevPoints.cur}</span>
                            <span>{prevPoints.total}</span>
                        </span>
                    }
                    
                </>
            }
            {gradient && <div className="gradient"  style={facultyInfo.styles}/>}         
        </motion.div>
    );
}
