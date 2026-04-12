import cn from 'classnames';
import Toggle from '../Toggle';
import './styles.scss';
import ScoreInput from '../ScoreInput';
import RadioButton from '../radioButton';

// showOption 1 <=> curToggleOption
// showOption 2 <=> !curToggleOption
// showOption 3 <=> curIsFinal


export default function FacultySettings({
    id,
    name,
    isLastWinner,
    setLastWinner,
    serverData: { semi, isFinal, isParticipant, scoreJudge, scoreAudience },
    serverUpdate,
    showOption = 0,
}
) { 
    //const finalist = isLastWinner || isFinal;
    const isDisplay = (showOption === 0 
        || (!isLastWinner && showOption === semi && isParticipant) 
        || (showOption === 3 && isFinal && isParticipant)
    )

    return (
        
                <div className={cn('row', !isDisplay ? 'noDisplay' : '')} data-id={id}>
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
                            {/* {isFinal &&
                                <>
                                    <ScoreInput 
                                        label="жюри" 
                                        curScore={scoreJudge} 
                                        setCurScore={(newValue) => serverUpdate({scoreJudge: newValue})} 
                                    />
                                    <ScoreInput 
                                        label="зрители" 
                                        curScore={scoreAudience} 
                                        setCurScore={(newValue) => serverUpdate({scoreAudience: newValue})}
                                    />
                                </>
                            } */}
                        </> 
                    }
                </div>
        
    )

};