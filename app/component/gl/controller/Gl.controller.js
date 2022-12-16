sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/library",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter"
], function(
	Controller,
	JSONModel,
	Spreadsheet,
	library,
	FilterOperator,
	Filter
) {
	"use strict";

	return Controller.extend("project3.controller.Gl", {
		onInit: function() {
		this.getOwnerComponent().getRouter().getRoute("Gl").attachPatternMatched(this.onMyRoutePatternMatched, this);
		this.getOwnerComponent().getRouter().getRoute("DetailGl").attachPatternMatched(this.onMyRoutePatternMatched, this);
		},

		onMyRoutePatternMatched: async function() {
			const GL = await $.ajax({
				type: "GET",
				url: "/gl/Gl"
			});
			let GLModel = new JSONModel(GL.value);
			this.getView().setModel(GLModel, "GLModel");

			this.onClear();
		},

		goHack:function () {
			this.getOwnerComponent().getRouter().navTo("gl_home")
		},

		onSearch:function(e) {
			let CoA = this.byId("CoA").getValue();
			let gl_account = this.byId("gl_account").getValue();			
			let gl_account_type = this.byId("gl_account_type").getValue();
			let accont_group = this.byId("accont_group").getValue();
			let gl_comcode = this.byId("gl_comcode").getValue();

			var aFilter = [];

			if (CoA) {aFilter.push(new Filter("CoA", FilterOperator.Contains, CoA))}
			if (gl_account) {aFilter.push(new Filter("gl_account", FilterOperator.Contains, gl_account))}
			if (gl_account_type) {aFilter.push(new Filter("gl_account_type", FilterOperator.Contains, gl_account_type))}
			if (accont_group) {aFilter.push(new Filter("accont_group", FilterOperator.Contains, accont_group))}
			if (gl_comcode) {aFilter.push(new Filter("gl_comcode", FilterOperator.Contains, gl_comcode))}
			
			let oTable = this.getView().byId("GLTable").getBinding("rows");
			oTable.filter(aFilter);
		},

		onClear:function() {
			this.byId("CoA").setValue("");
			this.byId("gl_account").setValue("");
			this.byId("gl_account_type").setValue("");
			this.byId("accont_group").setValue("");
			this.byId("gl_comcode").setValue("");

			this.onSearch();
		},


		onSort:function() {
			if (!this.byId("GlSorting")) {
				Fragment.load({
					id: this.getView().getId(),
					name: "project3.view.fragment.GlSorting",
					controller: this
				}).then(function (oDialog) {
					this.getView().addDependent(oDialog);
					oDialog.open();
				}.bind(this)); 
			}else {
				this.byId("GlSorting").open();
			}
		},

		onConfirmSort:function(oEvent) {
			let mParams = oEvent.getParameters();
			let sPath = mParams.sortItem.getKey();
			let bDescending = mParams.sortDescending;
			let aSorters = [];

			aSorters.push(new Sorter(sPath, bDescending));

			let oBinding = this.byId("GLTable").getBinding("rows");

			oBinding.sort(aSorters);
		},

		onDeleteGL: async function() {
			var totalNumber = this.getView().getModel("GLModel").oData.length;
			console.log(totalNumber);
			let model = this.getView().getModel("GLModel");
			let i;
			console.log(model);
			for (i = 0; i < totalNumber; i++) {
				let chk = '/'	+ i + '/CHK'
				let key = '/' + i + '/gl_external_id';
				if (model.getProperty(chk) === true) {
					let gl_external_id = model.getProperty(key);
					let url = "/gl/Gl/" + gl_external_id;
					await $.ajax({
						type: "DELETE",
						url: url
					});
				}
			}
			this.onMyRoutePatternMatched();
		},

		onExcel: function () {
			let aCols, oRow
		},

		onNavToDetail: function(oEvent) {
			var SelectedNum = oEvent.getParameters().row.mAggregations.cells[1].mProperties.text;
			console.log(SelectedNum);
			this.getOwnerComponent().getRouter().navTo("DetailGl",{num:SelectedNum});

		},

		onCreateGl: function() {
			this.getOwnerComponent().getRouter().navTo("CreateGl");
		}
	});
});