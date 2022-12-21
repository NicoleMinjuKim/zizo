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

	var oData= {
		america: 0,
		americanum: '',
		russia: 0,
		russianum: '',
		germany: 0,
		germanynum: '',
		canada: 0,
		canadanum: '',
		italy: 0,
		italynum: ''
 }

 var oModel = new JSONModel(oData);
 this.getView().setModel(oModel, "country");
 this.onDataView();

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
		
		onCreateCustomer: function () {
			this.getOwnerComponent().getRouter().navTo("CreateCustomer");
		},

		onCreateOrganization : function () {
			this.getOwnerComponent().getRouter().navTo("CreateOrganization");
		},


		onCustomer_chart: function() {
			this.getOwnerComponent().getRouter().navTo("Customer_chart");
		},

		onTest: function (oEvent) {
            var x=oEvent.getSource().oBindingContexts.CustomerModel.sPath;
            console.log(oEvent.getSource().oBindingContexts.CustomerModel.sPath);
            console.log(this.getView().getModel("CustomerModel").getProperty(x).bp_number);
            var bp_number=this.getView().getModel("CustomerModel").getProperty(x).bp_number;
            this.getOwnerComponent().getRouter().navTo("customer_detail", {num : bp_number});

        },

		onTest2: function (oEvent) {
            var x=oEvent.getSource().oBindingContexts.OrganizationModel.sPath;
            console.log(oEvent.getSource().oBindingContexts.OrganizationModel.sPath);
            console.log(this.getView().getModel("OrganizationModel").getProperty(x).bp_number);
            var bp_number=this.getView().getModel("OrganizationModel").getProperty(x).bp_number;
            this.getOwnerComponent().getRouter().navTo("DetailOrganization", {num : bp_number});

        },


		onDataView: async function () {
			var view = this.getView()
			const Country = await $.ajax({
				type: "get",
			url: "/customer/Customer"
			})
			
			let CountryModel = new JSONModel(Country.value);
			view.setModel(CountryModel, "CountryModel");
			let data = view.getModel("CountryModel");
			let a = 0.00, b = 0.00,  c = 0.00, d = 0.00, e = 0.00 ;
			for (let i = 0; i < data.oData.length; i++) {
				let country = '/' + i + '/country'
				if (data.getProperty(country) === '미국') {
					a++;
				}
				if (data.getProperty(country) === '러시아') {
					b++;
				}
				if (data.getProperty(country) === '독일' ) {
					c++;
				}
				if (data.getProperty(country) === '캐나다' ) {
					d++;
				}
				if (data.getProperty(country) === '이탈리아' ) {
					e++;
				}

			}
	console.log(data);
	view.getModel("country").setProperty("/america", (a) );
    view.getModel("country").setProperty("/russia", (b) );
	view.getModel("country").setProperty("/germany", (c) );
	view.getModel("country").setProperty("/canada", (d) );
	view.getModel("country").setProperty("/italy", (e) );
    view.getModel("country").setProperty("/americanum", (a) );
	view.getModel("country").setProperty("/russianum", (b) );
	view.getModel("country").setProperty("/germanynum", (c) );		
	view.getModel("country").setProperty("/canadanum", (d) );
	view.getModel("country").setProperty("/italynum", (e) );
	console.log(view.getModel("country"));

	view.getModel("country").refresh("true");

	}
	});
})	
