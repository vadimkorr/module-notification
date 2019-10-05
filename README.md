# module-notification (v2.x.x)

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

# Table of Contents

1. <a href="#installation">Installation</a>
1. <a href="#referencing">Referencing</a>
1. <a href="#usage">Usage</a>
1. <a href="#customization">Customization</a>

## <a name="installation">Installation</a>

```console
npm install module-notification --save
```

```console
yarn add module-notification
```

## <a name="referencing">Referencing</a>

### requirejs

```js
define([
  './node_modules/module-notification/dist/module-notification.js',
], function() {
  //...
});
```

### index.html

```html
<html>
  <head>
    <!-- reference style -->
    <link
      rel="stylesheet"
      href="./node_modules/module-notification/dist/module-notification.css"
    />
  </head>
  <body>
    <!-- reference script -->
    <script src="./node_modules/module-notification/dist/module-notification.js"></script>
  </body>
</html>
```

## <a name="usage">Usage</a>

### Create html element where notifications will be pushed

```html
<div id="notifications"></div>
```

### Specify styles

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

### Create new module

```js
let myMNModule = new MNModule({
  container: '#notifications',
  onNotifsNumberChange: number => {
    console.info('Number of notifications', number);
  },
  direction: 'fromTop', // 'fromTop' (by default), 'fromBottom'
});
```

### Create group (optional)

Group is like an id for the set of notifications. Group may have one or more elements. You can force the group to have only one element making field `greedy` equal to `true`.

```js
myMNModule.createEmptyGroup({
  name: 'test',
  greedy: false,
});
```

### Push notification

```js
let myNotif = myMNModule.pushNotif({
  title: 'Hello!',
  message: "I'm a notification",
  icon: 'ok-sign', // Font Awesome icon name
  closeCond: 5000, // ms, put false (by default) to prevent closing
  type: 'notice', // 'notice' (by default), 'warning', 'error', 'success'
  group: 'test', // 'common' (by defalut)
});
```

see other [Font Awesome](https://fontawesome.com/icons?d=gallery&m=free) icons

### Pull notification

```js
myNotif.pull();
```

### Pull all the notifications of the specified group

```js
myMNModule.pullGroupNotifs('test');
```

### Pull all the notifications of the module

```js
myMNModule.pullAll();
```

## <a name="customization">Customization</a>

### Steps

To add customized notidfications you have to:

<ol start="1">
  <li>

Specify function which will return custom template, e.g.

```js
var customTemplateFunc = function(title, message) {
  return `
    <div class='custom-notification'>
      <span>${title}</span>
      <span>${message}</span>
      <span class='mn-close-btn custom-close-btn'>[x]</span>
    </div>
  `;
};
```

  </li>
  <li>

And assign this function to **template** field:

```js
customizedNotifsModule.pushNotif({
  closeCond: false,
  title: 'Hey',
  message: 'I`m a custom notification',
  template: customTemplateFunc,
});
```

  </li>
</ol>

In order to make the notification closable by user click assign class `.mn-close-btn` to the element which will trigger closing on click, e.g.

```html
<span class="mn-close-btn">[x]</span>
```

### Example

We prepared small but pretty awesome example of customized notifications, hope you will like it

<img src="http://g.recordit.co/z1yhU4dDz2.gif" alt="Customized notifications preview" width="450px" />

For more examples see our [demo](https://vadimkorr.github.io/module-notification/)
