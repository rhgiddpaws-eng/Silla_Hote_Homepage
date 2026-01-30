# 로컬에서 빌드 후 실행하기

코드 수정 없이 **빌드 → 실행**만 하려면 아래 순서대로 하세요.

---

## 1. Node 20 사용

Next.js 16은 **Node 20.9.0 이상**이 필요합니다.

- **Windows에서 터미널 열 때**: CMD나 PowerShell을 쓰면 보통 이미 Node 20이 잡혀 있습니다 (nvm4w 사용 시).
- **WSL/Git Bash**를 쓰는 경우: 터미널에서 `node -v`가 18이면, **Windows CMD**에서 아래 2번을 실행하거나, [nodejs.org](https://nodejs.org)에서 LTS(20.x)를 설치한 뒤 새 터미널에서 실행하세요.

---

## 2. 빌드

프로젝트 폴더에서:

```bash
npm install
npm run build
```

`out/` 폴더가 생기면 성공입니다.

---

## 3. 실행

```bash
npm run start
```

그다음 브라우저에서 **http://localhost:3000** 을 엽니다.

---

## 한 번에 하고 싶을 때

```bash
npm install && npm run build && npm run start
```

실행 후 브라우저에서 **http://localhost:3000** 으로 접속하면 됩니다.

---

## 지금 상태

- 빌드는 완료된 상태입니다 (`out/` 생성됨).
- 서버를 백그라운드로 띄워 두었으므로 **http://localhost:3000** 에 접속해 보시면 됩니다.
- 서버를 끄려면 터미널에서 `Ctrl+C`를 누르거나, 해당 터미널/프로세스를 종료하면 됩니다.
