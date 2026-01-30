# Google OAuth 준비 체크리스트 (에이전트 B)

로그인(Google) 사용 시 아래 순서대로 진행하세요.

---

## 2B.1 Google Cloud Console 접속

- [ ] [Google Cloud Console - 사용자 인증 정보](https://console.cloud.google.com/apis/credentials) 접속
- [ ] 원하는 프로젝트 선택 또는 새 프로젝트 생성

---

## 2B.2 OAuth 2.0 Client ID 발급

- [ ] **사용자 인증 정보** → **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
- [ ] 애플리케이션 유형: **웹 애플리케이션**
- [ ] 이름 입력 후 **만들기** → **클라이언트 ID** 복사

---

## 2B.3 승인된 JavaScript 원본 등록

- [ ] 방금 만든 OAuth 클라이언트 **편집**
- [ ] **승인된 JavaScript 원본**에 아래 추가:
  - `http://localhost:3000` (로컬 개발)
  - `https://your-project.pages.dev` (배포 후 실제 Pages URL로 교체)
- [ ] **저장**

---

## 로컬 환경 변수 (선택)

- [ ] 프로젝트 루트에 `.env.local` 생성
- [ ] 다음 한 줄 추가 (값은 Console에서 복사한 클라이언트 ID로 교체):

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

- [ ] `.env.example` 참고

---

## Cloudflare Pages 환경 변수 (4단계 4.3)

배포 시 Dashboard → **Settings** → **Environment variables**에 동일 키로 추가:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = (위와 동일한 값)
