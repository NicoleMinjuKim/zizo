sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
  '../model/models'
], function(
	Controller,JSONModel,formatter
) {
	"use strict";

	return Controller.extend("project3.controller.CoA", {
    models: formatter,
   
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
      sap.ui.controller("project1.controller.App").onSelected("GL_home");
			this.getOwnerComponent().getRouter().navTo("gl_home")
		},


		onNavToDetailCOA: function(oEvent) {
		
      let oData = oEvent.getSource().getParent().getParent().getBindingContext('GlModel').getObject();
      let gl_external_id = oData.gl_external_id ;
      let CoA = oData.CoA;
      let oComponent = this.getOwnerComponent(),
          oRouter = oComponent.getRouter();

        oRouter.navTo('DetailCOA', {
          gl_external_id: gl_external_id,
          CoA: CoA
        });
		}



	});
});