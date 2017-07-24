# module-notification

[![npm](https://img.shields.io/npm/v/module-notification.svg)](https://www.npmjs.com/package/module-notification) [![npm](https://img.shields.io/npm/dm/module-notification.svg)](https://www.npmjs.com/package/module-notification)
<br />
[![GitHub repo](https://img.shields.io/badge/github-repo-green.svg?style=flat)](https://github.com/vadimkorr/module-notification) [![GitHub followers](https://img.shields.io/github/followers/vadimkorr.svg?style=social&label=Follow)](https://github.com/vadimkorr)
<br />
[![npm](https://img.shields.io/npm/l/module-notification.svg)](https://www.npmjs.com/package/module-notification)
<br />
#### Plugin for displaying Notifications inside specified html element containers (Modules). You can create multiple independent Modules which own their set of Notifications.
You can check out the demo playground. Just open **index.html** from **demo** folder. The playground hosted on the [GitHub Pages](https://pages.github.com/) coming soon!)
<br />
<br />
<img src="https://content.screencast.com/users/mintday/folders/Jing/media/4ca2e283-8194-46aa-a3d8-5004b2211644/2017-07-24_2108.png" alt="Notifications Preview" width="450px" />

# Table of Contents
1. <a href="#installation">Installation</a>
1. <a href="#referencing">Referencing</a>
1. <a href="#usage">Usage</a>

## <a name="installation">Installation</a>
```
npm install module-notification --save
```

## <a name="referencing">Referencing</a>
### requirejs
```js
define(
  ["./node_modules/module-notification/dist/module-notification.js"],
  function() {
    //...
  }
);
```
### index.html
```html
<html>
  <head>
    <!-- reference style -->
    <link rel="stylesheet" href="./node_modules/module-notification/dist/module-notification.css">
  </head>
  <body>
    <!-- reference script -->
    <script src="./node_modules/module-notification/dist/module-notification.js"></script>
  </body>
</html>
```

*** 
If you have [jQuery](https://jquery.com/) installed use **module-notification.js** from **js** folder, e.g.
```html
<!-- reference script -->
<script src="./node_modules/module-notification/js/module-notification.js"></script>
```


## <a name="usage">Usage</a>
### Create html element where notifications will be pushed
```html
<div id="notifications">
</div>
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
var myMNModule = new MNModule({
  container: "#notifications",
  onNotifsNumberChange: function(number) {
    console.info("Number of notifications", number);
  },
  direction: "fromTop"//"fromTop" (by default), "fromBottom"
});	
```
### Create group (optional)
Group is like an id for the set of notifications. Group may have one or more elements. You can force the group to have only one element making field ```greedy``` equal to ```true```.
```js
myMNModule.createEmptyGroup({
  name: "test",
  greedy: false
});
```
### Push notification
```js
var myNotif = myMNModule.pushNotif({
  title: "Hello!",
  message: "I'm a notification",
  icon: "ok-sign",//glyphicon icon name
  closeCond: 5000,//ms, put false (by default) to prevent closing 
  type: "notice",//"notice" (by default), "warning", "error", "success"
  group: "test",//"common" (by defalut)
});
```
see other [Glyphicon](http://getbootstrap.com/components/#glyphicons) icons
### Pull notification
```js
myNotif.pull();
```
### Pull all the notifications of the specified group
```js
myMNModule.pullGroupNotifs("test");
```
### Pull all the notifications of the module
```js
myMNModule.pullAll();
```