#!/usr/bin/env sh
# 빌드 후 서버 시작 (Node 20.9+ 필요. Bash에서 node가 18이면 Windows Node 20 자동 탐색)

SCRIPT_DIR="${0%/*}"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR" || exit 1

# Node 20 사용: Bash의 node가 20이면 그대로, 아니면 Windows 경로에서 탐색 (Git Bash에서 nvm4w 등)
NODE_CMD=""
if node -v 2>/dev/null | grep -qE '^v20\.'; then
  NODE_CMD=node
fi
# Git Bash 등 Windows 셸에서만 Windows Node 20 경로 탐색 (WSL에서는 하지 않음)
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
if [ -z "$NODE_CMD" ]; then
  echo "Node 20.9 이상이 필요합니다. node -v 로 확인 후, nvm4w 등으로 Node 20을 설치하거나 PATH에 넣어 주세요."
  exit 1
fi

NEXT_BIN="$ROOT_DIR/node_modules/next/dist/bin/next"
if [ ! -f "$NEXT_BIN" ]; then
  echo "next가 없습니다. 프로젝트 루트에서 'npm install' 을 실행해 주세요."
  exit 1
fi

# 기존 서버 종료 (Windows에서 end.sh가 netstat/taskkill로 멈출 수 있으므로 백그라운드로 실행 후 곧바로 진행)
(sh "$SCRIPT_DIR/end.sh" >/dev/null 2>&1 &)
sleep 2
rm -rf "$ROOT_DIR/out" 2>/dev/null || true
if [ -d "$ROOT_DIR/out" ]; then
  echo "경고: out 폴더를 지우지 못했습니다. (다른 프로그램이 사용 중일 수 있음)"
  echo "  → 서버 종료: sh StartEndScript/end.sh"
  echo "  → Cursor에서 out/ 안의 파일을 연 탭을 모두 닫은 뒤 다시 실행하세요."
  echo "  → 그래도 안 되면 탐색기에서 out 폴더를 수동 삭제 후 다시 실행하세요."
  echo ""
fi

echo "빌드 중... (Node: $NODE_CMD)"
# Windows Node(.exe)를 쓸 때는 경로를 Windows 형식으로 (WSL/Git Bash → D:\...)
NEXT_BIN_RUN="$NEXT_BIN"
case "$NODE_CMD" in
  *node.exe|/c/*|/mnt/c/*)
    NEXT_BIN_RUN="$(echo "$NEXT_BIN" | sed 's|^/mnt/\([a-z]\)/|\1:/|' | sed 's|^/\([a-z]\)/|\1:/|' | sed 's|/|\\|g')"
    ;;
esac
# 터미널에 연결된 상태로 빌드 (메시지 출력 + Ctrl+C 정상 동작)
if ! "$NODE_CMD" "$NEXT_BIN_RUN" build; then
  echo "빌드 실패."
  exit 1
fi
echo "빌드 완료. 서버를 띄웁니다."
exec sh "$SCRIPT_DIR/start.sh"
