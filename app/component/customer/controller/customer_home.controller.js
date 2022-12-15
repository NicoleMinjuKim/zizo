sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(
	Controller,JSONModel
) {
	"use strict";

	return Controller.extend("project2.controller.customer_home", {
//! 최신 3개 리스트 만들기 
		onInit: async function() {

            const myRoute = this.getOwnerComponent().getRouter().getRoute("customer_home");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

        onMyRoutePatternMatched: async function() {

            let personurl = "/customer/Customer?$orderby=create_date desc&$filter=bp_category eq '1'&$top=3"

            const Customer = await $.ajax({
                type: "get",
                url:personurl
            });

            let CustomerModel = new JSONModel(Customer. value);
            this.getView().setModel(CustomerModel, "CustomerModel");
		

		//! 최신 3개 데이터 민들기

			let organizationurl = "/customer/Customer?$orderby=create_date desc&$filter=bp_category eq '2'&$top=3"

		const Organization = await $.ajax({
			type: "get",
			url:organizationurl
		});

		let OrganizationModel = new JSONModel(Organization. value);
            this.getView().setModel(OrganizationModel, "OrganizationModel");
	
        },

		
	
		onCustomer: function () {
			this.getOwnerComponent().getRouter().navTo("Customer");
		},
		onDetailCustomer: function () {
			this.getOwnerComponent().getRouter().navTo("customer_detail");
		},
		onCreateCustomer: function () {
<<<<<<< HEAD

			this.getOwnerComponent().getRouter().navTo("customer_create");
		},
		onCustomer_chart: function() {
			this.getOwnerComponent().getRouter().navTo("Customer_chart");
		},

		onTest: function (oEvent) {
            var x=oEvent.getSource().oBindingContexts.CustomerModel.sPath;
            console.log(oEvent.getSource().oBindingContexts.CustomerModel.sPath);
            console.log(this.getView().getModel("CustomerModel").getProperty(x).bp_number);
            var bp_number=this.getView().getModel("CustomerModel").getProperty(x).bp_number;
            this.getOwnerComponent().getRouter().navTo("DetailCustomer", {num : bp_number});

        },

		onTest2: function (oEvent) {
            var x=oEvent.getSource().oBindingContexts.OrganizationModel.sPath;
            console.log(oEvent.getSource().oBindingContexts.OrganizationModel.sPath);
            console.log(this.getView().getModel("OrganizationModel").getProperty(x).bp_number);
            var bp_number=this.getView().getModel("OrganizationModel").getProperty(x).bp_number;
            this.getOwnerComponent().getRouter().navTo("DetailCustomer", {num : bp_number});

        }


=======
			this.getOwnerComponent().getRouter().navTo("customer_create");
		}
>>>>>>> 9d7895597f7af6beae2ef150ba2b1bfec3bf6eeb
	});
});