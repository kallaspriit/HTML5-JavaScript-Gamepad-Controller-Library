/* global global */
(function() {
	'use strict';

	var buster = require('buster');
	var assert = buster.assert;

	var GamepadSimulator = require('./GamepadSimulator.js');

	buster.testCase('Firefox', {
		setUp: function() {
			var simulator = new GamepadSimulator();
			var nullFunction = function() {};

			this.simulator = simulator;
			global.window = {
				addEventListener: nullFunction
			};

			this.listener = {
				_connect: nullFunction,
				_disconnect: nullFunction
			};

			this.Gamepad = require('../gamepad.js').Gamepad;
			this.platform = this.Gamepad.resolvePlatform(this.listener);
		},

		'should be supported': function() {
			assert(this.platform.isSupported());
		},

		'should provide mapping for Logitech gamepads': function() {
			var mapping = this.platform.getMapping(this.Gamepad.Type.LOGITECH);

			assert.same(mapping, this.Gamepad.Mapping.LOGITECH_FIREFOX);
		},

		'should provide mapping for Playstation gamepads': function() {
			var mapping = this.platform.getMapping(this.Gamepad.Type.PLAYSTATION);

			assert.same(mapping, this.Gamepad.Mapping.PLAYSTATION_FIREFOX);
		}

	});
})();
