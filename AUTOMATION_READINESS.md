# 자동화 준비도와 현업 적용 계획

기준 시점: 2026-07-21. 현재 커밋 `259be93`은 `main`에 push되었고 Pages는 `built`, 실제 URL은 HTTP 200이다. Claude CLI는 로그인되어 있으나 실제 Sonnet 모델 확인과 Claude Verifier 실행은 아직 완료되지 않았다.

| 루프 | 자동화 수준 | Codex 역할 | Claude Verifier | 위험도 | 권한 | Rollback | 준비 상태 | 보완점 |
|---|---|---|---|---|---|---|---|---|
| 0. 범위·콘텐츠 계약 | HITL | 공개 필드·요구사항·금지 항목 정리 | PDF 대조와 승인 목록 확인 | 중간 | 문서 읽기/수정 | 이전 문서 복원 | 부분 준비 | 공개 연락처·성과·사진 승인 필요 |
| 1. 정적 골격 | AUTO | HTML 최소 수정 | 구조·내부 링크·상대 경로 확인 | 낮음 | 워크 폴더 쓰기 | `git revert` | 준비 | HTML 정적 검사 고정 |
| 2. 콘텐츠 통합 | HITL | 승인 문구만 반영 | PDF 사실성·개인정보 확인 | 중간 | 콘텐츠 파일 쓰기 | 커밋 revert | 부분 준비 | 승인된 콘텐츠 기준표 필요 |
| 3. 반응형 스타일 | AUTO | CSS 최소 수정 | 375/768/1440px 레이아웃 확인 | 중간 | CSS 쓰기, 브라우저 읽기 | 이전 CSS 커밋 | 부분 준비 | viewport 스냅샷과 overflow assertion 필요 |
| 4. 게임 핵심 | HITL | 게임 원인 하나만 수정 | 시작·이동·점수·충돌·재시작 확인 | 중간 | JS 쓰기, 브라우저 입력 | 이전 JS 커밋 | 부분 준비 | 테스트용 seed와 상태 hook 필요 |
| 5. 터치 입력 | HITL | 터치 관련 파일만 수정 | 모바일 터치·스크롤 간섭 확인 | 중간 | HTML/CSS/JS 제한 쓰기 | 관련 커밋 revert | 미완료 | 실제 기기 또는 에뮬레이터 검증 필요 |
| 6. 랜덤 적 | HITL | 적 로직 최소 수정 | 이동 범위·충돌·재시작 확인 | 높음 | JS 제한 쓰기 | 게임 커밋 revert | 미완료 | seed·난이도 계약·재현 로그 필요 |
| 7. 통합 Verifier | HITL | 실패 원인 하나만 수정 | T01-T08 전체 실행·fingerprint 보고 | 중간 | 읽기/로컬 실행, 수정 금지 | 변경 전 커밋 | 차단됨 | 실제 Sonnet 모델 확인 및 외부 전송 승인 필요 |
| 8. 배포 준비 | HITL | diff·비밀정보·경로 점검 | Pages 호환성·배포 체크리스트 확인 | 높음 | 저장소 읽기, push 전 승인 | push 전 중지 | 부분 준비 | 배포 승인·보호 브랜치 정책 필요 |
| 9. Pages 배포 | MANUAL | 승인 후 push/배포 실행 | 실제 URL·자산·콘솔·HTTP 확인 | 높음 | GitHub 인증·push·Pages | 이전 커밋 revert 후 재배포 | 1회 완료 | 배포 모니터링과 rollback runbook 필요 |

## 핵심 판단

- 지금 자동화하기 가장 좋은 루프 1개: **루프 1 정적 골격의 AUTO 검증**. 파일 존재, 상대 경로, HTML anchor, 자산 응답은 결정적이고 외부 데이터가 필요 없다.
- 사람이 반드시 승인할 지점: 미승인 개인정보 공개, 콘텐츠·성과 수치 확정, 랜덤 적 난이도, Claude의 워크스페이스 외부 전송, GitHub 인증, push·Pages 배포.
- Claude Verifier 확인 항목: T01-T08 전체, 375/768/1440px, JavaScript console error, 게임 입력·충돌·랜덤 적, 로컬 HTTP, Pages 상대 경로 호환성, exit code와 fingerprint.
- Claude 사용 불가 시 Fallback: `CODEX_FALLBACK`으로 기록하고 Codex가 동일 테스트를 수행하되, Claude와 혼동하지 않으며 모델명을 `UNAVAILABLE`로 기록한다. Claude 테스트 결과를 Codex가 중복 실행하지 않는 원칙은 Claude 실행이 실제로 있었을 때 적용한다.
- 운영 전 필요한 테스트·권한·모니터링: 결정적 게임 seed/fixture, 브라우저 viewport 자동화, console·404 수집, GitHub 최소 권한 token 또는 CLI 인증, Pages build 상태·HTTP 200·자산 오류 모니터링, 최근 정상 커밋 rollback 절차.

## 현업 적용 다음 액션 3개

1. Claude CLI에서 실제 Sonnet 모델명을 확인하고, 외부 Verifier 실행에 대한 조직 승인 여부를 결정한다.
2. T01-T08을 실행하는 읽기 전용 Verifier 스크립트와 375/768/1440px 기준 결과 포맷을 고정한다.
3. GitHub branch protection, 최소 권한 인증, Pages build/HTTP 모니터링과 `git revert` rollback runbook을 설정한다.

## 보안·운영 원칙

토큰 값은 출력·로그·코드·문서·Git에 남기지 않는다. 테스트를 삭제·완화하지 않으며, 한 Retry에서는 원인 하나와 최소 관련 파일만 수정한다. 상세 실행 기록은 `AORR_LOG.md`에 보관하고, 확인되지 않은 개인 정보는 `[사람 확인 필요]`로 유지한다.
