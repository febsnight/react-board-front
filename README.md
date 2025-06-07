## BOARD Front-End

## Available Scripts

- react 설치 : `npx create-react-app .`
- react-router-dom을 설치 : `npm install react-router-dom`
- axios를 설치 : `npm install axios`
- react-icons을 설치 : `npm install react-icons`
- react-player를 설치 : `npm install react-player`
- sass를 설치 : `npm install sass`
- react-helmet-async를 설치 : `npm install react-helmet-async`
- swiper를 설치 : `npm install swiper`
- cookie 설치 : `npm install react-cookie`
- justand는 리덕스 같은 상태관리 설치 : `npm install zustand`
- 재설치 : `npm i`

## npm 명령어
- `npm start`
- `npm test`
- `npm run build`
- `npm run eject`
- `npm run build` fails to minify

## VS CODE 기본 플러그인 설치
- Material Icon Theme
- ES7+ React/Redux/React-Native snippets

## 사용스택
- node.js를 설치하고 사용합니다. 
- react를 사용하여 사이트를 완성합니다. 
- youTube Api를 이용하여 데이터를 가져옵니다.
- rapidapi를 이용하여 데이터를 가져옵니다.
- netlify를 통해 사이트를 배포합니다.
- firebase를 통해 사이트를 배포합니다.
- vercel를 통해 사이트를 배포합니다.
- git을 사용하여 파일을 관리합니다.

## git 명령어
- `git init`
- `git add README.md`
- `git commit -m "first commit"`
- `git branch -M main`
- `git remote add origin https://github.com/doisoft/react-webs-youtube.git`
- `git push -u origin main`

## 오류 문제
- react 19버전에서 react-helmet-async 호환성 문제 발생으로 react 18.3.1 버전 사용 : `npm install react@18.3.1 react-dom@18.3.1`

## vscode setting
- 정렬 셋팅
1. VS code의 Extension에서 Prettier 설치
2. Setting 설정
- `Ctrl + ,`를 동시에 눌러 vscode의 설정에 들어가준다.
- `Editor: Default Formatter`을 검색란에 입력 후 해당 설정을 `Prettier`로 설정해준다.
- `Editor: Format on save mode`를 검색 후 체크해준다. (파일을 저장할 때마다 자동으로 prettier 실행하도록)
3. `.prettierrc` 파일로 개별 옵션 설정하기
- `npm i --save-dev prettier`
- `.prettierrc` 파일 생성
```
{
  "arrowParens": "always", // 화살표 함수의 매개변수가 하나일 때 괄호를 사용할지 여부
  "bracketSpacing": true, // 객체 리터럴에서 중괄호 내부에 공백 삽입할지 여부 
  "endOfLine": "auto", // EoF 방식, OS별로 처리 방식이 다름 
  "htmlWhitespaceSensitivity": "css", // HTML 공백 감도 설정
  "jsxBracketSameLine": false, // JSX의 마지막 `>`를 다음 줄로 내릴지 여부 
  "jsxSingleQuote": false, // JSX에 singe 쿼테이션 사용 여부
  "printWidth": 80, //  한 줄에 출력되는 코드의 최대 길이
  "proseWrap": "preserve", // markdown 텍스트의 줄바꿈 방식 (v1.8.2)
  "quoteProps": "as-needed" // 객체 속성에 쿼테이션 적용 방식
  "semi": true, // 세미콜론 사용 여부
  "singleQuote": true, // single 쿼테이션 사용 여부
  "tabWidth": 2, // 탭 간격
  "trailingComma": "all", // 여러 줄을 사용할 때, 후행 콤마 사용 방식
  "useTabs": false, // 탭 사용 여부
  "vueIndentScriptAndStyle": true, // Vue 파일의 script와 style 태그의 들여쓰기 여부 (v1.19.0)
  "parser": '', // 사용할 parser를 지정, 자동으로 지정됨
  "filepath": '', // parser를 유추할 수 있는 파일을 지정
  "rangeStart": 0, // 포맷팅을 부분 적용할 파일의 시작 라인 지정
  "rangeEnd": Infinity, // 포맷팅 부분 적용할 파일의 끝 라인 지정,
  "requirePragma": false, // 파일 상단에 미리 정의된 주석을 작성하고 Pragma로 포맷팅 사용 여부 지정
  "insertPragma": false, // 미리 정의된 @format marker의 사용 여부 (v1.8.0)
  "overrides": [ 
    {
      "files": "*.json",
      "options": {
        "printWidth": 200
      }
    }
  ], // 특정 파일별로 옵션을 다르게 지정함, ESLint 방식 사용
}
```
- `.prettierignore` 파일 생성하기
```
package.json
package-lock.json
```