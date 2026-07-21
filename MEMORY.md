## Project Settings

- GitHub Pages 주소: https://raycho370-rgb.github.io
- GitHub 저장소: https://github.com/raycho370-rgb/raycho370-rgb.github.io
- GitHub 토큰 파일명: `github_token.txt` (값은 읽거나 저장하지 않음)
- 프로필 참고 자료: `Sungrae_Cho_Microsoft_Final_Resume_v3.pdf`
- 웹사이트 디자인 참고: Facebook
- 게임 추가 기능: 랜덤하게 움직이는 적

## Goal

정적 HTML/CSS/JavaScript로 반응형 프로페셔널 웹사이트와 Games 지렁이 게임을 완성하고 승인 후 GitHub Pages에 배포한다.

## Scope / Out of Scope

- Scope: 프로필·경력·기술·학력, 반응형 UI, Games 메뉴, 키보드·터치 게임, 랜덤 적, Pages 배포.
- Out of Scope: 백엔드, 임의의 외부 서비스·프레임워크, 미승인 개인정보 공개, 테스트 완화, 승인 전 push·배포.

## Execution

- Mode: `CODEX_WORKER + CLAUDE_VERIFIER` 전환 대기; Claude 실행 불가 시 `CODEX_FALLBACK`.
- Claude model: CLI `2.1.216`, 로그인 확인됨; 실제 Sonnet 모델명은 아직 미확인, Sonnet 5 사용 가능 여부 미확인.
- Last test: `PASS` (Codex 로컬 문법·브라우저·반응형 확인); Claude baseline은 미실행.

## Current State

- 상태: `READY`.
- 완료 루프: Step 1 분석, Step 2 AORR 상태 머신, Step 3 Self-Correcting TDD 설계.
- 다음 루프: 실제 Claude Sonnet 모델 확인 후 Verifier 기준선 테스트 실행.
- Retry: 0회.
- fingerprint: 없음.
- blocker: 실제 Sonnet 모델명 및 사용 가능 여부 미확인.
- 마지막 정상 commit·URL: 정상 commit 없음; 배포 전이며 Pages target URL만 설정됨.

## Acceptance

HTML 구조·내부 링크, 375/768/1440px 반응형, JavaScript 무오류, 게임 핵심·키보드·터치·랜덤 적, 로컬 HTTP, GitHub Pages 호환성, Claude 전체 검증 통과 후 승인된 배포를 충족한다.

## Guardrails

- 확인되지 않은 개인 정보를 생성하거나 기존 콘텐츠를 임의 삭제하지 않는다.
- 테스트를 삭제·완화하지 않으며 대규모 재작성하지 않는다.
- 백엔드·외부 서비스·프레임워크를 임의 추가하지 않는다.
- 토큰을 출력·로그·코드·문서·Git에 저장하지 않는다.
- 한 Retry에서는 원인 하나와 최소 관련 파일만 수정한다.
- Claude가 실행한 테스트를 Codex가 중복 실행하지 않는다.
- 상세 실행 기록은 `AORR_LOG.md`에 저장한다.

## Retry / HITL

- 오류당 최대 3회; 동일 fingerprint 2회면 중지하고 `BLOCKED` 또는 `HITL_REQUIRED`로 전환한다.
- 공개 범위, 게임 규칙, Claude 모델, GitHub 인증·설정, 배포 승인 또는 원인 불명 오류는 `HITL_REQUIRED`로 둔다.

## Recent Loops

| Loop | 상태 | 실행 모드·모델 | 변경 파일 | 테스트 결과 | Retry | 다음 작업 |
|---|---|---|---|---|---|---|
| Step 1 | 완료 | Codex 분석 | `STEP1_ANALYSIS.md` | 실행 안 함 | 0 | AORR 설계 |
| Step 2 | 완료 | Codex 문서 설계 | `AORR.md` | 실행 안 함 | 0 | TDD 설계 |
| Step 3 | 완료 | Codex 문서 설계; Claude CLI 2.1.216 로그인 확인 | `AORR.md`, `MEMORY.md` | 테스트 실행 안 함; 모델 확인 대기 | 0 | Sonnet 모델 확인 및 Claude baseline |
