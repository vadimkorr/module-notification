# module-notification
#### Plugin for displaying notifications inside specified html element containers (modules). You can create multiple independent modules which own their set of notifications.

# Table of Contents
1. <a href="#referencing">Referencing</a>
1. <a href="#usage">Usage</a>

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
    console.info("Number of notificationss", number);
  },
  direction: "fromTop"//"fromTop" (by default), "fromBottom"
});	
```
### Create group (optional)
###### Group is like an id for the set of notifications. Group may have one or more elements. You can force the group to have only one element making field ```greedy``` equal to ```true```.
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