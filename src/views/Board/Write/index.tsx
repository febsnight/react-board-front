import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useBoardStore, useLoginUserStore } from '@/stores';
import { key } from 'localforage';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from '@/constant';
import { useCookies } from 'react-cookie';

//  component: 게시물 작성 화면
function BoardWrite() {

  //  state: 제목 영역 ref 상태
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  //  state: 본문 영역 ref 상태
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  //  state: 이미지 입력 요소 참조 상태
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  //  state: 게시물 상태
  const { title, setTitle } = useBoardStore();
  const { content, setContent } = useBoardStore();
  const { boardImageFileList, setBoardImageFileList } = useBoardStore();
  const { resetBoard } = useBoardStore();
  //  state: 게시물 이미지 미리보기 URL 상태
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  //  state: 로그인 유저 상태
  const { loginUser } = useLoginUserStore();
  //  state: 쿠키 상태
  const [cookies, setCookies] = useCookies();

  //  function: 네비게이트
  const navigate = useNavigate();

  //  event handler: 제목 변경 이벤트 처리
  const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setTitle(value);

    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`
  }

  //  event handler: 내용 변경 이벤트 처리
  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value);

    if (!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`
  }

  //  event handler: 이미지 변경 이벤트 처리
  const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) return;
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    const newImageUrls = imageUrls.map(item => item);
    newImageUrls.push(imageUrl);
    setImageUrls(newImageUrls);

    const newBoardImageFileList = boardImageFileList.map(item => item);
    newBoardImageFileList.push(file);
    setBoardImageFileList(newBoardImageFileList);

    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';
  }

  //  event handler: 이미지 업로드 버튼 클릭 이벤트 처리
  const onImageUploadButtonClickHandler = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  }

  //  event handler: 이미지 닫기 버튼 클릭 이벤트 처리
  const onImageCloseButtonClickHandler = (deleteIndex: number) => {
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';

    const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
    setImageUrls(newImageUrls);

    const newBoardImageFileList = boardImageFileList.filter((file, index) => index !== deleteIndex);
    setBoardImageFileList(newBoardImageFileList);
  }

  //  effect: 마운트시 실행할 함수
  useEffect(() => {
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      navigate(MAIN_PATH());
      return;
    }
    resetBoard();
  }, []);

  return (
    <div id='board-write-wrapper'>
      <div className='board-write-container'>
        <div className='board-write-box'>
          <div className='board-write-title-box'>
            <textarea ref={titleRef} className='board-write-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler} ></textarea>
          </div>
          <div className='divider'></div>

          <div className='board-write-content-box'>
            <textarea ref={contentRef} className='board-write-content-textarea' placeholder='본문을 작성해주세요.' value={content} onChange={onContentChangeHandler} />
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'>
                
              </div>
            </div>
            <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none'}} onChange={onImageChangeHandler} />
          </div>
          
          <div className='board-write-images-box'>
            {imageUrls.map((imageUrl, index) => 
              <div className='board-write-image-box'>
              <img className='board-write-image' src={imageUrl} key={index}/>
              <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                <div className='icon close-icon'></div>
              </div>
            </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardWrite