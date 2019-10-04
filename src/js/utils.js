import cuid from 'cuid';

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

export const templater = ({ id, title, message, type, icon }) => t => {
  const idPlaceholder = '{{id}}';
  const titlePlaceholder = '{{title}}';
  const messagePlaceholder = '{{message}}';
  const typePlaceholder = '{{type}}';
  const iconPlaceholder = '{{icon}}';
  return (t ? t[0] : '')
    .replace(idPlaceholder, id)
    .replace(titlePlaceholder, title)
    .replace(messagePlaceholder, message)
    .replace(typePlaceholder, type)
    .replace(iconPlaceholder, icon);
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
      <i class='glyphicon glyphicon-{{icon}}'></i>
      <span><strong>{{title}}</strong>{{message}}</span>
    </div>
  </div>
  `;
};
