import React from 'react'
import Header from '../Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../Footer'
import { AUTH_PATH } from '@/constant';

//  component: 레이아웃
function Container() {

  //  state: 현재 페이지 path name 상태
  const { pathname } = useLocation();

  console.log('pathname: ', pathname);

  return (
    <>
    
    <Header />
    <Outlet />
    {pathname !== AUTH_PATH() && <Footer />}
    </>
  )
}

export default Container