# 4단계: Cloudflare Pages 배포 체크리스트

순서대로 진행하세요.

---

## 4.1 프로젝트 생성

- [ ] [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Pages**
- [ ] **Create a project** → **Connect to Git** (또는 **Direct Upload**)

---

## 4.2 Build configuration

| 항목 | 값 |
|------|-----|
| Framework preset | **Next.js (Static HTML Export)** |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | (비워두거나 프로젝트 루트) |

- [ ] 위 값으로 설정 후 **Save**

---

## 4.3 환경 변수

- [ ] **Settings** → **Environment variables**
- [ ] **NODE_VERSION** = `20` (이 프로젝트는 Node 20.9+ 필요. `.nvmrc`에 20 있으면 일부 환경에서 자동 적용)
- [ ] (선택) **NEXT_PUBLIC_GOOGLE_CLIENT_ID** = (Google OAuth 클라이언트 ID) — `DOCUMENT/GOOGLE-OAUTH-CHECKLIST.md` 참고

---

## 4.4 배포 실행

- [ ] **Save and Deploy** 실행
- [ ] 배포 완료 후 **배포 URL** 확인 (예: `https://your-project.pages.dev`)

---

## 4.5 Google Console 원본 추가

- [ ] 배포된 URL을 [Google Cloud Console → OAuth 클라이언트](https://console.cloud.google.com/apis/credentials) **승인된 JavaScript 원본**에 추가
- [ ] 2B.3 미처리 시 여기서 반드시 추가
