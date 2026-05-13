// parentDOM이 실제 DOM이면 그대로,
// { parentDOM, index } 참조 객체면 타고 들어가서 실제 DOM 찾기
function resolveDOM(ref) {
  if (ref instanceof Node) return ref;
  const parent = resolveDOM(ref.parentDOM);
  return parent.childNodes[ref.index];
}

function commit(patches) {
  patches.forEach((patch) => {
    const parentDOM = resolveDOM(patch.parentDOM);

    if (patch.type === "ADD") {
      parentDOM.appendChild(createNode(patch.newVNode));
    }

    if (patch.type === "REMOVE") {
      parentDOM.removeChild(parentDOM.childNodes[patch.index]);
    }

    if (patch.type === "REPLACE") {
      parentDOM.replaceChild(
        createNode(patch.newVNode),
        parentDOM.childNodes[patch.index],
      );
    }

    if (patch.type === "UPDATE_TEXT") {
      parentDOM.childNodes[patch.index].nodeValue =
        patch.newVNode.props.nodeValue;
    }
  });
}
