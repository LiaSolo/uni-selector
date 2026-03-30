import '../scss/settingsPage.scss';
import FacultySettings from '../components/FacultySettings'
import { useCallback, useEffect, useState, useRef } from 'react';
import Sortable from 'sortablejs';
import { Link } from 'react-router-dom';
import RadioButton from '../components/radioButton';
import { allFacs } from '../config';
import { getData, getJudges, getSettings, saveData, saveJudges, saveRelease, saveSettings } from '../services/api';
import { settingsFormatter } from '../services/settingsFormatter';
import Button from '../components/Button';
import cn from 'classnames';
import summurizeServerResponse from '../services/summurizeServerResponse';
import TableRow from '../components/TableRow';

const initSettings = {};
Object.keys(allFacs).forEach((fac) => 
    initSettings[fac] = {
        isVoited: true,
        points: {}
    }
);

export default function ScoreSettings() {  
    const [serverMessage, setServerMessage] = useState('');
    const [isHideCheckbox, setIsHideCheckbox] = useState(false);
    const [facOrder, setFacOrder] = useState(Object.keys(allFacs)); 

    const [fins, setFins] = useState([]);
    const [judges, setJudges] = useState(initSettings);

    const containerRef = useRef(null);

    useEffect(() => {
        getJudges((data) => {
            //console.log('judge', data)
            if (!Object.keys(data).length) {
                return;
            }

            setJudges(prev => ({...prev, ...data})); // если уже есть настройки
        }); 

        // выявляем финалистов
        getSettings((rawSettings) => {
            //console.log(222, rawSettings.facs)
            if (!rawSettings.facs) {
                return;
            }

            setFins(
                // прошлогодний победитель + финалисты пф
                [
                    rawSettings.lastWinner,
                    ...Object.keys(allFacs).filter(fac => rawSettings.facs[fac].isFinal),
                ]
            );
            setFacOrder(Object.keys({...rawSettings.facs, ...allFacs}))
        });
 
    }, []);

    useEffect(() => {
        console.log(judges)
    }, [judges])

    useEffect(() => {
        //console.log(111, fins)
        if (!fins.length) {
            return;
        }

        //console.log(fins, judges)
        // const newJudges = {...judges}
        // //console.log(newJudges)
        // Object.keys(newJudges).forEach(fac => {
        //     fins.forEach((fin) => {
        //         newJudges[fac].points[fin] ||= 0
        //     });
        // });
        // setJudges(newJudges);

        setJudges(prev => {
            const newJudges = {...prev}
            //console.log(newJudges)
            Object.keys(newJudges).forEach(fac => {
                //console.log(fac, newJudges[fac])
                fins.forEach((fin) => {
                    newJudges[fac].points[fin] ||= 0
                });
            });

            return newJudges;
        })

        //setJudges(prev => Object.keys(prev).forEach(fac => prev[fac].points))
    }, [fins]);

    // устанавливаем порядок выступления глашатаев перетаскиванием
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

    // useEffect(() => {
    //     console.log(serverMessage)
    //     setTimeout(() => {serverMessage && setServerMessage('')}, 5000)
    // }, [serverMessage]);


    // const updateOneFacOneSetting = (name, setting) => {
    //     // setting: {key: value}
    //     //const newData = {...facSettings[name], ...setting}
    //     console.log(name, setting)
    //     setJudges( prev => ({
    //         ...prev, 
    //         [name]: {...prev[name], ...setting},
    //     }));
    // };

    const updateOneFacIsVoited = (name, newIsVoited) => {
        //console.log(name, setting)
        setJudges( prev => ({
            ...prev, 
            [name]: {
                isVoited: newIsVoited,
                points: prev[name].points
            },
        }));
    };

    const updateOneFacOnePoint = (name, setting) => {
        // setting: {fac: points}
        console.log(name, setting)
        setJudges( prev => ({
            ...prev, 
            [name]: {
                isVoited: prev[name].isVoited,
                points: {
                    ...prev[name].points,
                    ...setting,
                }
            },
        }));
    };

    const handleSave = async() => {
        // const resultSettings = {
        //     facs: facOrder.reduce((res, fac) => ({...res, [fac]: facSettings[fac]}), {}),
        //     lastWinner: lastWinner,
        // };

        // const {queue, ...data} = settingsFormatter(resultSettings, selectedRound);

        setServerMessage(await summurizeServerResponse(
            // saveSettings(resultSettings),
            // saveData(data),
            // saveRelease({
            //     queue: queue,
            //     released: [],
            //     round: selectedRound, 
            // }),
            saveJudges(judges),
        ));
    }

    const handleReset = async () => {
        // setSelectedRound(0);
        // setLastWinner('');
        // setFacSettings(initSettings);
        // setFacOrder(Object.keys(initSettings))
        // setIsHideCheckbox(false);

        setJudges(initSettings);
        setFacOrder(Object.keys(initSettings));
        setIsHideCheckbox(false);


        // saveSettings({});
        // saveRelease({});
        // saveData({});

        setServerMessage(await summurizeServerResponse(
            // saveSettings({}),
            // saveRelease({}),
            // saveData({}),
            saveJudges(judges),
        ));

        // const answers = await Promise.all([
        //     saveSettings({}),
        //     saveRelease({}),
        //     saveData({}),
        // ]);

        // const isError = answers.some(ans => ans.status === 'error')
        // setServerMessage(isError ? 'error' : 'ok');
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
                        скрыть неголосующих
                    </label>

            </div>
            <table className='mainContent'>
                <thead>
                    <tr>
                        <th className='firstColumn'></th>
                        {fins.map((fin, index) => (
                            <th key={index} className="rotatedHeader">
                                <div className='headerText'>{allFacs[fin].name}</div>
                            </th>
                        ))}
                    </tr> 
                </thead>
                <tbody ref={containerRef}>
                    {Object.keys(judges).map((herald) => (
                        <TableRow
                            key={herald}
                            id={herald}
                            rowName={allFacs[herald].name}
                            isActive={judges[herald].isVoited}
                            onChangeActive={(newValue) => updateOneFacIsVoited(herald, {isVoited: newValue})}
                            rowData={judges[herald].points}
                            onChangeCell={(newSetting) => updateOneFacOnePoint(herald, newSetting)}
                        />
                    ))}
                </tbody>
                <tfoot>
                    
                </tfoot>
            </table>
            

            <div className='footer'>
                <Button type={'primary'} onClick={handleSave}>Сохранить</Button>
                
                <Button type={'secondary'} onClick={handleReset}>Сбросить всё на#уй</Button>
                <Link to="/settings">
                    <Button type={'dangerous'}>К настройкам</Button>
                </Link>
                <Link to="/settings/release">
                    <Button type={'dangerous'}>К релизу</Button>
                </Link>
            </div>
            {
                serverMessage && <span className={cn('serverMessage', serverMessage)}>{serverMessage}</span>
            }

        </div>
    )

};