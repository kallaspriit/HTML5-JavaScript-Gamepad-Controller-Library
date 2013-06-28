(function() {
	'use strict';

	var nullFunction = function() {};

	var GamepadUser = function(events, api) {
		var that = this;

		function binder(event, handlerName) {
			api.bind(event, function() {
				that[handlerName].apply(that, arguments);
			});
		}

		binder(events.UNSUPPORTED, 'onUnsupported');
		binder(events.CONNECTED, 'onConnected');
		binder(events.DISCONNECTED, 'onDisconnected');
	};

	GamepadUser.prototype.onUnsupported = nullFunction;
	GamepadUser.prototype.onConnected = nullFunction;
	GamepadUser.prototype.onDisconnected = nullFunction;


	module.exports = GamepadUser;
})();
