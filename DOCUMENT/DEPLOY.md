# Cloudflare Pages 배포 (Next.js 정적 내보내기)

이 프로젝트는 **Next.js 16** 정적 내보내기(`output: 'export'`)로 빌드하여 **Cloudflare Pages**에 배포합니다.

---

## GitHub 푸시 → Cloudflare Pages 배포 (요약)

1. **Git 저장소 준비**  
   - 프로젝트 루트에서 `git init` (이미 있으면 생략)  
   - `.gitignore`가 있어서 `node_modules/`, `.next/`, `out/`, `.env.local` 등은 커밋되지 않음  
   - `.env.local`은 **절대 푸시하지 말 것** (비밀 키 포함)

2. **GitHub에 푸시**  
   - 원격 저장소 예: `https://github.com/rhgiddpaws-eng/Silla_Hote_Homepage.git`  
   - `git remote add origin https://github.com/rhgiddpaws-eng/Silla_Hote_Homepage.git`  
   - `git add .` → `git commit -m "Initial commit"` → `git push -u origin main`  
   - **푸시 시 비밀번호 입력 요청**이 나오면, 비밀번호 자리에 **GitHub Personal Access Token**을 입력한다.  
   - **보안**: 토큰은 **저장소/프로젝트 파일에 절대 넣지 말 것** (`.env`에 넣지 말고, 푸시할 때만 입력하거나 Git 자격 증명 관리자 사용). 토큰이 채팅·화면에 노출된 적이 있으면 GitHub에서 **즉시 폐기(Revoke)** 후 새 토큰 발급.

3. **Cloudflare Pages 연결**  
   - [4단계: Cloudflare 배포](#4단계-cloudflare-pages-배포-순서-필수) 참고  
   - **Connect to Git** → 해당 GitHub 저장소 선택  
   - Build command: `npm run build`  
   - Build output directory: `out`  
   - (권장) Environment variables에 **NODE_VERSION** = `20` 추가  
   - Save and Deploy 후 배포 URL 확인

4. **이후**  
   - `main`(또는 설정한 브랜치)에 푸시할 때마다 자동 재배포됨

---

## 빠른 링크 (상세 체크리스트)

| 단계 | 문서 |
|------|------|
| 2단계 B – Google OAuth | [DOCUMENT/GOOGLE-OAUTH-CHECKLIST.md](GOOGLE-OAUTH-CHECKLIST.md) |
| 4단계 – Cloudflare 배포 | [DOCUMENT/CLOUDFLARE-PAGES-CHECKLIST.md](CLOUDFLARE-PAGES-CHECKLIST.md) |
| 5단계 – 배포 후 검증 | [DOCUMENT/VERIFY-E2E-CHECKLIST.md](VERIFY-E2E-CHECKLIST.md) |

---

## 할 일 체크리스트 (순서대로 진행)

아래 순서대로 한 항목씩 체크하면서 진행하세요. **동시 진행 가능** 표시된 블록은 에이전트를 나눠 병렬로 처리해도 됩니다.

---

### 1단계: 환경 준비 (순서 필수)

- [ ] **1.1** Node.js 20.9.0 이상 설치 확인 (`node -v`)
- [ ] **1.2** 프로젝트 루트에서 `npm install` 실행
- [ ] **1.3** (선택) Google 로그인 사용 시 `.env.local` 생성 후 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 설정 (`.env.example` 참고)

---

### 2단계: 동시 진행 가능 (우선순위 없음 · 에이전트 분리 병렬)

아래 두 블록은 서로 의존하지 않으므로 **동시에** 진행할 수 있습니다.

**에이전트 A – Playwright 준비**

- [ ] **2A.1** `npx playwright install chromium` 실행
- [ ] **2A.2** (선택) 로컬에서 `npm run dev` 띄운 뒤 `npm run verify:screenshots` 실행해 스크립트 동작 확인

**에이전트 B – Google OAuth 준비 (로그인 사용 시)**

- [ ] **2B.1** [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속
- [ ] **2B.2** OAuth 2.0 Client ID 발급 (웹 애플리케이션)
- [ ] **2B.3** **승인된 JavaScript 원본**에 `http://localhost:3000`, `https://your-project.pages.dev` (배포 후 도메인) 추가

---

### 3단계: 빌드 및 로컬 확인 (순서 필수)

- [ ] **3.1** `npm run build` 실행 후 `out/` 디렉터리 생성 확인
- [ ] **3.2** `npm run start` 실행 (또는 `npm run dev`) 후 브라우저에서 `http://localhost:3000` 접속
- [ ] **3.3** Playwright 검증: `BASE_URL=http://localhost:3000 npm run verify:screenshots` 실행 후 `screenshots/`, `check-results.json` 확인

---

### 4단계: Cloudflare Pages 배포 (순서 필수)

- [ ] **4.1** Cloudflare Dashboard → **Pages** → **Create a project** → **Connect to Git** (또는 Direct Upload)
- [ ] **4.2** **Build configuration** 설정
  - Framework preset: **Next.js (Static HTML Export)**
  - Build command: `npm run build`
  - Build output directory: `out`
  - Root directory: (프로젝트 루트)
- [ ] **4.3** (선택) **Environment variables**에 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 추가
- [ ] **4.4** **Save and Deploy** 실행 후 배포 URL 확인
- [ ] **4.5** 배포된 도메인을 Google Console **승인된 JavaScript 원본**에 추가 (2B.3 미처리 시)

---

### 5단계: 배포 후 검증 (동시 진행 가능)

아래는 순서 없이 동시에 진행해도 됩니다.

**에이전트 C – 자동 검증**

- [ ] **5C.1** `BASE_URL=https://your-project.pages.dev npm run verify:screenshots` 실행
- [ ] **5C.2** `check-results.json`에서 이미지/페이지 오류 여부 확인

**에이전트 D – 수동 E2E 체크 (Chrome)**

- [ ] **5D.1** 메인(/) 로드, 히어로 슬라이더·카드 이미지 표시
- [ ] **5D.2** 객실(/rooms, /room-suite 등) 이미지·레이아웃
- [ ] **5D.3** 다이닝·특가 등 서브 페이지 이미지
- [ ] **5D.4** 로그인(/login) 페이지, Google 버튼 노출
- [ ] **5D.5** Google 또는 이메일 로그인 후 리다이렉트, 헤더에 사용자명 표시
- [ ] **5D.6** 마이페이지(/mypage) 접근, 로그아웃 동작
- [ ] **5D.7** 푸터·헤더 링크 클릭 시 해당 페이지 이동

---

## 요약: 동시 진행 맵

| 단계 | 순서 필수 | 동시 진행 가능 그룹 |
|------|-----------|---------------------|
| 1단계 | 예 (1.1 → 1.2 → 1.3) | — |
| 2단계 | 아니오 | 에이전트 A ↔ 에이전트 B |
| 3단계 | 예 (3.1 → 3.2 → 3.3) | — |
| 4단계 | 예 (4.1 → … → 4.5) | — |
| 5단계 | 아니오 | 에이전트 C ↔ 에이전트 D |

---

## 참고: 로컬 빌드 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 (http://localhost:3000)
npm run dev

# 정적 빌드 (out/ 생성)
npm run build

# 빌드 결과물 로컬 서빙 (기본 포트 3000)
npm run start
```

---

## 배포 후 URL

- 메인: `https://your-project.pages.dev/`
- 객실: `https://your-project.pages.dev/rooms`, `/room-suite` 등
- 로그인: `https://your-project.pages.dev/login`

(기존 `.html` 확장자 없이 경로만 사용)

---

## 진행 요약 (자동 수행된 항목)

- **1.1** Node 확인: 로컬에서 `node -v` 실행 후 **20.9.0 이상**이면 OK (미만이면 [nodejs.org](https://nodejs.org)에서 LTS 설치 권장)
- **1.2** `npm install` 완료
- **2A.1** `npx playwright install chromium` 완료
- **2B** Google OAuth: [GOOGLE-OAUTH-CHECKLIST.md](GOOGLE-OAUTH-CHECKLIST.md)에서 수동 진행
- **3단계** 로컬에서 순서대로: `npm run build` → `out/` 확인 → `npm run start` (또는 `npm run dev`) → `BASE_URL=http://localhost:3000 npm run verify:screenshots`
- **4단계** [CLOUDFLARE-PAGES-CHECKLIST.md](CLOUDFLARE-PAGES-CHECKLIST.md) 참고
- **5단계** [VERIFY-E2E-CHECKLIST.md](VERIFY-E2E-CHECKLIST.md) 참고 (자동·수동 병렬 가능)

---

## 기타

- 레거시 Node 서버(HTML 직접 서빙): `npm run server:legacy`
- Google Client ID: `.env.example` 참고 후 `.env.local`에 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 설정
- 스크린샷 저장 위치: `screenshots/*.png`
- 검증 결과 파일: `check-results.json`
