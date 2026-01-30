# StartEndScript – 빌드 / 서버 시작 / 종료

**Bash에서 `.sh` 파일만 사용**합니다. **Windows(Git Bash)와 Mac** 둘 다 같은 방법으로 동작합니다.

- **빌드 후 서버 시작**: 기존 서버 종료 → `out` 삭제 → 빌드 → 서버 실행
- **서버만 시작**: 이미 떠 있는 서버가 있으면 종료한 뒤 새로 실행
- **서버 종료**: 포트 3000에서 동작 중인 프로세스 종료

---

## 사용 방법 (Bash에서 .sh 만)

프로젝트 루트에서 아래처럼 실행하세요. **반드시 앞에 `sh` 를 붙입니다.**

| 하고 싶은 것 | 명령 |
|-------------|------|
| **빌드 후 서버 시작** | `sh StartEndScript/start-with-build.sh` |
| **서버만 시작** | `sh StartEndScript/start.sh` |
| **서버 종료** | `sh StartEndScript/end.sh` |

### Windows (Git Bash)

```bash
sh StartEndScript/start-with-build.sh
```

### Mac (Terminal)

```bash
sh StartEndScript/start-with-build.sh
```

- **Node 20.9 이상** 필요. Windows Git Bash에서 `node -v`가 18이어도, nvm4w 등으로 설치한 Node 20을 스크립트가 자동으로 찾아서 사용합니다. Mac은 PATH에 Node 20이 있으면 됩니다.
- 서버는 **http://localhost:3000** 에서 실행됩니다.
- 로그: `StartEndScript/server.log`

**주의 (멈춤 방지)**  
- 빌드 중에는 **1~2분** 걸릴 수 있습니다. "Generating static pages" 등에서 출력이 잠깐 멈춘 것처럼 보여도 기다리세요.  
- **Ctrl+Z를 누르지 마세요.** 누르면 프로세스가 일시정지되어 터미널이 멈춘 것처럼 보입니다. 서버/빌드 종료는 반드시 `sh StartEndScript/end.sh` 로 하세요.

**터미널을 그냥 끄면 좀비 프로세스가 남을 수 있음**  
- 터미널을 강제 종료하면 포트 3000에서 서버(node/serve)가 계속 떠 있을 수 있습니다.  
- **새 터미널**을 연 뒤 프로젝트 루트에서 `sh StartEndScript/end.sh` 를 실행하면 해당 프로세스가 정리됩니다.

---

## `out` 삭제가 안 될 때 (EPERM / ENOTEMPTY)

1. `sh StartEndScript/end.sh` 로 서버 종료
2. Cursor에서 `out/` 안의 파일을 연 탭 모두 닫기
3. 다시 `sh StartEndScript/start-with-build.sh` 실행
4. 그래도 안 되면 탐색기에서 `out` 폴더를 수동 삭제 후 다시 실행
