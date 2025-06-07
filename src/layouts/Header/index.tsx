import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, LOGIN_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from '@/constant';
import { useCookies } from 'react-cookie';
import { useLoginUserStore, useBoardStore } from '@/stores';

//  component: 헤더 레이아웃
function Header() {

  // state: path 상태
  const { pathname } = useLocation();
  //  state: 로그인 유저 상태
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  //  state: cookie 상태
  const [cookies, setCookies] = useCookies();
  //  state: 로그인 상태
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const isAuthPage = pathname.startsWith(AUTH_PATH());
  const isMainPage = pathname.startsWith(MAIN_PATH());
  const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
  const isBoardDetailPage = pathname.startsWith(BOARD_DETAIL_PATH(''));
  const isBoardWritePage = pathname.startsWith(BOARD_WRITE_PATH());
  const isBoardUpdatePage = pathname.startsWith(BOARD_UPDATE_PATH(''));
  const isUserPage = pathname.startsWith(USER_PATH(''));

  console.log('isPath : ', pathname.startsWith(AUTH_PATH()))
  console.log('AUTH_PATH : ', AUTH_PATH())

  //  function: Navigator Function
  const navigate = useNavigate();

  // event handler: 로고 클릭 이벤트 처리 함수
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  }

  //  component: 검색 버튼 컴포넌트
  const SearchButton = () => {
    const searchButtonRef = useRef<HTMLDivElement>(null);   // state: 검색어 입력 요소 참조 상태
    const [state, setState] = useState<boolean>(false);   // state: 검색 버튼 상태
    const [word, setWord] = useState<string>('');   // state: 검색어 상태
    const { searchWord } = useParams();

    //  event handler: 검색어 입력 변경 이벤트 처리 함수
    const onSearchWordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setWord(value);
    };

    //  event handler: 검색어 입력 변경 이벤트 처리 함수
    const onSearchWordKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      if (!searchButtonRef) return;
      searchButtonRef.current.click();
    };

    //  event handler: 검색 아이콘 클릭 이벤트 처리 함수
    const onSearchButtonClickHandler = () => {
      if (!state) {
        setState(true);
        return;
      }

      navigate(SEARCH_PATH(word));
    };

    //  effect: 검색어 path variable 변경 될때마다 실행 될 함수
    useEffect(() => {
      if (searchWord) {
        setWord(searchWord);
        setState(true);
      }

    }, [searchWord]);

    if (!state) {
      //  검색 버튼 컴포넌트 렌더링 (클릭 false 상태)
      return (
        <div className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      );
    }

    return (
      <div className='header-search-input-box'>
        <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler} />
        <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      </div>
    );
  }

  //  component: 로그인 또는 마이페이지 버튼 컴포넌트
  const MyPageButton = () => {
    const { userEmail } = useParams();    //  state: userEmail path variable 상태

    //  event handler: 마이페이지 버튼 클릭 이벤트 처리 함수
    const onMyPageButtonClickHandler = () => {
      if (!loginUser) return;
      const { email } = loginUser;
      navigate(USER_PATH(email));
    }

    //  event handler: 로그아웃 버튼 클릭 이벤트 처리 함수
    const onSignOutButtonClickHandler = () => {
      resetLoginUser();
      setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
      navigate(MAIN_PATH());
    }

    //  event handler: 로그인 버튼 클릭 이벤트 처리 함수
    const onSignInButtonClickHandler = () => {
      navigate(AUTH_PATH());
    }

    if (isLogin && userEmail === loginUser?.email) {
      return <div className='black-button' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>
    }

    if (isLogin) {
      return <div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
    }

    return (
      <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
    )
  }

  //  component: 업로드 버튼 컴포넌트
  const UploadButton = () => {

    //  state: 게시물 상태
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();

    // event handler: 업로드 버튼 클릭 이벤트 처리 함수
    const onUploadButtonClickHandler = () => {

    }

    if (title && content) {
      return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>
    }

    return <div className='disable-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>
  }

  useEffect(() => {
    setIsLogin(loginUser !== null);

  }, [loginUser])

  //  render: 헤더 레이아웃 렌더링
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon logo-dark-icon'></div>
          </div>
          <div className='header-logo'>
            {'forward board'}
          </div>
        </div>
        <div className='header-right-box'>
          {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton />}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && <MyPageButton />}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  )
}

export default Header