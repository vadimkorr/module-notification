# module-notification

[![npm](https://img.shields.io/npm/v/module-notification.svg)](https://www.npmjs.com/package/module-notification) [![npm](https://img.shields.io/npm/dm/module-notification.svg)](https://www.npmjs.com/package/module-notification)
<br />
[![GitHub repo](https://img.shields.io/badge/github-repo-green.svg?style=flat)](https://github.com/vadimkorr/module-notification) [![GitHub followers](https://img.shields.io/github/followers/vadimkorr.svg?style=social&label=Follow)](https://github.com/vadimkorr)
<br />
[![Build Status](https://travis-ci.org/vadimkorr/module-notification.svg?branch=master)](https://travis-ci.org/vadimkorr/module-notification)
<br />
[![npm](https://img.shields.io/npm/l/module-notification.svg)](https://www.npmjs.com/package/module-notification)
<br />

#### JS library for displaying Notifications inside specified html element containers (Modules). You can create multiple independent Modules which own separate set of Notifications.

You can check out the [Demo](https://vadimkorr.github.io/module-notification)
<br />
<br />
<img src="https://content.screencast.com/users/mintday/folders/Jing/media/4ca2e283-8194-46aa-a3d8-5004b2211644/2017-07-24_2108.png" alt="Notifications Preview" width="450px" />

## <a name="changelog">Change log</a>

- v2.0.0 - Removed jQuery dependency, used Font Awesome for icons
- v3.0.0 - Optimized builds, removed third-party font providers, add more animations

## <a name="installation">Installation</a>

```console
npm install module-notification
yarn add module-notification
```

## <a name="referencing">Referencing</a>

### requirejs

```js
define(['./node_modules/module-notification/dist/index.js'], function() {
  //...
})
```

### index.html (local)

```html
<html>
  <head> </head>
  <body>
    <script src="./node_modules/module-notification/dist/index.js"></script>
  </body>
</html>
```

### index.html (CDN)

```html
<html>
  <head> </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/module-notification/dist/index.js"></script>
  </body>
</html>
```

## <a name="usage">Usage</a>

<ol start="1">
  <li>
Create html element where notifications will be pushed

```html
<div id="notifications"></div>
```

  </li>
  <li>

Specify styles

```css
#notifications {
  min-height: 250px;
  width: 400px;
  padding: 10px;
  background-color: #f7f9ff;
  border-radius: 20px;
  border-color: #a8bbff;
  border-width: 2px;
  border-style: solid;
}
```

  </li>
  <li>

Create new module

```js
let myNotificationsModule = new MNModule({
  container: '#notifications', // required
  onNotificationsCountChange: number => {
    console.log('Number of notifications', number)
  },
})
```

  </li>
  <li>

Create group (optional)

Groups used to operate with the subset of notifications. Group may have one or more elements. You can force the group to have only one element making field `greedy` equal to `true`. It is not necessary to create group, all notifications without specifying `groupId` will be associated with group with id `default`.

```js
myNotificationsModule.createEmptyGroup({
  id: 'test', // required
  greedy: false,
})
```

  </li>
  <li>

Add notifications

```js
// pushNotification - appends new notification (is added from the bottom)
let myNotification1 = myMNModule.pushNotification({
  title: 'Hello!',
  message: "I'm a notification",
  animation: 'fade', // 'fade' (by default), 'rotate'
  closeInMS: 5000, // Notification will be closed automatically in specified amount of milliseconds; to prevent notification from closing, just omit this option. It does not close automatically by default.
  groupId: 'test', // 'default' (by default)
  type: 'info', // "info" (by default), "warning", "error", "success"
  template: ({ title, message }) => `<p>${title}</p>`, // Allows to create customized notifications. If used, type will be ignored.
})

// unshiftNotification - prepends new notification (is added from the top)
let myNotification2 = myMNModule.unshiftNotification({
  // same options as pushNotification
})
```

  </li>
  <li>

Remove notification

```js
myNotification1.remove()
```

  </li>
  <li>

Remove all the notifications of the specified group

```js
myModule.removeNotifications('test')
```

  </li>
  <li>

Remove all the notifications of the module

```js
myModule.removeNotifications()
```

  </li>
</ol>

## <a name="customization">Customization</a>

To add customized notidfications you have to:

<ol start="1">
  <li>

Specify function which will return custom template, e.g.

```js
const customTemplate = ({ title, message }) => {
  return `
    <div class='custom-notification'>
      <span>${title}</span>
      <span>${message}</span>
      <span class='mn-close-btn custom-close-btn'>[x]</span>
    </div>
  `
}
```

In order to make custom notification closable by user click assign class `.mn-close-btn` to the element which will trigger closing on click, e.g.

```html
<span class="mn-close-btn">[x]</span>
```

  </li>
  <li>

And assign this function to `template` option:

```js
customizedNotifsModule.pushNotification({
  title: 'Hello!',
  message: "I'm a custom notification",
  template: customTemplate,
})
```

  </li>
</ol>

### Example

We prepared small but pretty awesome example of customized notifications, hope you will like it

<img src="http://g.recordit.co/z1yhU4dDz2.gif" alt="Customized notifications preview" width="450px" />

For more examples see our [demo](https://vadimkorr.github.io/module-notification/)
