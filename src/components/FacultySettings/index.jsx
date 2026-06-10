import cn from 'classnames';
import Toggle from '../Toggle';
import './styles.scss';
import RadioButton from '../radioButton';


export default function FacultySettings({
    id,
    name,
    isLastWinner,
    setLastWinner,
    serverData: { semi, isFinal, isParticipant },
    serverUpdate,
}
) { 
    return (
        
                <div className='row' data-id={id}>
                    <input 
                        type='checkbox' 
                        checked={isParticipant}
                        onChange={(e) => serverUpdate({isParticipant: e.target.checked})}
                    />
                    <div className={cn('nameContainer', !isParticipant ? 'disabled' : '')}>{name}</div>

                    {isParticipant && 
                        <>
                            <RadioButton
                                isSelected={isLastWinner} 
                                onChange={setLastWinner}
                            />
                            <Toggle 
                                curOption={semi === 1} 
                                setCurOption={(newValue) => serverUpdate({semi: newValue ? 1 : 2})} 
                                option1='1пф' 
                                option2='2пф'
                                className={isLastWinner && "hidden"}
                            />
                            <input 
                                type='checkbox' 
                                checked={isFinal}
                                disabled={isLastWinner}
                                onChange={(e) => serverUpdate({isFinal: e.target.checked})}
                            />
                        </> 
                    }
                </div>
        
    )

};