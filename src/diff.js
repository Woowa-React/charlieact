function diff(oldVNode, newVNode, patches = [], parentDOM = null, index = 0) {
  // 1. 추가 — 이전엔 없었는데 새로 생긴 노드
  if (!oldVNode) {
    patches.push({ type: "ADD", parentDOM, newVNode });
    return patches;
  }

  // 2. 삭제 — 같은 index 자리에 이전엔 있었는데 새 버전에 없는 노드
  if (!newVNode) {
    patches.push({ type: "REMOVE", parentDOM, index });
    return patches;
  }

  // 3. 타입이 다르면 통째로 교체
  if (oldVNode.type !== newVNode.type) {
    patches.push({ type: "REPLACE", parentDOM, newVNode, index });
    return patches;
  }

  // 4. 텍스트 노드면 값만 비교
  if (newVNode.type === "TEXT") {
    if (oldVNode.props.nodeValue !== newVNode.props.nodeValue) {
      patches.push({ type: "UPDATE_TEXT", parentDOM, newVNode, index });
    }
    return patches;
  }

  // 5. 같은 타입 → children 재귀 비교
  const oldChildren = oldVNode.props.children || [];
  const newChildren = newVNode.props.children || [];
  const max = Math.max(oldChildren.length, newChildren.length);

  for (let i = max - 1; i >= 0; i--) {
    diff(oldChildren[i], newChildren[i], patches, { parentDOM, index }, i);
  }

  return patches;
}
