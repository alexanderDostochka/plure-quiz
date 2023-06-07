class VirtualNode {
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }

  /**
   * Update event listeners
   * @param {Node} element Node element
   * @param {object} newProps New props
   * @param {object} oldProps Old props
   */
  updateEventListeners(element, newProps, oldProps) {
    for (const propName in newProps) {
      const newValue = newProps[propName];
      const oldValue = oldProps[propName];

      if (propName === "onclick" && typeof newValue === "function") {
        if (newValue !== oldValue) {
          element.removeEventListener("click", oldValue);
          element.addEventListener("click", newValue);
        }
      }
    }
  }

  /**
   * Remove event listeners
   * @param {Node} element Node element
   */
  removeEventListeners(element) {
    for (const propName in this.props) {
      const propValue = this.props[propName];
      if (propName === "onclick" && typeof propValue === "function") {
        element.removeEventListener("click", propValue);
      }
    }
  }

  /**
   * Create DOM
   * @returns New node element
   */
  createDOM() {
    const newElement = document.createElement(this.tag);

    /* Add props */
    for (const propName in this.props) {
      const propValue = this.props[propName];

      // If props pass onclick
      if (propName === "onclick" && typeof propValue === "function") {
        newElement.addEventListener("click", propValue);
      } else {
        newElement.setAttribute(propName, propValue);
      }
    }

    /* Add children */
    for (const child of this.children) {
      const childDOM =
        child instanceof VirtualNode
          ? child.createDOM()
          : document.createTextNode(child);
      newElement.appendChild(childDOM);
    }

    return newElement;
  }
}

/**
 * Update props
 * @param {Node} element Node element
 * @param {object} newProps New props
 * @param {object} oldProps Old props
 */
function updateProps(element, newProps, oldProps) {
  const allProps = { ...newProps, ...oldProps };

  for (const propName in allProps) {
    const newValue = newProps[propName];
    const oldValue = oldProps[propName];

    if (
      newValue &&
      oldValue &&
      typeof newValue === "object" &&
      typeof oldValue === "object"
    ) {
      updateProps(element[propName], newValue, oldValue);
    } else if (
      newValue &&
      oldValue &&
      typeof newValue === "function" &&
      typeof oldValue === "function"
    ) {
      element[propName] = newValue;
    } else if (newValue !== oldValue) {
      if (propName === "onclick" && typeof newValue === "function") {
        element.removeEventListener("click", oldValue);
        element.addEventListener("click", newValue);
      } else if (newValue) {
        element.setAttribute(propName, newValue);
      } else {
        element.removeAttribute(propName);
      }
    }
  }
}

/**
 * DifferentNode
 * @param {Node} newNode New node
 * @param {Object} oldNode Old node
 * @returns
 */
function isDifferentNode(newNode, oldNode) {
  return (
    typeof newNode !== typeof oldNode ||
    ((typeof newNode === "string" || typeof newNode === "number") &&
      newNode !== oldNode) ||
    newNode?.tag !== oldNode?.tag
  );
}

/**
 * Render DOM
 * @param {HTMLElement} container Container
 * @param {Node} newNode New node
 * @param {Node} oldNode Old node
 * @param {number} index Number
 */
export const renderDOM = (container, newNode, oldNode = null, index = 0) => {
  if (!newNode) {
    container.removeChild(container.childNodes[index]);
  } else if (!oldNode) {
    container.appendChild(newNode.createDOM());
  } else if (isDifferentNode(newNode, oldNode)) {
    const updateNode =
      typeof newNode === "number" || typeof newNode === "string"
        ? document.createTextNode(newNode)
        : newNode.createDOM();

    container.replaceChild(updateNode, container.childNodes[index]);
  } else if (newNode.tag) {
    const targetNode = container.childNodes[index];

    if (oldNode instanceof VirtualNode) {
      oldNode.removeEventListeners(targetNode);
    }

    updateProps(targetNode, newNode.props, oldNode.props);

    if (newNode instanceof VirtualNode) {
      newNode.updateEventListeners(targetNode, newNode.props, oldNode.props);
    }

    const newChildren = newNode.children;
    const oldChildren = oldNode.children;

    const maxLen = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLen; i++) {
      renderDOM(targetNode, newChildren[i], oldChildren[i], i);
    }

    // Remove any extra old nodes
    if (oldChildren.length > newChildren.length) {
      for (let i = maxLen; i < oldChildren.length; i++) {
        targetNode.removeChild(targetNode.childNodes[maxLen]);
      }
    }
  }
};

/**
 * Create node
 * @param {string} tag Element tag name
 * @param {object} props Props
 * @param {array} children Array of elements
 * @returns Node
 */
export const h = (tag, props, children) =>
  new VirtualNode(tag, props, children || []);
