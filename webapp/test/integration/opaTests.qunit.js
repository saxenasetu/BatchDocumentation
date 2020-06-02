QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/novonordisk/ibr/BatchDocumentation/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});