function patch(parentDOM, oldVNode, newVNode, index = 0) {
  const currentDOM = parentDOM.childNodes[index];

  // 1. 추가
  if (!oldVNode) {
    parentDOM.appendChild(createNode(newVNode));
    return;
  }

  // 2. 삭제
  if (!newVNode) {
    parentDOM.removeChild(currentDOM);
    return;
  }

  // 3. 타입이 다르면 통째로 교체
  if (oldVNode.type !== newVNode.type) {
    parentDOM.replaceChild(createNode(newVNode), currentDOM);
    return;
  }

  // 4. 텍스트 노드면 값만 교체
  if (newVNode.type === "TEXT") {
    if (oldVNode.props.nodeValue !== newVNode.props.nodeValue) {
      currentDOM.nodeValue = newVNode.props.nodeValue;
    }
    return;
  }

  // 5. 같은 타입 → children 재귀 비교
  const oldChildren = oldVNode.props.children || [];
  const newChildren = newVNode.props.children || [];
  const max = Math.max(oldChildren.length, newChildren.length);

  for (let i = max - 1; i >= 0; i--) {
    patch(currentDOM, oldChildren[i], newChildren[i], i);
  }
}
