import './styles.scss';

export default function ProgressBar({
    label,
    curProgress, // %
}) {
    return (
        <label className='progressBar'>
            {label}
            <div className='bar'>
                <div className='progress' style={{width: `${curProgress}%`}}/>
            </div>
        </label>
    )
};