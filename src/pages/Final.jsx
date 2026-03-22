import '../scss/mainPage.scss';
import {allFacs} from "../config";
import {motion} from 'framer-motion'
import {useEffect, useState} from "react";;
import Faculty from '../components/Faculty';
import { getData, getRelease, useCustomWebSocket } from '../services/api';

export default function Final() {
    const [finalists, setFinalists] = useState(null);
    const [finsOrdered, setFinsOrdered] = useState([]);
    const [released, setReleased] = useState(null);
    const [curAddedPoints, setCurAddedPoints] = useState('');
    const [pointsAnimation, setPointsAnimation] = useState('');

    useEffect(() => {
        getData((data) => setFinalists(data.parts));
        getRelease((data) => setReleased(data.released));
    }, [])

    useEffect(() => {
        if (!finalists || !released) {
            console.log('Недостаточно данных!');
            return;
        }

        const newData = Object.entries(finalists).map(
            ([fin, points]) => [
                fin, 
                points.judge + (released.includes(fin) ? points.audience : 0),
            ]
        );
        
        newData.sort((a, b) => b[1] - a[1]);
        setFinsOrdered(newData);
    
    }, [finalists, released]);

    const lastJsonMessage = useCustomWebSocket();

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === 'data-updated') {
            const newReleased = lastJsonMessage.data; 
            setReleased(newReleased);

            if (!newReleased.length) {
                setCurAddedPoints('');
                return;
            }

            const lastReleased = newReleased[newReleased.length - 1];
            setCurAddedPoints(finalists[lastReleased].audience);
            setPointsAnimation('animatedPoints');
            setTimeout(() => setPointsAnimation(''), 1000);

            setFinsOrdered(prev => {
                const newOrder = prev.map(([fac, points]) => 
                    fac === lastReleased
                        ? [fac, finalists[fac]?.judge + finalists[fac]?.audience]
                        : [fac, points]
                );
                return newOrder.sort((a, b) => b[1] - a[1]);
            });
        }
    }, [lastJsonMessage, finalists]);

    return (
            <div className="App">
                <div className="right">
                    <div className="FacultyPointList">
                        {
                            Object.values(finsOrdered).map(([fac, points]) =>
                                <motion.div layout key={fac} transition={{ duration: 1 }}>
                                    <Faculty 
                                        key={fac} 
                                        facultyInfo={allFacs[fac]} 
                                        points={points}
                                        className={released.includes(fac) ? 'allPoints' : ''}
                                    />
                                </motion.div>
                            )
                        }
                    </div>
                    <div className="addedPoints">
                        <span className={pointsAnimation}>{curAddedPoints}</span>
                    </div>
                </div>
                <div className="column">
                    <div className="video"/>
                </div>
            </div>
    )
}
