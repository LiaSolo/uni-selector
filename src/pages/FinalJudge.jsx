import '../scss/mainPage.scss';
import {allFacs} from "../config";
import {motion} from 'framer-motion'
import {useEffect, useState} from "react";;
import Faculty from '../components/Faculty';
import { getData, getRelease, getJudges, useCustomWebSocket } from '../services/api';
import ProgressBar from '../components/ProgressBar';

const points = [10, 8, 6, 5, 4, 3, 2, 1]

export default function FinalJudge() {
    const [finalists, setFinalists] = useState(null);
    const [finsOrdered, setFinsOrdered] = useState([]);
    const [released, setReleased] = useState(null); // глашатаи, которых показали
    const [releasedLength, setReleasedLength] = useState(0);
    const [queue, setQueue] = useState(null); // глашатаи все
    const [judgeScore, setJudgeScore] = useState(null); //все баллы глашатаев
    // const [curAddedPoints, setCurAddedPoints] = useState('');
    // const [pointsAnimation, setPointsAnimation] = useState('');

    useEffect(() => {
        // начальное состояние: в порядке выступления
        getData((data) => setFinalists(data.parts));
        getRelease((data) => {
            setReleased(data.released);
            setReleasedLength(data.released.length);
            setQueue(data.queue);
        });
        getJudges(setJudgeScore);
    }, [])

    useEffect(() => {
        if (!finalists || !released || !queue) {
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
    
    }, [finalists, released, queue]);

    const lastJsonMessage = useCustomWebSocket();

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === 'data-updated') {
            const newReleased = lastJsonMessage.data; 
            setReleased(newReleased);

            // if (!newReleased.length) {
            //     setCurAddedPoints('');
            //     return;
            // }

            const lastReleased = newReleased[newReleased.length - 1];
            // setCurAddedPoints(finalists[lastReleased].audience);
            // setPointsAnimation('animatedPoints');
            // setTimeout(() => setPointsAnimation(''), 1000);

            setFinsOrdered(prev => {
                // const newOrder = prev.map(([fac, points]) => 
                //     fac === lastReleased
                //         ? [fac, finalists[fac]?.judge + finalists[fac]?.audience]
                //         : [fac, points]
                // );
                const newOrder = prev.map(([fac, points]) => [
                    fac, 
                    points + (judgeScore[lastReleased][fac] || 0)
                ]);
                // const newOrder = prev.toSorted(([facA, pointsA], [facB, pointsB]) => 
                //     fac === lastReleased
                //         ? [fac, finalists[fac]?.judge + finalists[fac]?.audience]
                //         : [fac, points]
                // );
                return newOrder.sort((a, b) => b[1] - a[1]);
            });
        }
    }, [lastJsonMessage, finalists, judgeScore]);

    return (
            <div className="App">
                <div className="right">
                    <div className="logo"/>
                    <div className="FacultyPointList">
                        {
                            Object.values(finsOrdered).map(([fac, points]) =>
                                <motion.div layout key={fac} transition={{ duration: 1 }}>
                                    <Faculty 
                                        key={fac} 
                                        facultyInfo={allFacs[fac]}
                                        curPoints={judgeScore[released[releasedLength - 1]][fac] || 0} 
                                        allPoints={points}
                                    />
                                </motion.div>
                            )
                        }
                    </div>
                    
                </div>
                <div className="right">
                    <div className="video">{released && released[releasedLength - 1]}</div>
                    <ProgressBar label={`Проголосовало факультетов ${releasedLength} из ${queue?.length || 0}`}
                    curProgress={queue?.length && releasedLength / queue?.length * 100 || 0}/>
                    <div className='pointsLine'>
                        {points.map(point => <span key={point} className='point'>{point}</span>)}
                    </div>
                </div>
            </div>
    )
}
