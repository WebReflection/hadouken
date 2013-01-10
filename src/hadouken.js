this.hadouken = function () {
  /*! (C) WebReflection *//** @license work in progress */
  var
    re_PROPERTY = /\{\{([^}]+?)\}\}/g,
    indexOf = [].indexOf || function (v) {
      for(var i = this.length; i-- && this[i] !== v;);
      return i;
    }
  ;
  function findAllNodes(root, path) {
    for(var
      childNodes = root.childNodes,
      child,
      i = 0; i < childNodes.length; i++
    ) {
      child = childNodes[i];
      switch (child.nodeType) {
        case 1:
          findAttributes(child, path);
          findAllNodes(child, path);
          break;
        case 3:
          findTextSegments(root, path, child);
          break;
      }
    }
  }
  function findAttributes(root, path) {
    for (var
      attributes = root.attributes,
      attribute, match,
      i = 0; i < attributes.length; i++
    ) {
      attribute = attributes.item(i);
      while (match = re_PROPERTY.exec(attribute.nodeValue)) {
        path[match[1]] = generateNodePath(
          root,
          ".attributes.item(" + i + ")"
        );
        attribute.nodeValue = "";
      }
    }
  }
  function findFirstValidNode(root) {
    for(var childNodes = root.childNodes, i = 0; i < childNodes.length; i++)
      if (childNodes[i].nodeType == 1) return childNodes[i]
    ;
  }
  function findTextSegments(root, path, child) {
    var
      text = child.nodeValue,
      i = 0,
      node, match
    ;
    while (match = re_PROPERTY.exec(text)) {
      root.insertBefore(
        document.createTextNode(
          text.slice(i, i + match.index)
        ),
        child
      );
      root.insertBefore(
        node = document.createTextNode(""),
        child
      );
      path[match[1]] = generateNodePath(node);
      child.nodeValue = text.slice(
        i = match.index + match[0].length
      );
    }
  }
  function generateNodePath(root, attribute) {
    var sub = [];
    while (root.parentNode) {
      sub.push("childNodes[" +
        indexOf.call(root.parentNode.childNodes, root)
      + "]");
      root = root.parentNode;
    }
    return Function(
      "root", "return root." + sub.reverse().join(".") + (attribute || "")
    );
  }
  function update(data) {
    for (var key in data)
      this.map[key].nodeValue = data[key]
    ;
    return this;
  }
  return function hadouken(key) {
    var
      root = document.createElement("div"),
      path = {}
    ;
    root.innerHTML = key;
    findAllNodes(
      root = root.removeChild(
        findFirstValidNode(root)
      ),
      path
    );
    // console.log(root.innerHTML, path);
    function Hadouken() {
      this.root = root.cloneNode(true);
      this.map = {};
      for (key in path)
        this.map[key] = path[key](this.root)
      ;
    }
    Hadouken.prototype.update = update;
    return Hadouken;
  };
}();