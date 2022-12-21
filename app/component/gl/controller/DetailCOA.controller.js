sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	'../model/models'
], function(
	Controller,
	JSONModel,
	formatter
	
) {
	"use strict";

    let SelectedNum;

	return Controller.extend("project3.controller.DetailCOA", {
		models: formatter,
        onInit: async function () {
			this.getOwnerComponent().getRouter().getRoute("DetailCOA").attachPatternMatched(this.onMyRoutePatternMatched, this);			

		},

		onMyRoutePatternMatched: async function(oEvent){
			
			let sCoA = oEvent.getParameter("arguments").CoA,
				sGl_external_id = oEvent.getParameter("arguments").gl_external_id;
			
			const gl_external_id = await $.ajax ({
				type: "get",
				url:"/gl/Gl/"+ sGl_external_id
			})

			const aComCode = gl_external_id.gl_comcode;

			const comcode = await $.ajax ({
				type: "get",
				url: "/companycode/Companycode/" + aComCode
			})

			// let aComCode = comcode.value.filter(
			// 	(oComcode) => {
			// 		return oComcode.CoA === sCoA; 
			// 	}
			// )

			gl_external_id.comcode = comcode.comcode;
			gl_external_id.COarea = comcode.COarea;
			gl_external_id.comname = comcode.comname;
			gl_external_id.currency = comcode.currency;
			gl_external_id.CoA = comcode.CoA;

            let DetailModel = new JSONModel([gl_external_id]);
			this.getView().setModel(DetailModel,"DetailCOA");
			
		},

		
    
        
        
        onBack: function() {
			this.getOwnerComponent().getRouter().navTo("CoA")
		},
	});
});