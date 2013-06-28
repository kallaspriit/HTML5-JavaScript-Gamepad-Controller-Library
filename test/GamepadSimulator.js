(function() {
	'use strict';

	var Gamepad = function(index, id) {
		this.index = index;
		this.id = id;
	};

	var GamepadSimulator = function() {
		this.gamepads = [];
	};

	GamepadSimulator.prototype.getGamepads = function() {
		return this.gamepads;
	};

	GamepadSimulator.prototype.addGamepad = function(index, id) {
		var gamepad = new Gamepad(index, id);

		while (index >= this.gamepads.length) {
			this.gamepads.push(null);
		}
		this.gamepads[index] = gamepad;

		return gamepad;
	};

	GamepadSimulator.prototype.removeGamepad = function(index) {
		this.gamepads[index] = null;
	};

	module.exports = GamepadSimulator;
})();
