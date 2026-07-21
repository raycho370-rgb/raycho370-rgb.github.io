# AORR 상태 머신 설계

## 1. Target과 완료 기준

### Target

- 산출물 경로: `/Users/srcho/30_교육/Loop Engineering`
- 정적 파일: `index.html`, `styles.css`, `script.js`, `favicon.svg`
- 프로필 근거: `Sungrae_Cho_Microsoft_Final_Resume_v3.pdf`
- 설정 근거: `MEMORY.md`의 `Project Settings`
- 분석 근거: `STEP1_ANALYSIS.md`
- GitHub Pages: `https://raycho370-rgb.github.io`
- GitHub 저장소: `https://github.com/raycho370-rgb/raycho370-rgb.github.io`
- 최종 기능: 정적 프로페셔널 웹사이트, 데스크톱·태블릿·모바일 반응형, 상단 `Games` 메뉴, 키보드·터치 지렁이 게임, 랜덤하게 움직이는 적, GitHub Pages 배포

### 완료 기준

- HTML의 의미 구조와 내부 메뉴 링크가 정상 동작한다.
- 프로필 문구가 PDF와 대조되며, 공개 여부가 불명확한 내용은 `[사람 확인 필요]`로 표시되거나 제외된다.
- CSS가 데스크톱·태블릿·모바일에서 가로 스크롤 없이 표시된다.
- 게임이 시작·이동·먹이 획득·점수·자기 충돌·벽 충돌·재시작을 지원한다.
- 키보드/WASD와 터치 컨트롤이 모두 동작한다.
- 랜덤 적이 유효한 게임 영역에서 이동하고 충돌 결과가 명확하다.
- 키보드 포커스, 버튼 이름, 대비, `prefers-reduced-motion`, 모바일 조작을 점검한다.
- Claude Code CLI Sonnet의 전체 검증이 통과해야 `PASSED`로 전이한다.
- 배포는 별도 승인 후에만 수행하며, 실제 Pages URL의 정적 자산·메뉴·게임 로드까지 확인해야 `DEPLOYED`가 된다.

## 상태 머신

```text
READY
  └─ Codex 최소 수정 승인 → ACTING
ACTING
  ├─ 수정 범위·문법 확인 완료 → VERIFYING
  └─ 요구사항/콘텐츠가 불명확 → HITL_REQUIRED
VERIFYING
  ├─ Claude 전체 검증 통과 → PASSED
  ├─ 실패 원인 1개가 명확 → RETRYING
  ├─ Claude CLI 사용 불가 → CODEX_FALLBACK 기록 후 Codex 검증
  └─ 재현 불가/원인 불명/환경 차단 → BLOCKED 또는 HITL_REQUIRED
RETRYING
  ├─ 원인 하나와 관련 파일만 Codex 수정 → ACTING
  ├─ 사용자 결정 필요 → HITL_REQUIRED
  └─ 동일 원인 반복 또는 안전한 진행 불가 → BLOCKED
PASSED
  └─ 배포 승인 요청 → DEPLOY_APPROVAL_REQUIRED
DEPLOY_APPROVAL_REQUIRED
  ├─ 사람의 배포 승인 → DEPLOYED (배포 후 검증 통과 시)
  └─ 승인 보류/거부 → PASSED
DEPLOYED
  └─ 최종 상태. 변경 요청이 생기면 READY로 새 루프 시작
BLOCKED
  └─ 외부 상태 변경 또는 사람의 결정 후 READY로 재개
HITL_REQUIRED
  └─ 사람 응답 후 READY 또는 ACTING으로 재개
```

## 2. Act: Codex가 수행할 최소 수정

- 현재 상태와 실패 분류에 해당하는 파일만 먼저 읽고 수정한다.
- 한 Retry에서는 원인 하나만 선택하고, 그 원인과 직접 관련된 파일만 수정한다.
- 프로필 내용 변경 시 `Sungrae_Cho_Microsoft_Final_Resume_v3.pdf`와 대조한다.
- 연락처·소셜 링크·사진·시민권/영주권·구체적 성과 수치의 공개가 불명확하면 `[사람 확인 필요]`로 남기고 임의 공개하지 않는다.
- 정적 HTML/CSS/JavaScript 범위를 유지하고, 불필요한 프레임워크·빌드 도구·외부 의존성을 추가하지 않는다.
- 게임 수정 시 게임 규칙, 입력, 충돌, 랜덤 적 중 실패 원인에 직접 연결된 영역만 수정한다.
- 수정 전후에 변경 파일 목록과 수정 이유를 기록한다.
- `github_token.txt`는 인증이 필요한 GitHub 작업에서만 사용하며, 값을 읽어 출력·로그·코드·문서·Git에 남기지 않는다.
- Codex는 배포 승인 전 `git push` 또는 Pages 배포를 수행하지 않는다.

## 3. Observe: Claude가 실행할 테스트와 수집할 결과

Claude Code CLI Sonnet은 다음 순서로 전체 검증을 실행하고 결과를 기록한다.

1. **구조 확인**: `index.html`, `styles.css`, `script.js`, `favicon.svg` 존재 여부와 외부 의존성 추가 여부
2. **문법 확인**: `node --check script.js`; HTML/CSS의 파싱·링크 오류를 사용 가능한 정적 검사로 확인
3. **정적 서버 확인**: 작업 폴더에서 임시 HTTP 서버로 페이지를 열고 HTML·CSS·JS·favicon의 HTTP 응답 및 404 여부를 수집
4. **데스크톱 상호작용**: 상단 메뉴 앵커, `Games` 이동, Start/Restart, 키보드 방향키/WASD, 게임 상태·점수·충돌 결과 확인
5. **모바일·태블릿 반응형**: 최소 390px 모바일, 태블릿 폭, 데스크톱 폭에서 가로 스크롤·겹침·잘림·터치 컨트롤·캔버스 크기 확인
6. **접근성 확인**: 주요 랜드마크, heading 순서, 포커스 표시, 버튼 accessible name, 캔버스 설명, 색 대비와 `prefers-reduced-motion` 확인
7. **콘솔·네트워크 확인**: 브라우저 console error, 누락 자산, 예기치 않은 외부 요청을 수집
8. **결과 기록**: 각 테스트의 `PASS`/`FAIL`, 실행 환경, 재현 단계, 예상/실제 결과, 실패 분류, 관련 파일, 스크린샷 또는 로그 경로를 기록

Claude Code CLI를 사용할 수 없으면 전체 검증을 Codex가 수행하되, 결과에 반드시 `CODEX_FALLBACK`과 사유를 기록한다. Claude 일부 테스트만 통과한 경우 전체 검증 통과로 간주하지 않는다.

## 4. Reason: 실패 원인 분류

| 분류 | 판정 예시 | 기본 관련 파일/영역 |
|---|---|---|
| HTML | 요소 누락, 잘못된 heading/anchor, 접근성 이름 누락 | `index.html` |
| CSS | 반응형 겹침, 가로 스크롤, 대비·포커스·간격 문제 | `styles.css` |
| JAVASCRIPT | 문법 오류, 이벤트 연결, 상태 업데이트 오류 | `script.js` |
| GAME | 이동·충돌·점수·재시작·랜덤 적 규칙 오류 | `script.js`, 게임 관련 HTML/CSS |
| CONTENT | PDF 불일치, 오탈자, 공개 불명확 정보의 임의 노출 | `index.html`, `MEMORY.md`, 콘텐츠 입력 |
| TEST | 테스트 명령·선택자·기대값 오류, 검증 누락 | 테스트 절차/결과 기록 |
| ENVIRONMENT | 브라우저·Node·로컬 서버·권한·의존성 문제 | 실행 환경 |
| GITHUB | 저장소 URL·인증·브랜치·remote 문제 | Git 설정/인증 |
| DEPLOYMENT | Pages 설정, 경로, 자산 로드, 캐시·404 문제 | GitHub Pages/배포 상태 |
| UNKNOWN | 위 분류로 재현·판정할 수 없음 | 조사 기록 및 관련 파일 |

분류가 둘 이상 가능하면 재현에 필요한 최소 범위의 1개 주원인을 먼저 선택한다. 원인 확정 전 여러 파일을 동시에 고치지 않는다.

## 5. Repeat: Codex 최소 수정 → Claude 동일 테스트 재실행

1. Claude가 실패를 한 가지 주원인과 한 가지 분류로 기록한다.
2. Codex가 해당 원인과 직접 관련된 최소 파일만 수정한다.
3. Codex가 변경 diff, 파일 범위, 수정 이유를 기록한다.
4. Claude가 최초에 실패한 **동일 테스트**를 동일한 조건으로 다시 실행한다.
5. 동일 테스트가 통과해도 Claude는 전체 검증을 다시 실행한다.
6. 전체 검증 통과 시에만 `PASSED`로 전이한다.
7. 재실행에서 다른 실패가 발견되면 기존 Retry와 섞지 않고 새 주원인으로 별도 Retry를 시작한다.
8. 같은 원인이 반복되거나 재현되지 않으면 `BLOCKED` 또는 `HITL_REQUIRED`로 전이한다.

## 6. Stop과 HITL 조건

### Stop

- Claude의 전체 검증이 통과하면 `PASSED`에서 정지하고 배포 승인만 요청한다.
- 사람이 배포를 승인하지 않은 상태에서는 `DEPLOY_APPROVAL_REQUIRED`에서 정지한다.
- 승인 후 배포와 실제 Pages 검증까지 통과한 경우 `DEPLOYED`에서 정지한다.
- 코드 수정, 테스트, push, 배포를 요청받지 않은 단계에서는 해당 작업을 수행하지 않고 현재 상태에서 정지한다.

### HITL_REQUIRED

- 이메일·LinkedIn·Google Scholar·사진·시민권/영주권 등 공개 여부가 불명확한 콘텐츠를 결정해야 할 때
- 경력 기간·성과 수치·프로젝트명이 PDF와 다르거나 추가 확인이 필요할 때
- Facebook 참고가 고유 브랜드·상표·이미지·코드 복제로 이어질 위험이 있을 때
- 게임의 적 수·속도·난이도·충돌 규칙이 요구사항만으로 확정되지 않을 때
- GitHub 인증, 저장소 설정, 브랜치, Pages 설정 또는 배포 승인 등 외부 상태 변경이 필요할 때
- 실패 원인이 UNKNOWN이거나 여러 해석 중 하나를 선택해야 할 때
- Claude와 Codex의 검증 결과가 충돌하거나 테스트 환경 차이로 판정할 수 없을 때

## 7. 개발 루프 표

| 루프 | 입력 | Codex Act | Claude Verify | 통과 기준 | 다음 상태 |
|---|---|---|---|---|---|
| 0. 범위 계약 | `MEMORY.md`, `STEP1_ANALYSIS.md`, PDF, 요구사항 | 공개 필드·메뉴·게임 규칙·배포 범위를 문서화하고 불명확한 항목에 `[사람 확인 필요]` 표시 | 문서 간 URL·기능·보안 규칙 일치 확인 | 공개 범위와 최소 기능이 확정됨 | READY 또는 HITL_REQUIRED |
| 1. 정적 골격 | 승인된 정보 구조 | `index.html`의 시맨틱 구조, 내부 앵커, 상단 `Games` 링크만 최소 수정 | HTML 구조·heading·anchor·자산 응답 확인 | 메뉴와 주요 섹션 링크가 정상 동작 | VERIFYING → PASSED 또는 RETRYING |
| 2. 콘텐츠 통합 | PDF와 승인된 공개 필드 | `index.html`의 소개·경력·기술·학력 문구만 수정 | PDF 대조, 오탈자·미승인 개인정보·링크 확인 | 사실 문구 일치 및 공개 기준 충족 | VERIFYING → PASSED 또는 HITL_REQUIRED |
| 3. 반응형 스타일 | 골격과 화면 요구사항 | `styles.css`의 레이아웃·브레이크포인트·포커스·대비만 수정 | 데스크톱·태블릿·모바일 화면과 가로 스크롤 확인 | 3개 화면군에서 겹침·잘림·가로 스크롤 없음 | VERIFYING → PASSED 또는 RETRYING |
| 4. 게임 핵심 | 게임 섹션과 최소 규칙 | `script.js`에서 이동·먹이·점수·충돌·재시작만 최소 수정 | 키보드/WASD, 시작·게임오버·재시작, 점수 확인 | 핵심 게임 상태가 일관되게 동작 | VERIFYING → PASSED 또는 RETRYING |
| 5. 터치 입력 | 모바일 요구사항 | `index.html`, `styles.css`, `script.js` 중 터치 입력과 직접 관련된 파일만 수정 | 터치 방향 버튼, viewport, 스크롤 간섭 확인 | 모바일만으로 시작부터 재시작까지 가능 | VERIFYING → PASSED 또는 RETRYING |
| 6. 랜덤 적 | 승인된 적 규칙 | `script.js`의 적 위치·이동·충돌 로직만 최소 수정 | 적의 유효 영역 이동, 충돌, 재시작, 비정상 정지 확인 | 랜덤 적이 움직이고 결과가 명확하며 게임이 회복 가능 | VERIFYING → PASSED 또는 RETRYING |
| 7. 통합·접근성 | 전체 정적 파일 | 필요한 파일만 수정해 포커스·accessible name·콘솔·누락 자산을 보완 | Claude 전체 검증과 동일 조건의 재실행 | 전체 검증 `PASS`, 오류 0건 또는 승인된 예외 | PASSED 또는 RETRYING |
| 8. 배포 준비 | `PASSED` 결과, GitHub 설정 | 배포 전 변경사항·비밀정보·경로를 확인하고 배포 명령은 승인 대기 | Claude가 배포 전 체크리스트와 예상 Pages 경로 확인 | 배포 승인에 필요한 정보가 완비됨 | DEPLOY_APPROVAL_REQUIRED |
| 9. 배포 | 사람의 명시적 승인, 저장소 인증 | 승인 후에만 commit/push/Pages 배포를 수행 | 실제 Pages URL에서 자산·메뉴·게임·반응형·콘솔 확인 | 실제 URL이 최종 완료 기준을 충족 | DEPLOYED 또는 RETRYING/BLOCKED |

## Self-Correcting TDD Loop

### Verifier 상태

- 기본 역할: Codex = Worker, Claude Code CLI Sonnet = Verifier
- 확인 일시: 2026-07-21
- Claude CLI: 설치됨, 버전 `2.1.216`
- 로그인 상태: `loggedIn: true`, `authMethod: claude.ai`, `apiProvider: firstParty` (동일 권한 환경에서 확인)
- 실제 사용 Claude 모델: 아직 없음; 모델 확인 호출은 아직 실행하지 않음
- Sonnet 5: 로그인은 가능하지만 모델 사용 가능 여부는 아직 미확인
- 최신 사용 가능 Sonnet: 확인 불가
- 현재 모드: Claude Verifier 전환 대기
- Claude가 로그인되어 실제 실행 가능해지면 모델명을 실행 결과에서 확인한 뒤 이 문서와 `MEMORY.md`를 갱신하고 Claude Verifier 모드로 전환한다. 임의로 모델명을 추정하지 않는다.

### TDD 실행 순서

1. Verifier가 변경 전 기준선 테스트를 실행한다.
2. Verifier가 `PASS`/`FAIL`, 실패 항목, 핵심 오류, 관련 파일·라인, 실행 명령, exit code, fingerprint를 보고한다.
3. Worker는 실패 원인 하나를 선택하고 해당 원인에 필요한 최소 코드만 수정한다.
4. Verifier는 변경 전과 동일한 테스트를 동일 조건으로 재실행한다.
5. 실패하면 새 결과와 fingerprint를 보고한다.
6. Worker는 같은 주원인에 대해서만 최소 수정 후 Verifier에 재검증을 요청한다.
7. Verifier의 전체 테스트가 통과한 경우에만 `PASSED`로 전이한다.

Codex는 Claude가 실행한 테스트를 중복 실행하지 않는다. Claude CLI를 사용할 수 없는 현재 상태에서는 예외적으로 Codex가 수정과 검증을 모두 수행할 수 있으며, 모든 결과에 `CODEX_FALLBACK`과 fallback 이유를 기록한다.

### Verifier 테스트 계약

Verifier는 아래 테스트 묶음을 기준선과 모든 Retry에서 동일하게 실행한다. 테스트를 삭제하거나 기대값을 완화하지 않는다.

| ID | 검증 범위 | 필수 관찰 결과 |
|---|---|---|
| T01 | 파일 존재·상대 경로 | `index.html`, `styles.css`, `script.js`, `favicon.svg`가 존재하고 상대 경로 자산이 로드됨 |
| T02 | HTML 구조·내부 링크 | landmark, heading, `About`, `Experience`, `Skills`, `Education`, `Games` 앵커가 정상이며 중복·깨진 링크 없음 |
| T03 | CSS 반응형 | 375px, 768px, 1440px에서 겹침·잘림·가로 스크롤 없음; 터치 컨트롤은 모바일에서 표시됨 |
| T04 | JavaScript 오류 | 브라우저 console error 없음; `script.js` 로드와 이벤트 연결 정상 |
| T05 | 게임 핵심 | 시작, 이동, 먹이, 점수, 자기 충돌, 벽 충돌, 게임오버, 재시작 정상 |
| T06 | 게임 입력·적 | 방향키/WASD와 터치 방향 버튼 정상; 랜덤 적이 유효 영역에서 움직이고 충돌 결과가 명확함 |
| T07 | 로컬 HTTP | 임시 HTTP 서버에서 HTML·CSS·JS·favicon 응답 성공, 예기치 않은 404 없음 |
| T08 | GitHub Pages 호환성 | 루트 상대 경로, 정적 파일만 사용, 빌드 전용 절대 경로·서버 런타임 의존성 없음 |

Verifier는 각 테스트에 대해 다음 형식의 결과를 수집한다.

```text
run: <baseline|retry-N|full>
executor: <Claude Code CLI|CODEX_FALLBACK>
model: <실제 모델명|UNAVAILABLE>
command: <실행 명령>
exit_code: <정수>
test: <T01..T08>
status: <PASS|FAIL>
error: <핵심 오류 또는 none>
files: <관련 파일과 라인 또는 none>
fingerprint: <분류>:<안정화된 오류 요약>
final_state: <상태>
```

### Fingerprint와 Retry 정책

- fingerprint는 동적 경로·타임스탬프·랜덤 값·토큰을 제거한 안정화 오류 요약으로 만든다.
- 예: `JAVASCRIPT:ReferenceError canvas_context undefined`, `CSS:horizontal-overflow viewport-375`, `GAME:enemy-never-moves`.
- 오류당 최대 Retry는 3회다.
- 동일 fingerprint가 2회 연속이면 즉시 중지하고 `BLOCKED` 또는 `HITL_REQUIRED`로 전이한다. 세 번째 수정을 시도하지 않는다.
- 한 Retry에서는 원인 하나와 최소 관련 파일만 수정한다.
- 테스트 삭제, assertion 제거, 기대값 완화, 오류 숨김, timeout만 늘리는 수정은 금지한다.
- Retry 후에는 최초 실패 테스트를 같은 명령·환경·viewport로 다시 실행하고, 이후 전체 테스트를 실행한다.
- 새 fingerprint는 이전 오류와 섞지 않고 새 오류 항목으로 기록한다.

### 상태 전이

```text
READY
  └─ baseline test 요청 → VERIFYING
VERIFYING
  ├─ 전체 PASS → PASSED
  ├─ FAIL + 원인 하나 확정 + 동일 fingerprint 1회 → RETRYING
  ├─ Claude CLI 로그인/실행 불가 → CODEX_FALLBACK 기록 후 ACTING
  └─ 원인 불명·환경 차단·콘텐츠 승인 필요 → BLOCKED 또는 HITL_REQUIRED
RETRYING
  └─ Codex 최소 수정 → VERIFYING
ACTING
  └─ Codex가 fallback 검증까지 수행 → VERIFYING 또는 PASSED
PASSED
  └─ 배포 승인 전까지 정지 → DEPLOY_APPROVAL_REQUIRED
```

이 Step 3에서는 위 실행 계획만 기록하며 코드 수정, 테스트 실행, push, 배포를 수행하지 않는다.
