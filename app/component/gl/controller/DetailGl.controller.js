sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(
	Controller,
	JSONModel,
	MessageBox
) {
	"use strict";

	let SelectedNum;
	let Expandflag=false;
	return Controller.extend("project3.controller.DetailGl", {
		onInit: async function () {
			const oView = this.getView();
			let visible = {edit: false};
			let editModel = new JSONModel(visible);
			oView.setModel(editModel,'editModel');

			
			let layout = {layout: false};
			let layoutModel = new JSONModel(layout);
			oView.setModel(layoutModel, 'layoutModel');	
			
			oView.setModel(new JSONModel({}), 'historyModel');

			
			this.getOwnerComponent().getRouter().getRoute("DetailGl").attachPatternMatched(this.onMyRoutePatternMatched, this);				
			this.getOwnerComponent().getRouter().getRoute("DetailGlexpand").attachPatternMatched(this.onMyRoutePatternMatched2, this);				
		},

		onMyRoutePatternMatched: async function(oEvent){
			if(Expandflag==true){
				Expandflag=false;
				this.getView().getModel('layoutModel').setProperty("/layout", false);
				return;
			}
			this.getView().getModel('editModel').setProperty("/edit", false);
			SelectedNum=oEvent.getParameter("arguments").num;
			let url="/gl/Gl/"+ SelectedNum;
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
			let url2="/companycode/Companycode/"+SelectedComCode;
			const Companycode = await $.ajax ({
				type: "get",
				url: url2
			});

			/* 배열에 담아줘야 함 */
			let company =[];
			company.push(Companycode);
			this.getView().setModel(new JSONModel(company), 'DetailCompanycode');

			this.getView().getModel('layoutModel').setProperty("/layout", false);

			/* 회사코드 테이블의 데이터를 세어줌 */
			let num = this.getView().getModel('DetailCompanycode').oData.length;
			let number = {tablenumber:num};
			let tablenumber = new JSONModel(number);
			this.getView().setModel(tablenumber,"tablenumber");
		},
		
		onMyRoutePatternMatched2: async function(oEvent){
			if(Expandflag==true){
				Expandflag=false;
				this.getView().getModel('layoutModel').setProperty("/layout", true);
				return;
			}
			this.getView().getModel('editModel').setProperty("/edit", false);
			SelectedNum=oEvent.getParameter("arguments").num;
			let url="/gl/Gl/"+ SelectedNum;
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
			let url2="/companycode/Companycode/"+SelectedComCode;
			const Companycode = await $.ajax ({
				type: "get",
				url: url2
			});
			let company =[];
			company.push(Companycode);
			this.getView().setModel(new JSONModel(company), 'DetailCompanycode');
			
			this.getView().getModel('layoutModel').setProperty("/layout", true);

			let num = this.getView().getModel('DetailCompanycode').oData.length;
			let number = {tablenumber:num};
			let tablenumber = new JSONModel(number);
			this.getView().setModel(tablenumber,"tablenumber");
		},

		onBack: function () {
			Expandflag=false;
			this.getOwnerComponent().getRouter().navTo("Gl");
		},

		onEdit: function(){
			const oView = this.getView(),
                  oDetailGl = oView.getModel('DetailGl'),
                  oHistoryModel = oView.getModel('historyModel');

			oHistoryModel.setProperty('/', $.extend({}, oDetailGl.getData(), true));

			this.getView().getModel('editModel').setProperty("/edit", true);
		},

		onConfirm: async function () {
			if (!this.byId("DetailAccountTypeInput").getValue()) {
				return MessageBox.error('G/L 계정 유형을 입력하세요!');
			} else if (!this.byId("DetailAccountGroupInput").getValue()) {
				return MessageBox.error('계정 그룹을 입력하세요!');
			} else if (!this.byId("DetailHistoryInput").getValue()) {
				return MessageBox.error('내역을 입력하세요!');
			} else {
				let temp = {
					gl_external_id: String(this.byId("GlNumber").getText()),
					gl_account_type: String(this.byId("DetailAccountTypeInput").getValue()),
					accont_group: String(this.byId("DetailAccountGroupInput").getValue()),
					history: String(this.byId("DetailHistoryInput").getValue()),
					description: String(this.byId("DetailDescriptionInput").getValue()),
					gl_affliation_num: String(this.byId("DetaiAffInput").getValue())
				};
	
				let url = "/gl/Gl/" + temp.gl_external_id;
				console.log(url);
				console.log(temp);
				await $.ajax ({
					type: "patch",
					url: url,
					contentType: "application/json;IEEE754Compatible=true",
					data: JSON.stringify(temp),
					success: function() {
						this.getView().getModel('editModel').setProperty("/edit",false);
					}.bind(this)	
				});

				
				await $.ajax({
					type: "GET",
					url: "/gl/Gl",
					success: function(GL) {
						this.getOwnerComponent().getModel("GLModel").setProperty("/", GL.value);
					}.bind(this)
				});

				
			}
			
		},

		onCancel: function () {
			const oView = this.getView(),
				oDetailGl = oView.getModel('DetailGl'),
				oHistoryModel = oView.getModel('historyModel');
            
			oDetailGl.setProperty('/', oHistoryModel.getData());

			oView.getModel('editModel').setProperty("/edit",false);
		},

		// onPrint: function (){
		// 	this.getOwnerComponent().getRouter().navTo("PrintPage");

		// },

		// onPrint: async function(){
		// 	this.getView().getModel('editModel').setProperty("/edit",true);
		// 	this.getView().getModel('layoutModel').setProperty("/layout",true);
		
		// 	const oOptions = {
		// 		margin: [0.3,0,0.5,0],
		// 		filename:     'testing-pdf-print-nathan.pdf',
		// 		image:        { type: 'jpeg', quality: 0.98 },
		// 		html2canvas:  { scale: 2 },
		// 		jsPDF:        { unit: 'in', format: 'letter', orientation: 'l' },
		// 		pagebreak: { avoid: 'tr' }
		// 	};
		
		// 	var element1 = document.getElementById('ObjectPageLayout');
			
		// 	await html2pdf().set(oOptions).from(element1).save();
			
		// 	// const element1 = this.getView().byId("ObjectPageLayout").getDomRef();
		// 	// html2pdf(print);

		// 	this.getView().getModel('editModel').setProperty("/edit",false);
		
		// },

		onfull: function () {
			Expandflag=true;
			this.getOwnerComponent().getRouter().navTo("DetailGlexpand",{num:SelectedNum});
		},

		onexitfull: function () {
			Expandflag=true;
			this.getOwnerComponent().getRouter().navTo("DetailGl",{num:SelectedNum});
		}
	});
});