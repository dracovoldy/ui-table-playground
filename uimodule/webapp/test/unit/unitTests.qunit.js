/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"oft/fiori/crudBatch/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});