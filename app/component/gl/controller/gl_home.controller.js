sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(
	Controller,JSONModel
) {
	"use strict";

	return Controller.extend("project3.controller.gl_home", {


		onInit: async function() {

            const myRoute = this.getOwnerComponent().getRouter().getRoute("gl_home");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

		onMyRoutePatternMatched: async function() {

		let glurl =  "/gl/Gl?$filter=opendata eq  true&$top=3"

		const Gl = await $.ajax({
			type: "get",
			url:glurl
		});

		let GlModel = new JSONModel(Gl. value);
            this.getView().setModel(GlModel, "GlModel");
	



		},


		onGl: function () {
			sap.ui.controller("project1.controller.App").onSelected('gl_display');
			this.getOwnerComponent().getRouter().navTo("Gl");
		},
		onCreateGl: function () {
			sap.ui.controller("project1.controller.App").onSelected('gl_create');
			this.getOwnerComponent().getRouter().navTo("CreateGl");
		},

		//! 내가수정한거
		onGl_chart: function () {
			sap.ui.controller("project1.controller.App").onSelected('glchart_view');
			this.getOwnerComponent().getRouter().navTo("Gl_chart");
		},

		onTest02: function (oEvent) {
            var x=oEvent.getSource().oBindingContexts.GlModel.sPath;
            console.log(oEvent.getSource().oBindingContexts.GlModel.sPath);
            console.log(this.getView().getModel("GlModel").getProperty(x).gl_external_id);
            var gl_external_id=this.getView().getModel("GlModel").getProperty(x).gl_external_id;

			sap.ui.controller("project1.controller.App").onSelected("gl_display");

            this.getOwnerComponent().getRouter().navTo("DetailGl", {num : gl_external_id});

        },

		onCoA: function () {
			sap.ui.controller("project1.controller.App").onSelected('COA_view');
			this.getOwnerComponent().getRouter().navTo("CoA");
		},

		onFixFlexChart: function() {
			sap.ui.controller("project1.controller.App").onSelected('revenue_chart');
			this.getOwnerComponent().getRouter().navTo("GlChartFixFlex")
		}
	});
});