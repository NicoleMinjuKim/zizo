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
	var oView, oCreateGl, oBasicInfomation;

	return Controller.extend("project3.controller.CreateGl", {

		onInit: function (){
			// this - controller 
			this._initModel();
			const myRoute = this.getOwnerComponent().getRouter().getRoute("CreateGl");
			myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);

		},

		/**
		 * 해당 페이지 관련된 모델을 초기화 및 생성한다.
		 */
		_initModel: function() {
			this.getView()
				.setModel(
					new JSONModel({
						gl_external_id: '',
						CoA: '',
						gl_account_type: '',
						accont_group: '',
						pl_account_type: '',
						functional_area: '',
						history: '',
						description: '',
						gl_affliation_num: '',
						account_group_num: ''
					}),
					'CreateGl'
				)
		},

		onMyRoutePatternMatched: async function () {
			this.onReset();

		},

		onBack: function () {
			this.getOwnerComponent().getRouter().navTo("Gl");

		},

		onCreate: async function () {
			oView = this.getView(),
			oCreateGl = oView.getModel('CreateGl'),
			oBasicInfomation = oCreateGl.getProperty('/');
			
			console.log(oBasicInfomation);

			if(!oBasicInfomation.gl_external_id){
				return MessageBox.error('G/L 계정을 입력하세요!');
			} else if(!oBasicInfomation.CoA) {
				return MessageBox.error('계정과목표를 입력하세요!');
			} else if(!oBasicInfomation.gl_account_type) {
				return MessageBox.error('G/L 계정 유형을 입력하세요!');
			} else if(!oBasicInfomation.accont_group) {
				return MessageBox.error('계정 그룹을 입력하세요!');
			} else if(!oBasicInfomation.history) {
				return MessageBox.error('내역을 입력하세요!');
			} else {
				this.onPost();
				this.onBack();
				this.onReset();
			}		
		},

		onPost: async function () {
			// const oBasicInfomation = this.getView().getModel('CreateGl').getProperty('/');

			await $.ajax ({
				type: "POST",
				url: "/gl/Gl",
				contentType:"application/json;IEEE754Compatible=true",
                data:JSON.stringify(oBasicInfomation)
			});
		},

		onReset: function () {
			let oModel = this.getView().getModel('CreateGl');
			oModel.setProperty('/CoA', '');
			oModel.setProperty('/gl_account_type', '');
			oModel.setProperty('/accont_group', '');
			oModel.setProperty('/pl_account_type', '');
			oModel.setProperty('/functional_area', '');
			oModel.setProperty('/history', '');
			oModel.setProperty('/description', '');
			oModel.setProperty('/gl_affliation_num', '');
			oModel.setProperty('/account_group_num', '');
		}
	});
});