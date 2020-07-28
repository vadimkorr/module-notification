export const getElement = query => document.querySelector(`${query}`);
export const getElementById = id => getElement(`#${id}`);

export const removeClass = (el, className) => {
  if (el) {
    el.classList.remove(className);
  }
};

export const addClass = (el, className) => {
  if (el) {
    el.className = `${el.className} ${className}`;
  }
};

export const getElementFromHtmlString = htmlString => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

export const appendElementToContainer = (container, element) => {
  if (!container || !element) return;
  if (typeof element === 'string') {
    container.insertAdjacentHTML('beforeend', element);
  } else {
    container.append(element);
  }
};

export const prependElementToContainer = (container, element) => {
  if (!container || !element) return;
  if (typeof element === 'string') {
    container.insertAdjacentHTML('afterbegin', element);
  } else {
    container.prepend(element);
  }
};

export const removeElement = element => {
  element.parentNode.removeChild(element);
};

export const removeElementById = id => {
  const el = getElementById(id);
  if (el) {
    removeElement(el);
  }
};

export const addOnClick = (query, cb) => {
  const element = getElement(query);
  if (element) {
    element.addEventListener('click', cb, false);
  }
};
