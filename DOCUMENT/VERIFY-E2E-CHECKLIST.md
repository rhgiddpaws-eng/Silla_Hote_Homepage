# 5단계: 배포 후 검증 체크리스트

동시 진행 가능: **에이전트 C(자동)** ↔ **에이전트 D(수동)**.

---

## 에이전트 C – 자동 검증

배포 URL을 `your-project.pages.dev`로 바꾼 뒤 실행하세요.

```bash
BASE_URL=https://your-project.pages.dev npm run verify:screenshots
```

- [ ] **5C.1** 위 명령 실행
- [ ] **5C.2** `check-results.json`에서 이미지/페이지 오류 여부 확인
- [ ] `screenshots/*.png` 확인

---

## 에이전트 D – 수동 E2E (Chrome)

브라우저에서 배포 URL로 접속해 확인하세요.

- [ ] **5D.1** 메인(`/`) 로드, 히어로 슬라이더·카드 이미지 표시
- [ ] **5D.2** 객실(`/rooms`, `/room-suite` 등) 이미지·레이아웃
- [ ] **5D.3** 다이닝·특가 등 서브 페이지 이미지
- [ ] **5D.4** 로그인(`/login`) 페이지, Google 버튼 노출
- [ ] **5D.5** Google 또는 이메일 로그인 후 리다이렉트, 헤더에 사용자명 표시
- [ ] **5D.6** 마이페이지(`/mypage`) 접근, 로그아웃 동작
- [ ] **5D.7** 푸터·헤더 링크 클릭 시 해당 페이지 이동
