#!/usr/bin/env sh
# 서버 시작 스크립트 (Windows / Mac / Linux 공통)
# 이미 떠 있는 서버가 있으면 종료한 뒤 새로 띄웁니다.

SCRIPT_DIR="${0%/*}"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR" || exit 1

PORT=3000

# Node: Bash에서 node가 20이면 그대로, 아니면 Windows Node 20 경로 사용 (start-with-build.sh와 동일)
NODE_CMD=""
if node -v 2>/dev/null | grep -qE '^v20\.'; then
  NODE_CMD=node
fi
if [ -z "$NODE_CMD" ]; then
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*)
      for cand in /c/nvm4w/nodejs/node.exe /d/nvm4w/nodejs/node.exe /e/nvm4w/nodejs/node.exe; do
        if [ -x "$cand" ] 2>/dev/null && "$cand" -v 2>/dev/null | grep -qE '^v20\.'; then
          NODE_CMD="$cand"
          break
        fi
      done
      ;;
  esac
fi
[ -z "$NODE_CMD" ] && NODE_CMD=node

# 포트에서 대기 중인 프로세스 PID 찾기
get_pids() {
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*)
      (netstat -ano 2>/dev/null || cmd.exe /c "netstat -ano" 2>/dev/null) | tr -d '\r' | awk -v port=":$PORT" '
        $0 ~ port && /LISTENING/ { gsub(/^[ \t]+|[ \t]+$/,""); n=split($0,a); print a[n] }
      ' | sort -u
      ;;
    *)
      if command -v lsof >/dev/null 2>&1; then
        lsof -ti ":$PORT" 2>/dev/null
      elif command -v ss >/dev/null 2>&1; then
        ss -tlnp 2>/dev/null | awk -v port=":$PORT" '$0 ~ port { gsub(/.*pid=/,""); sub(/,.*/,""); print }'
      else
        netstat -tlnp 2>/dev/null | awk -v port=":$PORT" '$0 ~ port { print $7 }' | cut -d'/' -f1
      fi
      ;;
  esac
}

# PID 종료
kill_pid() {
  _pid="$1"
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*)
      cmd.exe /c "taskkill /F /PID $_pid" 2>/dev/null
      ;;
    *)
      kill "$_pid" 2>/dev/null || kill -9 "$_pid" 2>/dev/null
      ;;
  esac
}

# 기존 서버가 있으면 종료
PIDS=$(get_pids)
if [ -n "$PIDS" ]; then
  echo "기존 서버를 종료한 뒤 새로 띄웁니다..."
  for pid in $PIDS; do
    [ -n "$pid" ] && [ "$pid" -eq "$pid" ] 2>/dev/null || continue
    kill_pid "$pid"
  done
  sleep 1
fi

# out 폴더 없으면 빌드 필요 안내
if [ ! -d "out" ]; then
  echo "out 폴더가 없습니다. 먼저 'npm run build' 를 실행해 주세요."
  exit 1
fi

# 백그라운드로 서버 실행 (npx/PATH 없이 node로 직접 실행해 Windows/Mac 둘 다 동작)
LOG_FILE="$SCRIPT_DIR/server.log"
SERVE_JS="$ROOT_DIR/node_modules/serve/build/main.js"
if [ ! -f "$SERVE_JS" ]; then
  echo "serve 패키지가 없습니다. 프로젝트 루트에서 'npm install' 을 실행해 주세요."
  exit 1
fi
# Windows Node(.exe) 쓸 때는 경로를 Windows 형식으로 (Mac은 그대로)
SERVE_JS_RUN="$SERVE_JS"
OUT_ARG="out"
case "$NODE_CMD" in
  *node.exe|/c/*|/mnt/c/*)
    SERVE_JS_RUN="$(echo "$SERVE_JS" | sed 's|^/mnt/\([a-z]\)/|\1:/|' | sed 's|^/\([a-z]\)/|\1:/|' | sed 's|/|\\|g')"
    OUT_ARG="$(echo "$ROOT_DIR/out" | sed 's|^/mnt/\([a-z]\)/|\1:/|' | sed 's|^/\([a-z]\)/|\1:/|' | sed 's|/|\\|g')"
    ;;
esac
nohup "$NODE_CMD" "$SERVE_JS_RUN" "$OUT_ARG" -l "$PORT" >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo ""
echo "서버가 시작되었습니다."
echo "  접속 주소: http://localhost:$PORT"
echo "  PID: $SERVER_PID"
echo "  종료: sh StartEndScript/end.sh  (Ctrl+Z 누르지 마세요)"
echo ""
