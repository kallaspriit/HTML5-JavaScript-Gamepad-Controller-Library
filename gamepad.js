/*
 * Copyright 2012 Priit Kallas <kallaspriit@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(window) {
	'use strict';

	/**
	 * Provides simple interface and multi-platform support for the gamepad API.
	 *
	 * You can change the deadzone and maximizeThreshold parameters to suit your
	 * taste but the defaults should generally work fine.
	 *
	 * @class Gamepad
	 * @constructor
	 * @module Gamepad
	 * @author Priit Kallas <kallaspriit@gmail.com>
	 */
	var Gamepad = function() {
		this.gamepads = [];
		this.listeners = {};
		this.platform = null;
		this.deadzone = 0.03;
		this.maximizeThreshold = 0.97;
	};

	/**
	 * List of supported platforms.
	 *
	 * @property Platform
	 * @param {String} Platform.UNSUPPORTED Unsupported platform
	 * @param {String} Platform.WEBKIT Webkit platform
	 * @param {String} Platform.FIREFOX Firefox platform
	 */
	Gamepad.Platform = {
		UNSUPPORTED: 'unsupported',
		WEBKIT: 'webkit',
		FIREFOX: 'firefox'
	};

	/**
	 * List of supported controller types.
	 *
	 * @property Type
	 * @param {String} Type.PLAYSTATION Playstation controller
	 * @param {String} Type.LOGITECH Logitech controller
	 * @param {String} Type.XBOX XBOX controller
	 * @param {String} Type.UNSUPPORTED Unsupported controller
	 */
	Gamepad.Type = {
		PLAYSTATION: 'playstation',
		LOGITECH: 'logitech',
		XBOX: 'xbox',
		UNSUPPORTED: 'unsupported' // replace this with 'xbox' or 'logitech' to default to some configuration
	};

	/*
	 * List of events you can expect from the library.
	 *
	 * CONNECTED, DISCONNECTED and UNSUPPORTED events include the gamepad in
	 * question and tick provides the list of all connected gamepads.
	 *
	 * BUTTON_DOWN and BUTTON_UP events provide an alternative to polling button states at each tick.
	 *
	 * AXIS_CHANGED is called if a value of some specific axis changes.
	 */
	Gamepad.Event = {
		/**
		 * Triggered when a new controller connects.
		 *
		 * @event connected
		 * @param {Object} device
		 */
		CONNECTED: 'connected',

		/**
		 * Called when an unsupported controller connects.
		 *
		 * @event unsupported
		 * @param {Object} device
		 */
		UNSUPPORTED: 'unsupported',

		/**
		 * Triggered when a controller disconnects.
		 *
		 * @event disconnected
		 * @param {Object} device
		 */
		DISCONNECTED: 'disconnected',

		/**
		 * Called regularly with the latest controllers info.
		 *
		 * @event tick
		 * @param {Array} gamepads
		 */
		TICK: 'tick',

		/**
		 * Called when a gamepad button is pressed down.
		 *
		 * @event button-down
		 * @param {Object} event
		 * @param {Object} event.gamepad The gamepad object
		 * @param {Object} event.mapping Gamepad mapping
		 * @param {String} event.control Control name
		 */
		BUTTON_DOWN: 'button-down',

		/**
		 * Called when a gamepad button is released.
		 *
		 * @event button-up
		 * @param {Object} event
		 * @param {Object} event.gamepad The gamepad object
		 * @param {Object} event.mapping Gamepad mapping
		 * @param {String} event.control Control name
		 */
		BUTTON_UP: 'button-up',

		/**
		 * Called when gamepad axis value changed.
		 *
		 * @event axis-changed
		 * @param {Object} event
		 * @param {Object} event.gamepad The gamepad object
		 * @param {Object} event.mapping Gamepad mapping
		 * @param {String} event.axis Axis name
		 * @param {Number} event.value New axis value
		 */
		AXIS_CHANGED: 'axis-changed'
	};

	/**
	 * Mapping of various gamepads on different platforms too unify their buttons
	 * and axes.
	 *
	 * The mapping can be either a simple number of the button/axes or a function
	 * that gets the gamepad as first parameter and the gamepad class as second.
	 *
	 * @property Mapping
	 */
	Gamepad.Mapping = {
		PLAYSTATION_FIREFOX: {
			buttons: {
				CROSS: 14,
				CIRCLE: 13,
				SQUARE: 15,
				TRIANGLE: 12,
				LB1: 10,
				RB1: 11,
				LEFT_STICK: 1,
				RIGHT_STICK: 2,
				START: 3,
				SELECT: 0,
				HOME: 16,
				DPAD_UP: 4,
				DPAD_DOWN: 6,
				DPAD_LEFT: 7,
				DPAD_RIGHT: 5
			},
			axes: {
				LEFT_STICK_X: 0,
				LEFT_STICK_Y: 1,
				RIGHT_STICK_X: 2,
				RIGHT_STICK_Y: 3
			}
		},
		PLAYSTATION_WEBKIT: {
			buttons: {
				CROSS: 0,
				CIRCLE: 1,
				SQUARE: 2,
				TRIANGLE: 3,
				LB1: 4,
				RB1: 5,
				LB2: 6,
				RB2: 7,
				LEFT_STICK: 10,
				RIGHT_STICK: 11,
				START: 9,
				SELECT: 8,
				HOME: 16,
				DPAD_UP: 12,
				DPAD_DOWN: 13,
				DPAD_LEFT: 14,
				DPAD_RIGHT: 15
			},
			axes: {
				LEFT_STICK_X: 0,
				LEFT_STICK_Y: 1,
				RIGHT_STICK_X: 2,
				RIGHT_STICK_Y: 3
			}
		},
		LOGITECH_FIREFOX: {
			buttons: {
				A: 0,
				B: 1,
				X: 2,
				Y: 3,
				LB: 4,
				RB: 5,
				LEFT_STICK: 8,
				RIGHT_STICK: 9,
				START: 7,
				BACK: 6,
				HOME: 10,
				DPAD_UP: 11,
				DPAD_DOWN: 12,
				DPAD_LEFT: 13,
				DPAD_RIGHT: 14
			},
			axes: {
				LEFT_STICK_X: 0,
				LEFT_STICK_Y: 1,
				RIGHT_STICK_X: 3,
				RIGHT_STICK_Y: 4,
				LEFT_TRIGGER: function(gamepad, manager) {
					if (gamepad.axes[2] > 0) {
						return manager._applyDeadzoneMaximize(gamepad.axes[2]);
					} else {
						return 0;
					}
				},
				RIGHT_TRIGGER: function(gamepad, manager) {
					if (gamepad.axes[2] < 0) {
						return manager._applyDeadzoneMaximize(gamepad.axes[2] * -1);
					} else {
						return 0;
					}
				}
			}
		},
		LOGITECH_WEBKIT: {
			buttons: {
				A: 1,
				B: 2,
				X: 0,
				Y: 3,
				LB: 4,
				RB: 5,
				LEFT_TRIGGER: 6,
				RIGHT_TRIGGER: 7,
				LEFT_STICK: 10,
				RIGHT_STICK: 11,
				START: 9,
				BACK: 8,
				HOME: 10,
				DPAD_UP: 11,
				DPAD_DOWN: 12,
				DPAD_LEFT: 13,
				DPAD_RIGHT: 14
			},
			axes: {
				LEFT_STICK_X: 0,
				LEFT_STICK_Y: 1,
				RIGHT_STICK_X: 2,
				RIGHT_STICK_Y: 3
			}
		},
		XBOX: {
			buttons: {
				A: 0,
				B: 1,
				X: 2,
				Y: 3,
				LB: 4,
				RB: 5,
				LEFT_TRIGGER: 6,
				RIGHT_TRIGGER: 7,
				LEFT_STICK: 10,
				RIGHT_STICK: 11,
				START: 9,
				BACK: 8,
				DPAD_UP: 12,
				DPAD_DOWN: 13,
				DPAD_LEFT: 14,
				DPAD_RIGHT: 15,
				HOME: 16
			},
			axes: {
				LEFT_STICK_X: 0,
				LEFT_STICK_Y: 1,
				RIGHT_STICK_X: 2,
				RIGHT_STICK_Y: 3
			}
		}
	};

	/**
	 * Initializes the gamepad.
	 *
	 * You usually want to bind to the events first and then initialize it.
	 *
	 * @method init
	 */
	Gamepad.prototype.init = function() {
		this.platform = this._resolvePlatform();

		switch (this.platform) {
			case Gamepad.Platform.WEBKIT:
				this._setupWebkit();
				break;

			case Gamepad.Platform.FIREFOX:
				this._setupFirefox();
				break;

			case Gamepad.Platform.UNSUPPORTED:
				return false;
		}

		if (typeof(window.requestAnimationFrame) === 'undefined') {
			window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
		}

		this._update();

		return true;
	};

	/**
	 * Binds a listener to a gamepad event.
	 *
	 * @method bind
	 * @param {String} event Event to bind to, one of Gamepad.Event..
	 * @param {Function} listener Listener to call when given event occurs
	 * @return {Gamepad} Self
	 */
	Gamepad.prototype.bind = function(event, listener) {
		if (typeof(this.listeners[event]) === 'undefined') {
			this.listeners[event] = [];
		}

		this.listeners[event].push(listener);

		return this;
	};

	/**
	 * Removes listener of given type.
	 *
	 * If no type is given, all listeners are removed. If no listener is given, all
	 * listeners of given type are removed.
	 *
	 * @method unbind
	 * @param {String} [type] Type of listener to remove
	 * @param {Function} [listener] The listener function to remove
	 * @return {Boolean} Was unbinding the listener successful
	 */
	Gamepad.prototype.unbind = function(type, listener) {
		if (typeof(type) === 'undefined') {
			this.listeners = {};

			return;
		}

		if (typeof(listener) === 'undefined') {
			this.listeners[type] = [];

			return;
		}

		if (typeof(this.listeners[type]) === 'undefined') {
			return false;
		}

		for (var i = 0; i < this.listeners[type].length; i++) {
			if (this.listeners[type][i] === listener) {
				this.listeners[type].splice(i, 1);

				return true;
			}
		}

		return false;
	};

	/**
	 * Returns the number of connected gamepads.
	 *
	 * @method count
	 * @return {Number}
	 */
	Gamepad.prototype.count = function() {
		return this.gamepads.length;
	};

	/**
	 * Fires an internal event with given data.
	 *
	 * @method _fire
	 * @param {String} event Event to fire, one of Gamepad.Event..
	 * @param {*} data Data to pass to the listener
	 * @private
	 */
	Gamepad.prototype._fire = function(event, data) {
		if (typeof(this.listeners[event]) === 'undefined') {
			return;
		}

		for (var i = 0; i < this.listeners[event].length; i++) {
			this.listeners[event][i].apply(this.listeners[event][i], [data]);
		}
	};

	/**
	 * Resolves platform.
	 *
	 * @method _resolvePlatform
	 * @return {String} One of Gamepad.Platform..
	 * @private
	 */
	Gamepad.prototype._resolvePlatform = function() {
		if (
			typeof(window.navigator.webkitGamepads) !== 'undefined' || typeof(window.navigator.webkitGetGamepads) !==
			'undefined'
		) {
			return Gamepad.Platform.WEBKIT;
		} else {
			return Gamepad.Platform.FIREFOX;
		}
	};

	/**
	 * Sets up webkit platform.
	 *
	 * @method _setupWebkit
	 * @private
	 */
	Gamepad.prototype._setupWebkit = function() {};

	/**
	 * Sets up Firefox platform.
	 *
	 * @method _setupFirefox
	 * @private
	 */
	Gamepad.prototype._setupFirefox = function() {
		var self = this;

		window.addEventListener('MozGamepadConnected', function(e) {
			self._connect(e.gamepad);
		});
		window.addEventListener('MozGamepadDisconnected', function(e) {
			self._disconnect(e.gamepad);
		});
	};

	/**
	 * Returns mapping for given type.
	 *
	 * @method _getMapping
	 * @param {String} type One of Gamepad.Type..
	 * @return {Object|null} Mapping or null if not supported
	 * @private
	 */
	Gamepad.prototype._getMapping = function(type) {
		switch (type) {
			case Gamepad.Type.PLAYSTATION:
				if (this.platform === Gamepad.Platform.FIREFOX) {
					return Gamepad.Mapping.PLAYSTATION_FIREFOX;
				} else if (this.platform === Gamepad.Platform.WEBKIT) {
					return Gamepad.Mapping.PLAYSTATION_WEBKIT;
				} else {
					return null;
				}
				break;

			case Gamepad.Type.LOGITECH:
				if (this.platform === Gamepad.Platform.FIREFOX) {
					return Gamepad.Mapping.LOGITECH_FIREFOX;
				} else if (this.platform === Gamepad.Platform.WEBKIT) {
					return Gamepad.Mapping.LOGITECH_WEBKIT;
				} else {
					return null;
				}
				break;

			case Gamepad.Type.XBOX:
				return Gamepad.Mapping.XBOX;
		}

		return null;
	};

	/**
	 * Registers given gamepad.
	 *
	 * @method _connect
	 * @param {Object} gamepad Gamepad to connect to
	 * @return {Boolean} Was connecting the gamepad successful
	 * @private
	 */
	Gamepad.prototype._connect = function(gamepad) {
		gamepad.type = this._resolveControllerType(gamepad.id);

		if (gamepad.type === Gamepad.Type.UNSUPPORTED) {
			this._fire(Gamepad.Event.UNSUPPORTED, gamepad);

			return false;
		}

		gamepad.mapping = this._getMapping(gamepad.type);

		if (gamepad.mapping === null) {
			this._fire(Gamepad.Event.UNSUPPORTED, gamepad);

			return false;
		}

		gamepad.state = {};
		gamepad.lastState = {};
		gamepad.downButtons = [];

		var key,
			axis;

		for (key in gamepad.mapping.buttons) {
			gamepad.state[key] = 0;
			gamepad.lastState[key] = 0;
		}

		for (axis in gamepad.mapping.axes) {
			gamepad.state[axis] = 0;
			gamepad.lastState[axis] = 0;
		}

		this.gamepads[gamepad.index] = gamepad;

		this._fire(Gamepad.Event.CONNECTED, gamepad);

		return true;
	};

	/**
	 * Disconnects from given gamepad.
	 *
	 * @method _disconnect
	 * @param {Object} gamepad Gamepad to disconnect
	 * @private
	 */
	Gamepad.prototype._disconnect = function(gamepad) {
		var newGamepads = [],
			i;

		if (typeof(this.gamepads[gamepad.index]) !== 'undefined') {
			delete this.gamepads[gamepad.index];
		}

		for (i = 0; i < this.gamepads.length; i++) {
			if (typeof(this.gamepads[i]) !== 'undefined') {
				newGamepads[i] = this.gamepads[i];
			}
		}

		this.gamepads = newGamepads;

		this._fire(Gamepad.Event.DISCONNECTED, gamepad);
	};

	/**
	 * Resolves controller type from its id.
	 *
	 * @method _resolveControllerType
	 * @param {String} id Controller id
	 * @return {String} Controller type, one of Gamepad.Type
	 * @private
	 */
	Gamepad.prototype._resolveControllerType = function(id) {
		id = id.toLowerCase();

		if (id.indexOf('playstation') !== -1) {
			return Gamepad.Type.PLAYSTATION;
		} else if (
			id.indexOf('logitech') !== -1 || id.indexOf('wireless gamepad') !== -1
		) {
			return Gamepad.Type.LOGITECH;
		} else if (id.indexOf('xbox') !== -1 || id.indexOf('360') !== -1) {
			return Gamepad.Type.XBOX;
		} else {
			return Gamepad.Type.UNSUPPORTED;
		}
	};

	/**
	 * Updates the controllers, triggering TICK events.
	 *
	 * @method _update
	 * @private
	 */
	Gamepad.prototype._update = function() {
		var self = this,
			controlName,
			isDown,
			lastDown,
			downBtnIndex,
			mapping,
			value,
			i, j;

		switch (this.platform) {
			case Gamepad.Platform.WEBKIT:
				this._updateWebkit();
				break;

			case Gamepad.Platform.FIREFOX:
				this._updateFirefox();
				break;
		}

		for (i = 0; i < this.gamepads.length; i++) {
			if (typeof(this.gamepads[i]) === 'undefined') {
				continue;
			}

			for (controlName in this.gamepads[i].mapping.buttons) {
				mapping = this.gamepads[i].mapping.buttons[controlName];

				if (typeof(mapping) === 'function') {
					value = mapping(
						this.gamepads[i],
						this
					);
				} else {
					value = this.gamepads[i].buttons[mapping];
				}

				isDown = value > 0.5 ? true : false;
				lastDown = false;

				for (j = 0; j < this.gamepads[i].downButtons.length; j++) {
					if (this.gamepads[i].downButtons[j] === controlName) {
						lastDown = true;
						downBtnIndex = i;

						break;
					}
				}

				this.gamepads[i].state[controlName] = value;

				if (isDown !== lastDown) {
					if (value > 0.5) {
						this._fire(
							Gamepad.Event.BUTTON_DOWN, {
								gamepad: this.gamepads[i],
								mapping: mapping,
								control: controlName
							}
						);

						this.gamepads[i].downButtons.push(controlName);
					} else if (value < 0.5) {
						this._fire(
							Gamepad.Event.BUTTON_UP, {
								gamepad: this.gamepads[i],
								mapping: mapping,
								control: controlName
							}
						);

						this.gamepads[i].downButtons.splice(downBtnIndex, 1);
					}
				}

				if (value !== 0 && value !== 1 && value !== this.gamepads[i].lastState[controlName]) {
					this._fire(
						Gamepad.Event.AXIS_CHANGED, {
							gamepad: this.gamepads[i],
							mapping: mapping,
							axis: controlName,
							value: value
						}
					);
				}

				this.gamepads[i].lastState[controlName] = value;
			}

			for (controlName in this.gamepads[i].mapping.axes) {
				mapping = this.gamepads[i].mapping.axes[controlName];

				if (typeof(mapping) === 'function') {
					value = mapping(
						this.gamepads[i],
						this
					);
				} else {
					value = this._applyDeadzoneMaximize(
						this.gamepads[i].axes[mapping]
					);
				}

				this.gamepads[i].state[controlName] = value;

				if (value !== this.gamepads[i].lastState[controlName]) {
					this._fire(
						Gamepad.Event.AXIS_CHANGED, {
							gamepad: this.gamepads[i],
							mapping: mapping,
							axis: controlName,
							value: value
						}
					);
				}

				this.gamepads[i].lastState[controlName] = value;
			}
		}

		if (this.gamepads.length > 0) {
			this._fire(Gamepad.Event.TICK, this.gamepads);
		}

		window.requestAnimationFrame(function() {
			self._update();
		});
	};

	/**
	 * Updates webkit platform gamepads.
	 *
	 * @method _updateWebkit
	 * @private
	 */
	Gamepad.prototype._updateWebkit = function() {
		var gamepads;

		if (typeof(window.navigator.webkitGamepads) === 'object') {
			gamepads = window.navigator.webkitGamepads;
		} else if (typeof(window.navigator.webkitGetGamepads) === 'function') {
			gamepads = window.navigator.webkitGetGamepads();
		} else {
			return; // should not happen
		}

		if (gamepads.length !== this.gamepads.length) {
			var gamepad,
				i;

			for (i = 0; i < gamepads.length; i++) {
				gamepad = gamepads[i];

				if (
					gamepad !== null && typeof(gamepad) !== 'undefined' && typeof(this.gamepads[gamepad.index]) ===
					'undefined'
				) {
					this._connect(gamepad);
				}
			}

			for (i = 0; i < this.gamepads.length; i++) {
				if (
					this.gamepads[i] !== null && typeof(this.gamepads[i]) !== 'undefined' && typeof(gamepads[i]) ===
					'undefined'
				) {
					this._disconnect(this.gamepads[i]);
				}
			}
		}
	};

	/**
	 * Updates firefox platform gamepads.
	 *
	 * @method _updateFirefox
	 * @private
	 */
	Gamepad.prototype._updateFirefox = function() {};

	/**
	 * Applies deadzone and maximization.
	 *
	 * You can change the thresholds via deadzone and maximizeThreshold members.
	 *
	 * @method _applyDeadzoneMaximize
	 * @param {Number} value Value to modify
	 * @param {Number} [deadzone] Deadzone to apply
	 * @param {Number} [maximizeThreshold] From which value to maximize value
	 * @private
	 */
	Gamepad.prototype._applyDeadzoneMaximize = function(
		value,
		deadzone,
		maximizeThreshold
	) {
		deadzone = typeof(deadzone) !== 'undefined' ? deadzone : this.deadzone;
		maximizeThreshold = typeof(maximizeThreshold) !== 'undefined' ? maximizeThreshold : this.maximizeThreshold;

		if (value >= 0) {
			if (value < deadzone) {
				value = 0;
			} else if (value > maximizeThreshold) {
				value = 1;
			}
		} else {
			if (value > -deadzone) {
				value = 0;
			} else if (value < -maximizeThreshold) {
				value = -1;
			}
		}

		return value;
	};

	window.Gamepad = Gamepad;

})(window);
