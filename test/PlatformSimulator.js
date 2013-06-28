(function() {
	'use strict';

	var PlatformSimulator = function(listener) {
		this.listener = listener;
		this.mapping = null;
	};

	PlatformSimulator.prototype.isSupported = function() {
		return true;
	};

	PlatformSimulator.prototype.update = function() {

	};

	PlatformSimulator.prototype.getMapping = function() {
		return this.mapping;
	};

	module.exports = PlatformSimulator;
})();
