import { ChangeEvent, Dispatch, forwardRef, KeyboardEvent, SetStateAction } from 'react';
import './style.css';

//  interface Propertis
interface Props {
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    value: string;
    // setValue: Dispatch<SetStateAction<string>>;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error: boolean;

    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-lignt-icon';
    onButtonClick?: () => void;

    message?: string;

    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onClick?: () => void;
}

//       component: Input Box 컴포넌트
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

    //      state: properties
    const { label, type, placeholder, value, error, icon, message } = props;
    const { onChange, onButtonClick, onKeyDown, onClick } = props;

    //    event handler: input 값 변경 이벤트 처리 함수
    // const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    //     const { value } = event.target;
    //     setValue(value);
    // };

    //    event handler : key 처리 이벤트
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        // if (!onkeydown) return;
        onKeyDown(event);
    };

    return (
        <div className='inputbox'>
            <div className='inputbox-label'>
                {label}
            </div>
            <div className={!error ? 'inputbox-container' : 'inputbox-container-error'}>
                <input ref={ref} type={type} className='input' placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDownHandler} onClick={onClick}/>
                {onButtonClick !== undefined && (
                    <div className='icon-button' onClick={onButtonClick}>
                        {icon !== undefined && (
                            <div className={`icon ${icon}`}></div>
                        )}
                    </div>
                )}
            </div>
            {message !== undefined && (
                <div className='inputbox-message'>
                    {message}
                </div>
            )}
        </div>
    )
});

export default InputBox;