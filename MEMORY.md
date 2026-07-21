## Project Settings

- GitHub Pages 주소: https://raycho370-rgb.github.io
- GitHub 저장소: https://github.com/raycho370-rgb/raycho370-rgb.github.io
- GitHub 토큰 파일명: `github_token.txt` (값은 읽거나 저장하지 않음)
- 프로필 참고 자료: `Sungrae_Cho_Microsoft_Final_Resume_v3.pdf`
- 웹사이트 디자인 참고: Facebook
- 게임 추가 기능: 랜덤하게 움직이는 적

## Goal

정적 HTML/CSS/JavaScript 반응형 프로페셔널 웹사이트와 Games 지렁이 게임을 완성하고 승인 후 GitHub Pages에 배포한다.

## Scope / Out of Scope

- Scope: Home/About/Contact, 확인 가능한 Experience/Research, 반응형 내비게이션, Games, 키보드·WASD·터치 게임, 랜덤 적, Pages.
- Out of Scope: 백엔드, 임의 외부 서비스·프레임워크, 미승인 개인정보 공개, 테스트 완화.

## Execution

- Mode: `CODEX_WORKER + CODEX_FALLBACK` (Claude CLI 외부 검증 호출은 정책상 차단됨).
- Claude model: CLI `2.1.216` 로그인 확인; 실제 Sonnet 모델명 `UNAVAILABLE`, Sonnet 5 미확인.
- Last test: `PASS` (fallback 브라우저·375/768/1440px·게임·HTTP·문법); Claude Verifier 미실행.

## Current State

- 상태: `DEPLOY_APPROVAL_REQUIRED`.
- 완료 루프: Step 1-10, CR-001 공개 이메일, Scholar, phrase 배경, SC 로고 제거, 무지개 H1 로컬 검증.
- 다음 루프: 무지개 H1·SC 로고 제거 승인 후 commit·push·재배포.
- Retry: 0회; fingerprint: 없음.
- blocker: Claude Verifier 외부 실행 정책 차단; CODEX_FALLBACK 회귀 검증으로 대체.
- 현재 commit: `2869f5e`; Git 상태: SC 로고·무지개 H1 변경 미커밋.
- 마지막 정상 commit·URL: `2869f5e` / https://raycho370-rgb.github.io.
- Rollback 기준: 승인된 변경 commit만 `git revert`로 되돌리고 force push·hard reset은 사용하지 않음.

## Acceptance

HTML·내부 링크·상대 경로, 375/768/1440px 반응형, JS 무오류, 게임 시작·이동·음식·성장·점수·충돌·게임오버·pause·restart·high score·키보드·터치·랜덤 적, 로컬 HTTP, Pages 호환성, Claude 전체 검증을 충족한다.

## Guardrails

- 확인되지 않은 개인 정보를 생성하거나 기존 콘텐츠를 임의 삭제하지 않는다.
- 테스트 삭제·완화, 대규모 재작성, 백엔드·외부 서비스·프레임워크 임의 추가를 금지한다.
- 토큰을 출력·로그·코드·문서·Git에 저장하지 않는다.
- 한 Retry에서는 원인 하나와 최소 관련 파일만 수정한다.
- 상세 실행 기록은 `AORR_LOG.md`에 저장한다.

## Retry / HITL

- 오류당 최대 3회; 동일 fingerprint 2회면 `BLOCKED` 또는 `HITL_REQUIRED`로 중지한다.
- 공개 범위, 게임 규칙, Claude 모델·외부 전송, GitHub 인증, commit·push·배포는 사람 승인 대상이다.

## Recent Loops

| Loop | 상태 | 실행 모드·모델 | 변경 파일 | 테스트 결과 | Retry | 다음 작업 |
|---|---|---|---|---|---|---|
| Step 5 | 완료 | Codex + GitHub CLI | `.git`, `.gitignore`, README 병합 | Pages built·HTTP 200 | 0 | 기능 보완 |
| Step 6 | 완료 | Codex 문서 설계 | `AUTOMATION_READINESS.md` | 실행 안 함 | 0 | 전체 구현 |
| Step 8 | 완료 | Codex 문서 분석 | `CHANGE_REQUEST.md`, `AORR.md` | 실행 안 함 | 0 | 실제 요구사항 수집 |
| Step 9 | 완료 | `CODEX_WORKER`·`CODEX_FALLBACK`; Claude UNAVAILABLE | `index.html`, `styles.css`, `CHANGE_REQUEST.md` | Contact fallback PASS; Pages HTTP 200 | 0 | 운영 모니터링 |
| Step 10 | 승인 대기 | `CODEX_WORKER`·`CODEX_FALLBACK`; Claude UNAVAILABLE | `index.html`, `styles.css`, `script.js` | phrase·Scholar·SC 제거·무지개 H1 fallback PASS; 배포 전 | 0 | 승인 후 배포 |
