sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(
	Controller,
	JSONModel
) {
	"use strict";

	return Controller.extend("project3.controller.DetailGl", {
		onInit: async function () {
			this.getOwnerComponent().getRouter().getRoute("DetailGl").attachPatternMatched(this.onMyRoutePatternMatched, this);				
		},

		onMyRoutePatternMatched: async function(oEvent){
			// let SelectedNum=oEvent.getParameter("arguments").num;
			// console.log(Gl);

			let num = '100008';
			let url="/gl/Gl/"+ num;
			// console.log(url);
			const Gl = await $.ajax ({
				type: "get",
				url: url
			});

			this.getView()
				.setModel(
					new JSONModel(Gl),
					'DetailGl'
				);

			let SelectedComCode = this.getView().getModel('DetailGl').oData.gl_comcode;
			// console.log(SelectedComCode);
			let url2="/companycode/Companycode/"+SelectedComCode;
			// console.log(url2);
			const Companycode = await $.ajax ({
				type: "get",
				url: url2
			});
			let company =[];
			company.push(Companycode);
			this.getView().setModel(new JSONModel(company), 'DetailCompanycode');
			// console.log(this.getView().getModel('DetailCompanycode'));

			let visible = {edit: false};
			let editModel = new JSONModel(visible);
			this.getView().setModel(editModel,'editModel');
			// console.log(this.getView().getModel('editModel'));

		},

		onBack: function () {
			this.getOwnerComponent().getRouter().navTo("Gl");

		},

		onEdit: function(){
			this.getView().getModel('editModel').setProperty("/edit", true);

		},

		onConfirm: async function () {
			let temp = {
				gl_external_id: String(this.byId("GlNumber").getText()),
				gl_account_type: String(this.byId("DetailAccountTypeInput").getValue()),
				accont_group: String(this.byId("DetailAccountGroupInput").getValue()),
				history: String(this.byId("DetailHistoryInput").getValue()),
				description: String(this.byId("DetailDescriptionInput").getValue()),
				gl_affliation_num: String(this.byId("DetaiAffInput").getValue())
			};
			console.log(temp);

			let url = "/gl/Gl/" + temp.gl_external_id;
			console.log(url);
			console.log(temp);
			await $.ajax ({
				type: "patch",
				url: url,
				contentType: "application/json;IEEE754Compatible=true",
                data: JSON.stringify(temp)				
			});

			this.onBack();

		},

		onCancel: function () {
			this.getView().getModel('editModel').setProperty("/edit",false);
		},

		onPrint: async function(){
			this.getView().getModel('editModel').setProperty("/edit",true);
		
			const oOptions = {
				margin: [0.3,0,0.5,0],
				filename:     'testing-pdf-print-nathan.pdf',
				image:        { type: 'jpeg', quality: 0.98 },
				html2canvas:  { scale: 2 },
				jsPDF:        { unit: 'in', format: 'letter', orientation: 'l' },
				pagebreak: { avoid: 'tr' }
			};
		
			var element1 = document.getElementById('ObjectPageLayout');
			
			await html2pdf().set(oOptions).from(element1).save();
			
			// const element1 = this.getView().byId("ObjectPageLayout").getDomRef();
			// html2pdf(print);

			this.getView().getModel('editModel').setProperty("/edit",false);
		
		}
	});
});