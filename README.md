# 미니 리액트 만들기

Fiber 없이 Virtual DOM과 React 렌더링 파이프라인을 직접 구현하며 이해한다.

## 흐름

`createElement` 호출로 Virtual DOM 객체를 만들고, 그걸 `render`로 실제 DOM에 붙인다. 이벤트가 발생하면 `setState`가 새 Virtual DOM을 만들고, 이전 것과 비교해서 바뀐 부분만 DOM에 반영한다.

이 루프가 한 바퀴 돌면 끝이다.

> React는 state update가 발생하면 렌더를 트리거하고, 컴포넌트 함수를 호출해 다음 Virtual DOM을 계산한 뒤, 이전 Virtual DOM과 비교해서 필요한 DOM 변경만 commit한다.

## 핵심 질문

이 질문들에 답할 수 있는 게 목표다.

1. JSX는 어떻게 JavaScript 객체가 되는가?
2. Virtual DOM은 왜 plain object로 표현할 수 있는가?
3. Virtual DOM은 언제 실제 DOM이 되는가?
4. 렌더링은 실제 DOM 변경인가, 다음 UI 계산인가?
5. 이전 Virtual DOM과 새 Virtual DOM을 왜 비교하는가?
6. `setState`의 setter는 어떻게 전체 렌더링 파이프라인을 다시 트리거하는가?

## 섹션 구성

1섹션: createElement (1~3일차)

JSX 문법이 결국 함수 호출이라는 걸 확인하고, `{ type, props, children }` 형태의 순수 JS 객체를 만드는 공장 함수를 짠다. 문자열이나 숫자 자식은 `{ type: "TEXT" }` 객체로 포장한다.

체크포인트: JSX는 HTML이 아니라 JavaScript 표현이라는 것을 설명할 수 있는가? Virtual DOM이 plain object여도 되는 이유를 설명할 수 있는가?

2섹션: render, 초기 마운트 (4~6일차)

1섹션에서 만든 vNode 트리를 재귀로 순회하며 `document.createElement`, `createTextNode`로 실제 DOM을 만든다. prop 처리는 세 가지로 구분한다.

- `on`으로 시작하면 → `addEventListener`로 이벤트 등록
- `className`이면 → `setAttribute("class", value)`
- 나머지는 → `setAttribute(key, value)`

체크포인트: Virtual DOM이 실제 DOM으로 바뀌는 시점을 설명할 수 있는가? 브라우저 렌더링 파이프라인과 미니 React 렌더링 파이프라인이 어디서 만나는지 설명할 수 있는가?

3섹션: diff + patch (7~10일차)

상태가 바뀌면 vNode를 새로 만들고, 이전 vNode와 비교해서 달라진 부분만 DOM에 반영한다.

- `type`이 다르면 → DOM 노드 통째로 교체
- 텍스트가 다르면 → `textContent` 변경
- prop만 다르면 → attribute / 이벤트만 갱신
- child가 추가됐으면 → `appendChild`
- child가 없어졌으면 → `removeChild`

children 비교는 index 기준으로만 한다. key 기반 list diffing은 이번 범위 밖이다.

체크포인트: 왜 매번 전체 DOM을 다시 만들지 않는지 설명할 수 있는가? "성능" 말고 구조적으로 diff가 필요한 이유를 설명할 수 있는가?

4섹션: useState, 파이프라인 완성 (11~14일차)

`useState`를 만든다. setter를 호출하면 저장된 state가 바뀌고 리렌더가 트리거된다. 이게 3섹션의 diff/patch로 연결되면 전체 루프가 완성된다.

```
이벤트 발생 → setter 호출 → 새 vNode 생성 → diff → 변경된 DOM만 patch → 화면 업데이트
```

마지막엔 카운터나 Todo 데모로 검증한다.

체크포인트: `setCount(1)` 호출 후 화면이 바뀌기까지의 과정을 직접 구현한 코드 기준으로 설명할 수 있는가? 렌더링, diff, patch, commit의 역할을 구분해서 설명할 수 있는가?

## 제외한 고려사항

Fiber, Scheduler, Concurrent Rendering, Class Component, Batching, Keyed list diffing, Synthetic Event.

`useState` 하나만 만든다. 나머지 Hook은 건드리지 않는다.

## 참고

- [React 공식문서 — Render and Commit](https://react.dev/learn/render-and-commit)
- [React 공식문서 — State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React 공식문서 — Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [React 공식문서 — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [Vanilla JS로 Virtual DOM 만들기](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Virtual-DOM/)
- [브라우저 렌더링 정리](https://cho9407.tistory.com/124)
