HTML5-JavaScript-Gamepad-Controller-Library
===========================================

**Library for accessing gamepads in modern browsers.**

* Works on latest Firefox and Google Chrome.
* Very easy to add mappings to new controllers.
* Lightweight.
* Includes settings for deadzone and maximization.
* Simple event-based system.
* Minimal working example provided.
* Does not depend on any other library.
* Includes minimized version.


How to use
----------
* Include the library.

`<script src="gamepad.js"></script>`

* Create an instance of the Gamepad class.

`var gamepad = new Gamepad();`

* Bind to the events
```javascript
	gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
		// a new gamepad connected
	});

	gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
		// gamepad disconnected
	});

	gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
		// an unsupported gamepad connected (add new mapping)
	});

	gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
		// gamepads were updated (around 60 times a second)
	});
```

* Initilize the gamepads
```javascript
	if (!gamepad.init()) {
		// Your browser does not support gamepads, get the latest Google Chrome or Firefox
	}
```

* Try the working example in index.html for more tips


Changelog
---------
28.09.2012 - Updated the library to work with Chrome 22+, still works with version 21 too.