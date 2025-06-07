import axios from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { SignInResponseDto, SignUpResponseDto } from "./response/auth";
import { ResponseDto } from "./response";

const DOMAIN = "http://localhost:4000";

const API_DOMAIN = `${DOMAIN}/api/v1`;

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

//  로그인 API 요청
export const signInRequest = async (requestBody: SignInRequestDto) => {
  const result = await axios
    .post(SIGN_IN_URL(), requestBody)
    .then((response) => {
      const responseBody: SignInResponseDto = response.data;

      console.log("response : ", responseBody);
      return responseBody;
    })
    .catch((error) => {
      if (!error.response) return null;

      const responseBody: ResponseDto = error.response.data;
      console.log("response : ", responseBody);
      return responseBody;
    });

  return result;
};

//  회원가입 API 요청
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const result = await axios
    .post(SIGN_UP_URL(), requestBody)
    .then((response) => {
        console.log('response ==> ', response);
      const responseBody: SignUpResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
        console.log('error ==> ', error);
      if (!error.response.data) return;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};
