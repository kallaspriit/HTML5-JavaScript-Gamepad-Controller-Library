HTML5-JavaScript-Gamepad-Controller-Library
===========================================

**Library for accessing gamepads in modern browsers.**

* Works with modern browsers and has mappings to many controllers.
* Very easy to add mappings to new controllers.
* Lightweight.
* Includes settings for deadzone and maximization.
* Simple event-based system.
* Includes state change events.
* Minimal working example provided.
* Does not depend on any other library.
* Includes minimized version.


How to use
----------
* Include the library.
```javascript
	<script src="gamepad.js"></script>
```

* Create an instance of the Gamepad class.
```javascript
	var gamepad = new Gamepad();
```

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

	gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
		// e.control of gamepad e.gamepad pressed down
	});
	
	gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
		// e.control of gamepad e.gamepad released
	});

	gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
		// e.axis changed to value e.value for gamepad e.gamepad
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