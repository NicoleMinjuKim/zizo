sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(
	Controller,JSONModel
) {
	"use strict";

	return Controller.extend("project3.controller.CoA", {


		onInit: async function () {
            this.getOwnerComponent().getRouter().getRoute("CoA").attachPatternMatched(this.onMyRoutePatternMatched, this);},


            onMyRoutePatternMatched: async function(){
              this.onView();
            },
            onView: async function() {
            const CoA = await $.ajax({
                type: "get",
                url: "/gl/Gl"
            });
            console.log(CoA);
            let GlModel = new JSONModel(CoA.value);
            this.getView().setModel(GlModel, "GlModel");
            console.log(this.getView().getModel("GlModel"))


        },


		ongoBack: function() {
			this.getOwnerComponent().getRouter().navTo("gl_home")
		},



	});
});