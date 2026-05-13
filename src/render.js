function createNode({ type, props }) {
  const { children = [], ...attributes } = props;

  if (type === "TEXT") {
    return document.createTextNode(attributes.nodeValue);
  }

  const domNode = document.createElement(type);

  Object.entries(attributes).forEach(([key, value]) => {
    domNode[key] = value;
  });

  children.forEach((child) => {
    domNode.appendChild(createNode(child));
  });

  return domNode;
}

function mount(newVNode, container) {
  container.appendChild(createNode(newVNode));
}

function render(newVNode, container) {
  const oldVNode = container._prevVNode;

  if (!oldVNode) {
    // 최초 렌더링 → mount
    mount(newVNode, container);
  } else {
    // 업데이트 → Render Phase: diff, Commit Phase: commit
    const patches = diff(oldVNode, newVNode, [], container, 0);
    commit(patches);
  }

  container._prevVNode = newVNode;
}
