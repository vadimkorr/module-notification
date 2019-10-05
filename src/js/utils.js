import cuid from 'cuid';
import { ICONS } from './const/icon';

export const generateId = () => {
  return cuid();
};

/* extends default config and returns extended one */
export const extendDefaults = (source, properties) => {
  var property;
  for (property in properties) {
    if (properties.hasOwnProperty(property)) {
      source[property] = properties[property];
    }
  }
  return source;
};

/* return options if specified or default options otherwise */
export const applyArgs = (argum, defaults) => {
  if (argum && typeof argum === 'object') {
    return extendDefaults(defaults, argum);
  } else {
    return defaults;
  }
};

export const templater = ({
  id,
  title = '',
  message = '',
  type = '',
  icon = '',
  content = '',
}) => t => {
  const idPlaceholder = '{{id}}';
  const titlePlaceholder = '{{title}}';
  const messagePlaceholder = '{{message}}';
  const typePlaceholder = '{{type}}';
  const iconPlaceholder = '{{icon}}';
  const contentPlaceholder = '{{content}}';
  return (t ? t[0] : '')
    .replace(idPlaceholder, id)
    .replace(titlePlaceholder, title)
    .replace(messagePlaceholder, message)
    .replace(typePlaceholder, type)
    .replace(iconPlaceholder, icon)
    .replace(contentPlaceholder, content);
};

export const getDefaultTemplate = (id, title, message, type, icon) => {
  return templater({
    id,
    title,
    message,
    type,
    icon,
  })`
  <div
    role='mn-alert'
    id='{{id}}'
    class='mn-notification-container mn-alert mn-alert-{{type}} mn-alert-dismissible'>
    <button
      type='button'
      class='mn-close-btn mn-close'>
      <span aria-hidden='true'>&times;</span>
    </button>
    <div class='mn-notification-container-content'>
      <i class="fa fa-{{icon}}"></i>
      <span><strong>{{title}}</strong>{{message}}</span>
    </div>
  </div>`;
};

export const getCustomTemplate = (id, content) => {
  return templater({ id, content })`<div id='{{id}}'>{{content}}</div>`;
};

export const getIconNameByType = type => {
  switch (type) {
    default:
    case 'notice':
      return ICONS.INFO;
    case 'success':
      return ICONS.SUCCESS;
    case 'warning':
      return ICONS.WARNING;
    case 'error':
      return ICONS.ERROR;
  }
};

export const getCloseButtonSelector = id => {
  return `#${id} .mn-close-btn`;
};

export const msToSec = ms => {
  return ms / 1000;
};

export const fadeOut = (ms, cb) => {
  let opacity = 0;
  const step = 50;
  const opacityStep = step / ms;
  let timer = setInterval(() => {
    if (opacity >= 1.0) {
      clearInterval(timer);
    }
    cb(opacity);
    opacity += opacityStep;
  }, step);
};
