const TYPE = {
  CREATE: 'create',
  ASSIGN: 'assign',
  ADD: 'add',
  DEL: 'del',
  UPDATE: 'update',
  REPLACE: 'replace'
};

const toStringPrefix = (typePrefix) => {
  return typePrefix.reduce((prefix, current) => {
    prefix += `${current}_`;
    return prefix;
  }, '');
};

// typePrefix必须是数组，用于构造action type的前缀，确保type的唯一性
const createActionType = (typePrefix) => {
  const prefix = toStringPrefix(typePrefix);
  return Object.keys(TYPE).reduce((obj, key) => {
    obj[key] = prefix + TYPE[key];
    return obj;
  }, {});
};

class Action {
  constructor(typePrefix, hasParent=false) {
    this.TYPE = createActionType(typePrefix);
    if (hasParent) {
      this.PARENT = createActionType(typePrefix.slice(0, -1));
    }
  }

  create(payload) {
    return {type: this.TYPE.CREATE, payload};
  }

  assign(payload, path) {
    return {type: this.TYPE.ASSIGN, payload, path};
  }

  add(payload, path, index) {
    return {type: this.TYPE.ADD, payload, path, index};
  }

  del(path, index) {
    return {type: this.TYPE.DEL, path, index};
  }

  update(payload, path, index) {
    return {type: this.TYPE.UPDATE, payload, path, index};
  }

  replace(payload, path, index) {
    return {type: this.TYPE.REPLACE, payload, path, index};
  }

  assignParent(payload, path) {
    return {type: this.PARENT.ASSIGN, payload, path};
  }

  addParent(payload, path, index) {
    return {type: this.PARENT.ADD, payload, path, index};
  }

  delParent(path, index) {
    return {type: this.PARENT.DEL, path, index};
  }

  updateParent(payload, path, index) {
    return {type: this.PARENT.UPDATE, payload, path, index};
  }
}

Action.createActionType = createActionType;

export {Action};
