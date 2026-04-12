import '../scss/mainPage.scss';
import {allFacs} from "../config";
import {motion} from 'framer-motion'
import {useEffect, useLayoutEffect, useState} from "react";;
import Faculty from '../components/Faculty';
import { getData, getRelease, useCustomWebSocket } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import cn from 'classnames';

const basePoints = [8, 6, 5, 4, 3, 2, 1]

export default function FinalJudge() {
    const [finsOrdered, setFinsOrdered] = useState([]);
    const [released, setReleased] = useState([]); // глашатаи, которых показали
    const [releasedLength, setReleasedLength] = useState(0);
    const [queueLength, setQueueLength] = useState(0); // кол-во глашатаев

    const [curAddedPoints, setCurAddedPoints] = useState({points: {}});
    const [pointsAnimation, setPointsAnimation] = useState('');
    
    const lastJsonMessage = useCustomWebSocket();

    useEffect(() => {
        getData((data) => {
            setFinsOrdered(data.parts);
        });
        getRelease((data) => {
            setReleased(data.released);
            setQueueLength(data.queue.length / 2);
        });
    }, [])


    useLayoutEffect(() => {
        console.log('lastJsonMessage', lastJsonMessage)
        if (lastJsonMessage && lastJsonMessage.type === 'data-updated') {
            //setReleased(prev => [...prev, lastJsonMessage.data]);
            setReleased(lastJsonMessage.data);
        }
    }, [lastJsonMessage]);

    useLayoutEffect(() => {
        setReleasedLength(Math.ceil(released.length / 2));

        if (released.length === 0) {
            setCurAddedPoints({points: {}});
            setPointsAnimation('');

            return;
        }

        const lastReleased = released.at(-1);
        const isNewFaculty = (released.length % 2); // 0 => false, 1 => true

        if (isNewFaculty) {
            setPointsAnimation('');
            setCurAddedPoints(prev => {
                const tempPoints = {...prev.points};

                Object.keys(prev.points).forEach((fac) => {
                    tempPoints[fac].curAdded = 0;
                });

                return { name: lastReleased.name, points: tempPoints };
            });
        }

        setTimeout(() => {
            setPointsAnimation('awarded');
            setCurAddedPoints(lastReleased);
        }, isNewFaculty ? 3000 : 0);

    }, [released]);

    useLayoutEffect(() => {
        if (!Object.keys(curAddedPoints.points).length) {
            return;
        }

        setFinsOrdered(prev => prev.toSorted((a, b) =>
            curAddedPoints.points[b].total - curAddedPoints.points[a].total,
        ));

    }, [curAddedPoints]);

    return (
            <div className="App">
                <div className="thinSide">
                    <div className="logo"/>
                    <div className="FacultyPointList">
                        {
                            finsOrdered.map((fac) =>
                                <motion.div layout key={fac} transition={{ duration: 1, delay: 2 }}>
                                    <Faculty 
                                        key={fac} 
                                        facultyInfo={allFacs[fac]}
                                        curPoints={curAddedPoints.points[fac]?.curAdded || ''} 
                                        allPoints={curAddedPoints.points[fac]?.total || 0}
                                    />
                                </motion.div>
                            )
                        }
                    </div>
                    
                </div>
                <div className="thinSide">
                    <div className="video">{curAddedPoints.name}</div>
                    <ProgressBar label={`Проголосовало факультетов ${releasedLength} из ${queueLength}`}
                    curProgress={releasedLength / (queueLength || 1) * 100 || 0}/>
                    <div className='pointsLine'>
                        <span className={cn('point', 'highScore', releasedLength && !(released.length % 2) && 'awarded')}>10</span>
                        {basePoints.map(point => <span key={point} className={cn('point', pointsAnimation)}>{point}</span>)}
                    </div>
                </div>
            </div>
    )
}
