sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("project2.controller.customer_home", {
		onCustomer: function () {
			this.getOwnerComponent().getRouter().navTo("Customer");
		},
		onDetailCustomer: function () {
			this.getOwnerComponent().getRouter().navTo("DetailCustomer");
		},
		onCreateCustomer: function () {
			this.getOwnerComponent().getRouter().navTo("CreateCustomer");
		}
	});
});