function createNode({ type, props }) {
  const { children = [], ...attributes } = props;

  //텍스트면 텍스트 노드 반환
  if (type === "TEXT") {
    return document.createTextNode(attributes.nodeValue);
  }
  // 일반 엘리먼트 생성
  const domNode = document.createElement(type);

  // 속성 부여
  Object.entries(attributes).forEach(([key, value]) => {
    domNode[key] = value;
  });

  // 자식 재귀 처리
  children.forEach((child) => {
    domNode.appendChild(createNode(child));
  });

  console.log(`${type} DOM 종료`);

  return domNode;
}

function render(newVnode, container) {
  const oldVnode = container._prevNode;

  if (!oldVnode) {
    mount(newVnode, container);
  } else {
    console.log(`비교를 시작합니다. ${oldVnode} vs ${newVnode}`);
  }
  container._prevNode = newVnode;
}

function mount(reactElement, root) {
  root.appendChild(createNode(reactElement));
}

// 1. 가상돔 설계도 그리기 (다양한 요소를 섞어보세요)
const myApp = createElement(
  "div",
  { className: "box" },
  createElement("h1", { id: "title" }, "나의 미니 리액트 완성!"),
  createElement("p", null, "오늘 1일차와 2일차 목표를 달성했습니다."),
  createElement(
    "ul",
    null,
    createElement("li", null, "Virtual DOM 설계"),
    createElement("li", null, "Recursive mounting 구현"),
  ),
);

// 2. 실제 화면에 그리기
const rootElement = document.getElementById("root");
render(myApp, rootElement);

// 3. 성공 확인 콘솔

console.log("첫 번째 렌더링 완료", rootElement._prevNode);

setTimeout(() => {
  const myApp2 = createElement(
    "div",
    { className: "box" },
    createElement("h1", { id: "title" }, "반가워!"),
    createElement("p", null, "두 번째 렌더링입니다."),
  );
  render(myApp2, rootElement);
  console.log("두 번째 렌더링 완료", rootElement._prevNode);
}, 2000);
