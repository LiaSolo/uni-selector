import '../scss/settingsPage.scss';
import FacultySettings from '../components/FacultySettings'
import { useCallback, useEffect, useState, useRef } from 'react';
import Sortable from 'sortablejs';
import { Link } from 'react-router-dom';
import RadioButton from '../components/radioButton';
import { allFacs } from '../config';
import { getSettings, saveData, saveRelease, saveSettings } from '../services/api';
import { settingsFormatter } from '../services/settingsFormatter';
import Button from '../components/Button';
import cn from 'classnames';
import summurizeServerResponse from '../services/summurizeServerResponse';

const initSettings = {};
Object.keys(allFacs).forEach((fac) => 
    initSettings[fac] = {
        semi: 1,
        isFinal: false,
        isParticipant: true,
        scoreJudge: 0,
        scoreAudience: 0,
    }
);

export default function Settings() {  
    const [selectedRound, setSelectedRound] = useState(0);
    const [lastWinner, setLastWinner] = useState('');
    const [serverMessage, setServerMessage] = useState('');
    const [isHideCheckbox, setIsHideCheckbox] = useState(false);
    const [facSettings, setFacSettings] = useState(initSettings); 
    const [facOrder, setFacOrder] = useState(Object.keys(allFacs)); 

    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const sortable = new Sortable(containerRef.current, {
            animation: 150,
            
            onEnd: () => {
                const items = containerRef.current.querySelectorAll('.row');
                const newOrder = Array.from(items).map(item => item.dataset.id);
                setFacOrder(newOrder);        
            },
        });

        return () => sortable.destroy();
    }, []);

    const fetchSettings = useCallback((rawSettings) => {
        rawSettings.lastWinner && setLastWinner(rawSettings.lastWinner)
        rawSettings.facs && setFacSettings(prevSettings => ({...prevSettings, ...rawSettings.facs}))
        rawSettings.facs && setFacOrder(Object.keys({...rawSettings.facs, ...allFacs}))
    }, [])

    useEffect(() => {
        getSettings(fetchSettings)
    }, [fetchSettings]);

    useEffect(() => {
        console.log(serverMessage)
        setTimeout(() => {serverMessage && setServerMessage('')}, 5000)
    }, [serverMessage]);

    const updateOneFacOneSetting = (name, setting) => {
        // setting: {key: value}
        const newData = {...facSettings[name], ...setting}
        setFacSettings({...facSettings, [name]: newData})
    };

    const handleSave = async() => {
        const resultSettings = {
            facs: facOrder.reduce((res, fac) => ({...res, [fac]: facSettings[fac]}), {}),
            lastWinner: lastWinner,
        };

        const {queue, ...data} = settingsFormatter(resultSettings, selectedRound);

        setServerMessage(await summurizeServerResponse(
            saveSettings(resultSettings),
            saveData(data),
            saveRelease({
                queue: queue,
                released: [],
                round: selectedRound, 
            }),
        ));
    }

    const handleReset = async () => {
        setSelectedRound(0);
        setLastWinner('');
        setFacSettings(initSettings);
        setFacOrder(Object.keys(initSettings))
        setIsHideCheckbox(false);

        setServerMessage(await summurizeServerResponse(
            saveSettings({}),
            saveRelease({}),
            saveData({}),
        ));
    }

    return (
        <div className='settingsPage'>
            <div className='header'>
                    <label className='hideCheckbox'>
                        <input 
                        type='checkbox' 
                        checked={isHideCheckbox}
                        onChange={(e) => setIsHideCheckbox(e.target.checked)}
                    />
                        скрыть неучастников
                    </label>

                <span className='flexContainer'>
                    Показать только
                    <RadioButton 
                        label="всё"
                        isSelected={selectedRound === 0}
                        onChange={() => setSelectedRound(0)}
                    />
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
            <div className='contentHeader'>
                <span>участвует вообще?</span>
                <span>факультет</span>
                <span>кто win в прш году?</span>
                <span>какой полуфинал?</span>
                <span>прошел в финал?</span>
                <span>баллы финала</span>
            </div>
            <div className='mainContent' ref={containerRef}>
               {facOrder.map((key) => 
                   (!isHideCheckbox || facSettings[key].isParticipant) &&
                    <FacultySettings
                            id={key}
                            key={key} 
                            name={allFacs[key].name} 
                            isLastWinner={lastWinner === key}
                            setLastWinner={() => setLastWinner(key)}
                            showOption={selectedRound}
                            serverData={facSettings[key]}
                            serverUpdate={(newData) => updateOneFacOneSetting(key, newData)} 
                        />
                )} 
            </div>
            

            <div className='footer'>
                <Button type={'primary'} onClick={handleSave}>Сохранить</Button>
                
                <Button type={'secondary'} onClick={handleReset}>Сбросить всё на#уй</Button>
                <Link to="release">
                    <Button type={'dangerous'}>К релизу</Button>
                </Link>
            </div>
            {
                serverMessage && <span className={cn('serverMessage', serverMessage)}>{serverMessage}</span>
            }

        </div>
    )

};