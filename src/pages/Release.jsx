import '../scss/settingsPage.scss';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion'
import RadioButton from '../components/radioButton';
import Button from '../components/Button';
import { allFacs } from '../config';
import { getData, getRelease, getSettings, saveData, saveRelease } from '../services/api';
import { settingsFormatter } from '../services/settingsFormatter';
import Faculty from '../components/Faculty';
import cn from 'classnames';
import summurizeServerResponse from '../services/summurizeServerResponse';

const helpText = [
    'Раунд не выбран',
    'Сейчас 1 полуфинал',
    'Сейчас 2 полуфинал',
    'Сейчас финал'
];


export default function Release() {  
    const [selectedRound, setSelectedRound] = useState(0);
    const [queue, setQueue] = useState([]);
    const [released, setReleased] = useState([]);
    const [disableNext, setDisableNext] = useState(true); 
    const [serverMessage, setServerMessage] = useState(''); 
    
    const releaseFormatter = useCallback((rawSettings) => {
        rawSettings.round && setSelectedRound(rawSettings.round);
        rawSettings.released && setReleased(rawSettings.released);
        rawSettings.queue && setQueue(rawSettings.queue);
    }, [])

    const setDataAndQueue = useCallback(async (rawSettings) => {
        const {queue, ...data} = settingsFormatter(rawSettings, selectedRound);

        setQueue(queue);
        setReleased([]);

        setServerMessage(await summurizeServerResponse(
            saveRelease({
                queue: queue,
                released: [],
                round: selectedRound,
            }),
            saveData(data),
        ));

    }, [selectedRound]);

    useEffect(() => {
        setDisableNext(!selectedRound || released.length === queue.length)
    }, [released, queue, selectedRound]);

    useEffect(() => {
+-        setTimeout(() => {serverMessage && setServerMessage('')}, 5000)
    }, [serverMessage]);

    const syncReleaseData = useCallback((data) => {
        if (data.round === selectedRound) {
            return;
        }

        getSettings(setDataAndQueue);
    }, [selectedRound, setDataAndQueue]);

    useEffect(() => {
        getRelease(releaseFormatter);
    }, [releaseFormatter]);


    useEffect(() => {
        selectedRound && getData(syncReleaseData);
    }, [selectedRound, syncReleaseData]);


    const handleNext = async () => {
        if (released.length < queue.length) {
            const newReleased = [...released, queue[released.length]];
            setReleased(newReleased);

            setServerMessage(await summurizeServerResponse(
                saveRelease({
                    queue: queue,
                    released: newReleased,
                    round: selectedRound,
                }),
            ));
        }
    }

    const handleResetLast = async () => {
        const newReleased = [...released];
        newReleased.pop();
        setReleased(newReleased);

        setServerMessage(await summurizeServerResponse(
            saveRelease({
                queue: queue,
                released: newReleased,
                round: selectedRound,
            }),
        ));
    }


    const handleResetAll = async () => {
        setReleased([]);

        setServerMessage(await summurizeServerResponse(
            saveRelease({
                queue: queue,
                released: [],
                round: selectedRound,
            }),
        ));
    }

    const handleDoubleClick = async  (clickedFac) => {
        if (released.includes(clickedFac)) {
            console.log('Нельзя менять порядок уже выпущенных')
            return;
        }

        const filteredQueue = queue.filter(fac => fac !== clickedFac);
        const newReleased = released.concat([clickedFac]);
        const newQueue = newReleased.concat(filteredQueue.slice(released.length));
        
        setQueue(newQueue);
        setReleased(newReleased);

        setServerMessage(await summurizeServerResponse(
            saveRelease({
                queue: newQueue,
                released: newReleased,
                round: selectedRound,
            })
        ));

        
    }

    return (
        <div className='settingsPage'>
            <div className='header'>

                <span className='flexContainer'>
                    Че у нас сейчас?
                    <RadioButton 
                        label="1 пф"
                        isSelected={selectedRound === 1}
                        onChange={() => setSelectedRound(1)}
                    />
                    <RadioButton 
                        label="2 пф"
                        isSelected={selectedRound === 2}
                        onChange={() => setSelectedRound(2)}
                    />
                    <RadioButton 
                        label="финал"
                        isSelected={selectedRound === 3}
                        onChange={() => setSelectedRound(3)}
                    />
                </span>
            </div>
            <div className='header queueHeader'>
                <span>ожидают</span>
                <span>выпущены</span>
            </div>
            <div className='mainContent'>
               {queue.map((fac) => 
                    <motion.div layout key={fac} transition={{ duration: 1 }}>
                        <Faculty 
                            key={fac} 
                            facultyInfo={allFacs[fac]} 
                            className={released.includes(fac) ? 'released' : ''}
                            onDoubleClick={() => handleDoubleClick(fac)}
                        />
                    </motion.div>
                )} 
            </div>
            

            <span className='warning'>{helpText[selectedRound]}</span>
            <div className='footer'>
                <span className='flexContainer'>
                    <Link to="/settings">
                        <Button type={'primary'}>К настройкам</Button>
                    </Link>
                    <Button type={'dangerous'} onClick={handleNext} disabled={disableNext}>Продвинуть сюжет</Button>    
                </span>
                <span className='flexContainer'>
                    <Button type={'pickme'} onClick={handleResetLast} disabled={!released.length}>Вернуть последнего</Button>
                    <Button type={'secondary'} onClick={handleResetAll} disabled={!released.length}>Вернуть всех</Button>
                </span>
                
            </div>
            {
                serverMessage && <span className={cn('serverMessage', serverMessage)}>{serverMessage}</span>
            }

        </div>
    )

};