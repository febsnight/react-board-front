import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import InputBox from '@/components/InputBox';
import { SignInResponseDto, SignUpResponseDto } from '@/apis/response/auth';
import { SignInRequestDto, SignUpRequestDto } from '@/apis/request/auth';
import { signInRequest, signUpRequest } from '@/apis';
import { ResponseDto } from '@/apis/response';
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from '@/constant';
import { useNavigate } from 'react-router-dom';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';

//  component: 인증 화면 component
function Authentication() {

  //  state: 화면 상태
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  //  state: 쿠키 상태
  const [cookies, setCookie] = useCookies();

  //  function: 네비게이트 함수
  const navigator = useNavigate();

  //  component: (로그인)sign in card component
  const SignInCard = () => {

    //  state: 이메일 상태
    const [email, setEmail] = useState<string>('');
    //  state: 이메일 참조 상태
    const emailRef = useRef<HTMLInputElement | null>(null);
    //  state: 비밀번호 참조 상태
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //  state: 비밀번호 상태
    const [password, setPassword] = useState<string>('');
    //  state: 비밀번호 타입 상태
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    //  state: 에러 상태
    const [error, setError] = useState<boolean>(false);
    //  state: 에러 메세지
    const [errorMsg, setErrorMsg] = useState<string>('이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해 주세요.');
    //  state: 비밀번호 버튼 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

    //  function: sign in response 처리 함수
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
      if (!responseBody) {
        alert('네트워크 이상입니다.');
        return;
      }

      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'SF' || code === 'VF') {
        setError(true);
        setErrorMsg('이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해 주세요.');
      }
      if (code !== 'SU') return;

      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);  // 1시간 이후

      setCookie('accessToken', token, { expires, path: MAIN_PATH() });
      navigator(MAIN_PATH());
    }

    //  event handler: 이메일 변경 이벤트 처리
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setEmail(value);
    }

    //  event handler: 비밀번호 변경 이벤트 처리
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setPassword(value);
    }

    //  event handler: 로그인 버튼 이벤트 처리
    const onSignInButtonClickHandler = () => {
      if (email === '') {
        setErrorMsg('아이디 또는 이메일을 입력해 주세요.');
        setError(true);
        return;
      } else if (password === '') {
        setErrorMsg('비밀번호를 입력해 주세요.');
        setError(true);
        return;
      }

      const requestBody: SignInRequestDto = { email, password };
      signInRequest(requestBody).then(signInResponse)
    }

    //  event handler: 회원가입 클릭 이벤트
    const onSignOnButtonClickHandler = () => {
      setView('sign-up');
    }

    //  event handler: 비밀번호 버튼 클릭 이벤트 처리
    const onPasswordButtonClickHandler = () => {
      if (passwordType === 'text') {
        setPasswordType('password');
        setPasswordButtonIcon('eye-light-off-icon');
      } else {
        setPasswordType('text');
        setPasswordButtonIcon('eye-light-on-icon');
      }
    }

    //  event handler: 이메일 인풋 키 다운 이벤트 처리
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    }

    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onSignInButtonClickHandler();
    }

    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>{'로그인'}</div>
            </div>
            <InputBox ref={emailRef} label='email' type='text' placeholder='이메일 주소를 입력해주세요.' error={error} value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler} />
            <InputBox ref={passwordRef} label='password' type={passwordType} placeholder='비밀번호를 입력해주세요.' error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon}
              onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler} />
          </div>
          <div className='auth-card-bottom'>
            {error &&
              <div className='auth-sign-in-error-box'>
                <div className='auth-sign-in-error-message'>
                  {errorMsg}
                </div>
              </div>
            }

            <div className='black-lg-full-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
            <div className='auth-description-box'>
              <div className='auth-description'>
                {'신규 사용자이신가요??'}<span className='auth-description-link' onClick={onSignOnButtonClickHandler}>회원가입</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  //  component: (회원가입)sign up card component
  const SignUpCard = () => {

    //  state: 페이지 번호 상태
    const [page, setPage] = useState<1 | 2>(1);

    //  event handler: 로그인 링크 클릭 이벤트 처리
    const onSignInLinkClickHandler = () => {
      setView('sign-in');
    }

    //  description: page 1 ------------------------------------------

    //  state: 이메일 요소 참조 상태
    const emailRef = useRef<HTMLInputElement | null>(null);
    //  state: 비밀번호 요소 참조 상태
    const passwordRef = useRef<HTMLInputElement | null>(null);
    //  state: 비밀번호 확인 요소 참조 상태
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);

    //  state: 이메일 상태
    const [email, setEmail] = useState<string>('');
    //  state: 비밀번호 상태
    const [password, setPassword] = useState<string>('');
    //  state: 비밀번호 확인 상태
    const [passwordCheck, setPasswordCheck] = useState<string>('');

    //  state: 비밀번호 타입 상태
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    //  state: 비밀번호 확인 타입 상태
    const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

    //  state: 이메일 에러 상태
    const [isEmailError, setEmailError] = useState<boolean>(false);
    //  state: 비밀번호 에러 상태
    const [isPasswordError, setPasswordError] = useState<boolean>(false);
    //  state: 비밀번호 확인 에러 상태
    const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);

    //  state: 이메일 에러 메세지 상태
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
    //  state: 비밀번호 에러 메세지 상태
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    //  state: 비밀번호 확인 에러 메세지 상태
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');

    //  state: 비밀번호 버튼 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
    //  state: 비밀번호 확인 버튼 아이콘 상태
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');


    //  event handler: 이메일 변경 이벤트 처리
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setEmail(value);
      setEmailError(false);
      setEmailErrorMessage('');
    }
    //  event handler: 비밀번호 변경 이벤트 처리
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    //  event handler: 비밀번호 확인 변경 이벤트 처리
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPasswordCheck(value);
      setPasswordCheckError(false);
    }

    //  event handler: 비밀번호 버튼 클릭 이벤트 처리
    const onPasswordButtonClickHandler = () => {
      if (passwordButtonIcon === 'eye-light-off-icon') {
        setPasswordButtonIcon('eye-light-on-icon');
        setPasswordType('text');
      } else {
        setPasswordButtonIcon('eye-light-off-icon');
        setPasswordType('password');
      }
    }
    //  event handler: 비밀번호 확인 버튼 클릭 이벤트 처리
    const onPasswordCheckButtonClickHandler = () => {
      if (passwordCheckButtonIcon === 'eye-light-off-icon') {
        setPasswordCheckButtonIcon('eye-light-on-icon');
        setPasswordCheckType('text');
      } else {
        setPasswordCheckButtonIcon('eye-light-off-icon');
        setPasswordCheckType('password');
      }
    }
    //  event handler: 다음단계 버튼 클릭 이벤트 처리
    const onNextButtonClickHandler = () => {
      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z0-9]{2,4}$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage('이메일 주소 포멧이 맞지 않습니다.');
      }
      const isCheckedPassword = password.trim().length >= 8;
      if (!isCheckedPassword) {
        setPasswordError(true);
        setPasswordErrorMessage('비밀번호는 8자 이상 입력해 주세요.');
      }
      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      }
      if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) return;
      setPage(2);
    }

    //  event handler: 이메일 키다운 이벤트 처리
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;      
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    }
    //  event handler: 비밀번호 키다운 이벤트 처리
    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    }
    //  event handler: 비밀번호 확인 키다운 이벤트 처리
    const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onNextButtonClickHandler();
    }


    //  description: page 2 ------------------------------------------

    //  state: 닉네임 요소 참조 상태
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    //  state: 휴대 전화번호 요소 참조 상태
    const telNumberRef = useRef<HTMLInputElement | null>(null);
    //  state: 주소 요소 참조 상태
    const addressRef = useRef<HTMLInputElement | null>(null);
    //  state: 상세 주소 요소 참조 상태
    const addressDetailRef = useRef<HTMLInputElement | null>(null);  

    //  state: 닉네임 에러 상태
    const [isNicknameError, setNicknameError] = useState<boolean>(false);
    //  state: 핸드폰 번호 에러 상태
    const [isTelNumberError, setTelNumberError] = useState<boolean>(false);
    //  state: 주소 에러 상태
    const [isAddressError, setAddressError] = useState<boolean>(false);
    //  state: 개인정보 동의 에러 상태
    const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

    //  state: 닉네임 상태
    const [nickname, setNickname] = useState<string>();
    //  state: 핸드폰 상태
    const [telNumber, setTelNumber] = useState<string>();
    //  state: 주소 상태
    const [address, setAddress] = useState<string>();
    //  state: 상세 주소 상태
    const [addressDetail, setAddressDetail] = useState<string>();

    //  state: 닉네임 에러 메세지 상태
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
    //  state: 핸드폰 번호 에러 메세지 상태
    const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>('');
    //  state: 주소 에러 메세지 상태
    const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');

    //  state: 개인정보 동의 상태
    const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);

    //  function: 다음 주소 검색 팝업 오픈 함수
    const openAddressPopup = useDaumPostcodePopup();

    const signUpResponse = (responseBody: SignUpResponseDto | ResponseDto | null) => {
      if (!responseBody) {
        alert('네트워크 이상입니다.');
        return;
      }
      const { code } = responseBody;
      if (code === 'DE') {
        setEmailError(true);
        setEmailErrorMessage('중복되는 이메일 주소입니다.');
      }
      if (code === 'DN') {
        setNicknameError(true);
        setNicknameErrorMessage('중복되는 닉네임입니다.');
      }
      if (code === 'DT') {
        setTelNumberError(true);
        setTelNumberErrorMessage('중복되는 핸드폰 번호입니다.');
      }
      if (code === 'VF') alert('모든 값을 입력하세요.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');

      if (code === 'SU') return;
      setView('sign-in');
    }


    //  event handler: 닉네임 변경 이벤트 처리
    const onNicknameChangeHnadler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage('');
    }
    //  event handler: 핸드폰 번호 변경 이벤트 처리
    const onTelNumberChangeHnadler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setTelNumber(value);
      setTelNumberError(false);
      setTelNumberErrorMessage('');
    }
    //  event handler: 주소 변경 이벤트 처리
    const onAddressChangeHnadler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setAddress(value);
      setAddressError(false);
      setAddressErrorMessage('');
    }
    //  event handler: 상세주소 변경 이벤트 처리
    const onAddressDetailChangeHnadler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setAddressDetail(value);
    }

    //  event handler: 주소 버튼 클릭 이벤트 처리
    const onAddressButtonClickHandler = () => {
      openAddressPopup( {onComplete} );
    }
    //  event handler: 주소 인풋 클릭 이벤트 처리
    const onAddressClickHandler = () => {
      openAddressPopup( {onComplete} );
    }
    //  event handler: 회원가입 버튼 클릭 이벤트 처리
    const onSignUpButtonClickHandler = () => {
      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z0-9]{2,4}$/;
      const isEmailPattern = emailPattern.test(email);
      
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage('이메일 주소 포멧이 맞지 않습니다.');
      }
      const isCheckedPassword = password.trim().length >= 8;
      if (!isCheckedPassword) {
        setPasswordError(true);
        setPasswordErrorMessage('비밀번호는 8자 이상 입력해 주세요.');
      }
      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      }
      if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) {
        setPage(1);
        return;
      }

      const hasNickname = nickname.trim().length !== 0;
      if (!hasNickname) {
        setNicknameError(true);
        setNicknameErrorMessage('닉네임을 입력해주세요.');
      }
      
      const telNumberPattern = /^[0-9]{11,13}$/;
      const isTelNumberPattern = telNumberPattern.test(telNumber);
      if(!isTelNumberPattern) {
        setTelNumberError(true);
        setTelNumberErrorMessage('숫자만 입력해주세요.');
      }

      const hasAddress = address.trim().length > 0;
      if (!hasAddress) {
        setAddressError(true);
        setAddressErrorMessage('주소를 선택해주세요.');
      }
      if (!agreedPersonal) setAgreedPersonalError(true);
      if (!hasNickname || !isTelNumberPattern || !agreedPersonal) return;

      const requestBody:SignUpRequestDto = {
        email, password, nickname, telNumber, address, addressDetail, agreedPersonal
      };

      signUpRequest(requestBody).then(signUpResponse);
      alert('회원가입이 완료되었습니다.');  //임시
    }
    //  event handler: 개인정보 동의 체크박스 클릭 이벤트 처리
    const onAgreedPersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setAgreedPersonalError(false);
    }

    //  event handler: 닉네임  이벤트 처리
    const onNicknameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!telNumberRef.current) return;
      telNumberRef.current.focus();
    }
    //  event handler: 핸드폰 번호 이벤트 처리
    const onTelNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onAddressButtonClickHandler();
    }
    //  event handler: 주소 이벤트 처리
    const onAddressKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (addressDetailRef.current) return;
      addressDetailRef.current.focus();
    }
    //  event handler: 상세 주소 이벤트 처리
    const onAddressDetailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onSignUpButtonClickHandler();
    }

    //  event handler: 다음 주소 검색 완료 이벤트 처리
    const onComplete = (data:Address) => {
      const { address } = data;
      setAddress(address);
      if (!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    }

    //  effect: 페이지가 변경될 때 마다 실행될 함수
    useEffect(() => {
      if (page == 2) {
        if (!nicknameRef.current) return;
        nicknameRef.current.focus();
      }
    }, [page])

    //  render: sign up card 컴포넌트 렌더링
    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>{'회원가입'}</div>
              <div className='auth-card-page'>{`${page}/2`}</div>
            </div>
            {page === 1 && (
              <>
                <InputBox ref={emailRef} label='이메일 주소*' type='text' placeholder='이메일 주소를 입력해 주세요.' value={email} onChange={onEmailChangeHandler} error={isEmailError} message={emailErrorMessage} onKeyDown={onEmailKeyDownHandler} />
                <InputBox ref={passwordRef} label='비밀번호*' type={passwordType} placeholder='비밀번호를 입력해 주세요.' value={password} onChange={onPasswordChangeHandler} error={isPasswordError} message={passwordErrorMessage} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler} />
                <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType} placeholder='비밀번호를 다시 입력해 주세요.' value={passwordCheck} onChange={onPasswordCheckChangeHandler} error={isPasswordCheckError} message={passwordCheckErrorMessage} icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler} onKeyDown={onPasswordCheckKeyDownHandler} />
              </>
            )}
            {page === 2 && (
              <>
                <InputBox ref={nicknameRef} label='닉네임*' type='text' placeholder='닉네임을 입력해 주세요' value={nickname} onChange={onNicknameChangeHnadler} error={isNicknameError} message={nicknameErrorMessage} onKeyDown={onNicknameKeyDownHandler} />
                <InputBox ref={telNumberRef} label='핸드폰 번호*' type='text' placeholder='핸드폰 번호를 입력해 주세요' value={telNumber} onChange={onTelNumberChangeHnadler} error={isTelNumberError} message={telNumberErrorMessage} onKeyDown={onTelNumberKeyDownHandler} />
                <InputBox ref={addressRef} label='주소*' type='text' placeholder='우편번호 찾기' value={address} onChange={onAddressChangeHnadler} error={isAddressError} message={addressErrorMessage} icon='expand-right-lignt-icon' onButtonClick={onAddressButtonClickHandler} onKeyDown={onAddressKeyDownHandler} onClick={onAddressClickHandler}/>
                <InputBox ref={addressDetailRef} label='상세 주소' type='text' placeholder='상세 주소를 입력해 주세요' value={addressDetail} onChange={onAddressDetailChangeHnadler} error={false} onKeyDown={onAddressDetailKeyDownHandler}/>
              </>
            )}
          </div>

          <div className='auth-card-bottom'>
            {page === 1 && (
              <div className='black-lg-full-button' onClick={onNextButtonClickHandler}>{'다음 단계'}</div>
            )}

            {page === 2 && (
              <>
                <div className='auth-consent-box'>
                  <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                    <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>
                  </div>
                  <div className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'}>{'개인정보동의'}</div>
                  <div className='auth-consent-link'>{'더보기 >'}</div>
                </div>
                <div className='black-lg-full-button' onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
              </>
            )}

            <div className='auth-description-box'>
              <div className='auth-description'>
                {'이미 계정이 있으신가요?'}<span className='auth-description-link' onClick={onSignInLinkClickHandler}>로그인</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div id='auth-wrapper'>
      <div className='auth-container'>
        <div className='auth-jumbotron-box'>
          <div className='auth-jumbotron-contents'>
            <div className='auth-logo-icon'></div>
            <div className='auth-jumbotron-text-box'>
              <div className='auth-jumbotron-text'>
                {'환영합니다.'}
              </div>
              <div className='auth-jumbotron-text'>
                {'TEAM-UP BOARD 입니다.'}
              </div>
            </div>
          </div>
        </div>
        {/* {view === 'sign-in' && <SignInCard />} */}
        {/* {view === 'sign-up' && <SignUpCard />} */}
        {view === 'sign-in' ? <SignInCard /> : <SignUpCard />}
      </div>
    </div>
  )
}

export default Authentication