sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	'sap/ui/comp/library',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text'
], function(
	Controller,
	JSONModel,
	MessageBox,
	compLibrary,
	TypeString,
	ColumnListItem,
	Label,
	SearchField,
	Token,
	Filter, 
	FilterOperator, 
	ODataModel, 
	UIColumn, 
	MColumn, 
	Text
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
						gl_account: '',
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

			const SearchGlAccount = await $.ajax ({
				type: "get",
				url: "/gl/Gl"
			});
			let SearchGlAccountModel = new JSONModel (SearchGlAccount.value);
			this.getView().setModel(SearchGlAccountModel,"SearchGlAccountModel");

		},

		onBack: function () {
			this.getOwnerComponent().getRouter().navTo("Gl");

		},

		onCreate: async function () {
			
			oView = this.getView();
			oCreateGl = oView.getModel('CreateGl');
			// if (this.byId("gl_account").getTokens()) {
			// 	let selectedtoken = this.byId("gl_account").getTokens()[0].mProperties.key;
			// }
			let selectedtoken = this.byId("gl_account").getTokens()[0]?.mProperties?.key;
			if(this.byId("gl_account").getTokens().length > 1) {
				return MessageBox.error("G/L 계정은 하나 이상 입력할 수 없습니다.")
			}
			// let selectedtoken = this.byId("gl_account").getTokens();
			// let selectedtoken = this.byId("gl_account");
			console.log(selectedtoken);

			oCreateGl.setProperty('/gl_account',selectedtoken);
			console.log(oCreateGl);
			oBasicInfomation = oCreateGl.getProperty('/');
			console.log(oBasicInfomation);

			let oGl = oView.getModel('SearchGlAccountModel');
			console.log(oGl);
			console.log(oGl.oData.length);
			console.log(oGl.oData[0].gl_external_id);

			// let oList = [];
			// for (let i=0 ; i < oGl.oData.length; i++) {
			// 	if(
			// 		this.byId('gl_external_id').getValue() === oGl.oData[i].gl_external_id
			// 	){ 
			// 		MessageBox.error('G/L 계정 외부 ID가 중복되었습니다!');
			// 	}
			// }

			// console.log(oList);	
			// console.log(oList.length);	
			// console.log(oList[0]);	
			// some 이라는 메소드는 array 내장메소드이며, 반복문입니다.
			// some 의 역할은 반복문중에서도 만약에 결과가 true값을 리턴하게되면
			// 멈춤니다.

			// 10번돌아야하는데 3번째에 true다 그럼 7번을 안돌아도되겠죠.
			// array.some(function(value, index, array) {
			//    return true; 이때 멈춤.
			// })

			var bCheckId = oGl.oData.some(function(gl) {
				if(
					// this.byId('gl_external_id').getValue() === gl.gl_external_id
					oBasicInfomation.gl_external_id === gl.gl_external_id
				) {
					return true;
				}
			}, this)

			if(bCheckId) {
				return MessageBox.error('G/L 계정 외부 ID가 중복되었습니다!');
			}
			
			// if (oBasicInfomation.gl_external_id) {
			// 	for(let j=0; j<oList.length; j++){
			// 		if (oBasicInfomation.gl_external_id === oList [j]) {
			// 			return MessageBox.error('G/L 계정 외부 ID가 중복되었습니다!');
			// 		}
			// 	}
				
			// }

			if(!oBasicInfomation.gl_external_id){
				return MessageBox.error('G/L 계정 외부 ID를 입력하세요!');
			} else if(!selectedtoken) {
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
			oModel.setProperty('/gl_external_id', '');
			oModel.setProperty('/gl_account', '');
			oModel.setProperty('/CoA', '');
			oModel.setProperty('/gl_account_type', '');
			oModel.setProperty('/accont_group', '');
			oModel.setProperty('/pl_account_type', '');
			oModel.setProperty('/functional_area', '');
			oModel.setProperty('/history', '');
			oModel.setProperty('/description', '');
			oModel.setProperty('/gl_affliation_num', '');
			oModel.setProperty('/account_group_num', '');

			this.byId('gl_account').setTokens([]);
		},

		onSearchGlAccount: function (){
			/**
			 * o - object
			 * a - array
			 * s - string
			 * i - number
			 * v - variable
			 * p - popup
			 * b - boolean
			 */
			var oTextTemplate = new Text({text: '{SearchGlAccountModel>gl_account}', renderWhitespace: true});
			var oTextTemplate2 = new Text({text: '{SearchGlAccountModel>CoA}', renderWhitespace: true});
			var oTextTemplate3 = new Text({text: '{SearchGlAccountModel>description}', renderWhitespace: true});
			this._oBasicSearchField = new SearchField({
				search: function() {
					this.oSearchGlDialog.getFilterBar().search();
				}.bind(this)
			});
			if (!this.pSearchGlDialog) {
				this.pSearchGlDialog = this.loadFragment({
					name: "project3.view.fragment.SearchGlAccount"
				});
			}
			this.pSearchGlDialog.then(function(oSearchGlDialog) {
				var oFilterBar = oSearchGlDialog.getFilterBar();
				this.oSearchGlDialog = oSearchGlDialog;
				if (this._bWhitespaceDialogInitialized) {
					// Re-set the tokens from the input and update the table
					oSearchGlDialog.setTokens([]);
					oSearchGlDialog.setTokens(this.byId("gl_account").getTokens());
					oSearchGlDialog.update();

					oSearchGlDialog.open();
					return;
				}
				this.getView().addDependent(oSearchGlDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oSearchGlDialog.setRangeKeyFields([{
					label: "G/L 계정",
					key: "gl_account"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Re-map whitespaces
				// oFilterBar.determineFilterItemByName("ProductCode").getControl().setTextFormatter(this._inputTextFormatter);

				oSearchGlDialog.getTableAsync().then(function (oTable) {
					// oTable.setModel(this.oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({label: "G/L 계정", template: oTextTemplate}));
						oTable.addColumn(new UIColumn({label: "계정과목표", template: oTextTemplate2}));
						oTable.addColumn(new UIColumn({label: "설명", template: oTextTemplate3}));
						oTable.bindAggregation("rows", {
							path: "SearchGlAccountModel>/",
							events: {
								dataReceived: function() {
									oSearchGlDialog.update();
								}
							}
						});
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						oTable.addColumn(new MColumn({header: new Label({text: "G/L 계정"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "계정과목표"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "설명"})}));
						oTable.bindItems({
							path: "SearchGlAccountModel>/",
							template: new ColumnListItem({
								cells: [new Label({text: "{SearchGlAccountModel>gl_account}"}), new Label({text: "{SearchGlAccountModel>CoA}"}), new Label({text: "{SearchGlAccountModel>description}"})]
							}),
							events: {
								dataReceived: function() {
									oSearchGlDialog.update();
								}
							}
						});
					}

					oSearchGlDialog.update();
				}.bind(this));

				oSearchGlDialog.setTokens(this.byId("gl_account").getTokens());
				this._bWhitespaceDialogInitialized = true;
				oSearchGlDialog.open();
			}.bind(this));
		},
		onGlAccountOk: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this.byId("gl_account").setTokens(aTokens);
			this.oSearchGlDialog.close();
		},

		onGlAccountCancel: function () {
			this.oSearchGlDialog.close();
		},

		onFilterBarSearch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");

			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			// new Filter('필드', '조건', '값');
			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "gl_account", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "CoA", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "description", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
		_filterTable: function (oFilter) {
			var oVHD = this.oSearchGlDialog;

			oVHD.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}

				// This method must be called after binding update of the table.
				oVHD.update();
			});
		}
	});
});