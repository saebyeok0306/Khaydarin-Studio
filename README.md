# Khaydarin Studio

**스타크래프트 맵 제작을 위한 에디터**

Khaydarin Studio는 맵 에디터 ScmDraft 2와 데이터·EUD 에디터 EUD Editor를 하나로 합친 StarCraft: Remastered용 맵 제작 도구입니다.
지형을 칠하고 유닛을 놓는 일부터 DAT 편집, EUD 빌드까지 프로그램을 오가지 않고 한 창에서 할 수 있어요.

- 소개 페이지: https://saebyeok0306.github.io/Khaydarin-Studio/
- 다운로드: [Releases](https://github.com/saebyeok0306/Khaydarin-Studio/releases)
- 기능 건의 · 버그 제보: [Issues](https://github.com/saebyeok0306/Khaydarin-Studio/issues)

## 주요 기능

- **맵 편집** — 리마스터 그래픽을 그대로 보며 ISOM 지형, 유닛·두데드·로케이션, 대칭 배치를 편집해요. SD · HD · Cartoon 스타일을 바꿔 가며 볼 수 있어요.
- **텍스트 트리거** — ScmDraft Text Trigedit과 호환되는 문법을 구문 강조 편집기에서 써요.
- **데이터 편집** — units · weapons · upgrades 같은 DAT와 요구 조건, 게임 문자열(stat_txt), 버튼셋을 EUD Editor와 같은 구성으로 고쳐요.
- **코드 에디터 (epScript)** — 개발자를 위한 epScript 편집기에서 자동 완성·호버 같은 언어 서버 기능을 쓰며 스크립트를 작성하고, 맵과 함께 빌드해요.
- **알아서 저장** — 바뀐 값은 가능하면 맵 설정에, 그렇지 않으면 EUD로 나뉘어 저장되고, 빌드할 때 euddraft 플러그인으로 만들어져요.
- **AI 연동 (MCP)** — 내장 MCP 서버로 Claude 같은 AI가 에디터를 직접 다뤄요. 모든 작업은 Ctrl+Z로 되돌릴 수 있어요.

## 필요한 것

- **StarCraft: Remastered** (필수) — 게임 데이터를 설치 폴더에서 직접 읽어요.
- **euddraft** (선택) — EUD 맵을 빌드할 때 필요해요.
- **Node.js** (선택) — 스크립트 편집기의 자동 완성 같은 언어 서버 기능에 쓰여요.

---

StarCraft와 StarCraft: Brood War는 Blizzard Entertainment의 상표입니다. 이 프로젝트는 Blizzard와 관련이 없습니다.
