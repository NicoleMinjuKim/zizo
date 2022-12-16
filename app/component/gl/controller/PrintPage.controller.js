sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	var PageController = Controller.extend("project3.controller.PrintPage", {

		onInit : function () {
			this._sValidPath = sap.ui.require.toUrl("pdf/화면정의서.pdf");
			// this._sInvalidPath = sap.ui.require.toUrl("sap/m/sample/PDFViewerEmbedded/sample_nonexisting.pdf");
			this._oModel = new JSONModel({
				Source: this._sValidPath,
				Title: "My Custom Title",
				Height: "600px"
			});
			this.getView().setModel(this._oModel);
		}
	});

	return PageController;

});