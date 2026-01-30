#!/usr/bin/env sh
# 서버 종료 스크립트 (Windows / Mac / Linux 공통)

SCRIPT_DIR="${0%/*}"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR" || exit 1

PORT=3000

# 포트에서 대기 중인 프로세스 PID 찾기
get_pids() {
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*)
      # Windows: netstat -ano, 마지막 컬럼이 PID (cmd로 실행 시 출력 호환)
      (netstat -ano 2>/dev/null || cmd.exe /c "netstat -ano" 2>/dev/null) | tr -d '\r' | awk -v port=":$PORT" '
        $0 ~ port && /LISTENING/ { gsub(/^[ \t]+|[ \t]+$/,""); n=split($0,a); print a[n] }
      ' | sort -u
      ;;
    *)
      # Mac / Linux / WSL: lsof 우선, 없으면 netstat/ss
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

PIDS=$(get_pids)
if [ -z "$PIDS" ]; then
  echo "포트 $PORT 에서 실행 중인 서버가 없습니다."
  exit 0
fi

for pid in $PIDS; do
  [ -n "$pid" ] && [ "$pid" -eq "$pid" ] 2>/dev/null || continue
  echo "서버 종료 중 (PID: $pid)"
  kill_pid "$pid"
done
echo "서버가 종료되었습니다."
