export const getElement = query => document.querySelector(`${query}`);

export const getElementById = id => getElement(`#${id}`);

export const removeClass = (el, className) => {
  el && el.classList.remove(className);
};

export const addClass = (el, className) => {
  el && (el.className = `${el.className} ${className}`);
};

export const getElementFromHtmlString = htmlString => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

export const appendElementToContainer = (container, el) => {
  if (!container || !el) return;
  if (typeof el === 'string') {
    container.insertAdjacentHTML('beforeend', el);
  } else {
    container.append(el);
  }
};

export const prependElementToContainer = (container, el) => {
  if (!container || !el) return;
  if (typeof el === 'string') {
    container.insertAdjacentHTML('afterbegin', el);
  } else {
    container.prepend(el);
  }
};

export const removeElement = el => {
  el && el.parentNode.removeChild(el);
};

export const removeElementById = id => {
  const el = getElementById(id);
  el && removeElement(el);
};

export const addOnClick = (query, cb) => {
  const el = getElement(query);
  el && el.addEventListener('click', cb, false);
};
