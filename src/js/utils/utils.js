import cuid from 'cuid'

export const generateId = () => {
  return cuid()
}

/* extends default config and returns extended one */
export const extendDefaults = (source, properties) => {
  const _source = { ...source }
  for (let property in properties) {
    if (properties.hasOwnProperty(property)) {
      _source[property] = properties[property]
    }
  }
  return _source
}

/* return options if specified or default options otherwise */
export const applyArgs = (argum, defaults) => {
  if (argum && typeof argum === 'object') {
    return extendDefaults(defaults, argum)
  } else {
    return defaults
  }
}

const replace = (str, find, by) => str.replace(new RegExp(find, 'g'), by)

export const templater = ({
  id,
  title = '',
  message = '',
  type = '',
  content = '',
}) => t => {
  let str = t ? t[0] : ''
  ;[
    { find: '{{id}}', by: id },
    { find: '{{title}}', by: title },
    { find: '{{message}}', by: message },
    { find: '{{type}}', by: type },
    { find: '{{content}}', by: content },
  ].forEach(({ find, by }) => {
    str = replace(str, find, by)
  })
  return str
}

export const getDefaultTemplate = (id, title, message, type) => {
  return templater({
    id,
    title,
    message,
    type,
  })`
  <div
    class="mn-notification"
    id='{{id}}'
  >
    <div class="mn-alert mn-alert-{{type}} mn-alert-dismissible">
      <button
        type='button'
        class='mn-close-btn mn-close'>
        <span aria-hidden='true'>&times;</span>
      </button>
      <div class='mn-notification-container__content'>
        <i class="mn-icon mn-icon-{{type}}"></i>
        <span><strong>{{title}}</strong> {{message}}</span>
      </div>
    </div>
  </div>`
}

export const getCustomTemplate = (id, content) => {
  return templater({ id, content })`<div id='{{id}}'>{{content}}</div>`
}

export const getCloseButtonSelector = id => {
  return `#${id} .mn-close-btn`
}
