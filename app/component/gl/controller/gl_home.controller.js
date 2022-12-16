sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("project3.controller.gl_home", {
		onGl: function () {
			this.getOwnerComponent().getRouter().navTo("Gl");
		},
		onCreateGl: function () {
			this.getOwnerComponent().getRouter().navTo("CreateGl");
		}
	});
});