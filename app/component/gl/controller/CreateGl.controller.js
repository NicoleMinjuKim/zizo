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
	'sap/m/Text',
	"sap/ui/core/routing/History"
], function (
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
	Text,
	History
) {
	"use strict";
	var oView, oCreateGl, oBasicInfomation;

	return Controller.extend("project3.controller.CreateGl", {

		onInit: function () {
			// this - controller 
			this._initModel();
			this.oCoAInput = this.byId("CoA");
			this.oAGInput = this.byId("accont_group");
			const myRoute = this.getOwnerComponent().getRouter().getRoute("CreateGl");
			myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
		},

		/**
		 * 해당 페이지 관련된 모델을 초기화 및 생성한다.
		 */
		_initModel: function () {
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
						account_group_num: '',
						gl_comcode: '',
						create_date: ''
					}),
					'CreateGl'
				)
		},

		onMyRoutePatternMatched: async function () {
			this.onReset(); // input과 multiinput의 value와 token을 null로 되돌려 줌

			/* G/L 계정 검색 fragment를 위한 모델 생성 */
			const SearchGlAccount = await $.ajax({
				type: "get",
				url: "/gl/Gl"
			});
			let SearchGlAccountModel = new JSONModel(SearchGlAccount.value);
			this.getView().setModel(SearchGlAccountModel, "SearchGlAccountModel");

			/* 회사코드 검색 fragment를 위한 모델 생성 */
			const ComCode = await $.ajax({
				type: "get",
				url: "/companycode/Companycode"
			});
			let ComCodeModel = new JSONModel(ComCode.value);
			this.getView().setModel(ComCodeModel, "ComCodeModel");

			/* 회사코드를 생성하기 위해서 빈 모델 생성 */
			this.getView().setModel(new JSONModel([]), 'CreateComCodeModel');

			/* 회사코드 데이터 테이블 숫자 지정 */
			let num = this.getView().getModel('CreateComCodeModel').oData.length;
			let number = {
				tablenumber: num
			};
			let tablenumber = new JSONModel(number);
			this.getView().setModel(tablenumber, "tablenumber");

			/* 생성일자 자동 세팅 */
			let oDay = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
			this.getView().getModel('CreateGl').setProperty('/create_date', oDay);

			/* 계정과목표와 계정그룹 fragment을 위한 모델 생성 */
			const GL = await $.ajax({
				type: "GET",
				url: "/gl/Gl"
			});
			let GLModel = new JSONModel(GL.value);
			this.getView().setModel(GLModel, "GLModel");

		},

		onBack: function () {

			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			}
			// console.log(oEvent.getParameter());
			// console.log(oEvent.getSource());
			// console.log(History.getInstance().getPreviousHash().split('/').slice(2).toString());

			var x = History.getInstance().getPreviousHash().split('/').slice(2).toString();
			if (x === "Customer_chart") {
				sap.ui.controller("project1.controller.App").onSelected("cus_chart");
			} else if (x === "CreateCustomer") {
				sap.ui.controller("project1.controller.App").onSelected("cm_create");
			} else if (x === "Customer") {
				sap.ui.controller("project1.controller.App").onSelected("cm_display");
			} else if (x === "CoA") {
				sap.ui.controller("project1.controller.App").onSelected("COA_view");
			} else if (x === "Gl") {
				sap.ui.controller("project1.controller.App").onSelected("gl_display");
			} else if (x === "CreateOrganization") {
				sap.ui.controller("project1.controller.App").onSelected("org_create");
			} else if (x === "Gl_chart") {
				sap.ui.controller("project1.controller.App").onSelected("glchart_view");
			} else if (x === "GlChartFixFlex") {
				sap.ui.controller("project1.controller.App").onSelected("revenue_chart");
			}

			// console.log(History.getInstance().getPreviousHash().split('/').slice(0).toString());
			var y = History.getInstance().getPreviousHash().split('/').slice(0).toString();
			if (y === "Customer") {
				sap.ui.controller("project1.controller.App").onSelected("CUST_home");
			} else if (y === "Gl") {
				sap.ui.controller("project1.controller.App").onSelected("GL_home");
			} else if (y === "team") {
				sap.ui.controller("project1.controller.App").onSelected("teampage_view");
			}

			// console.log(History.getInstance().getPreviousHash().toString());
			var z = History.getInstance().getPreviousHash();
			if (z === "") {
				sap.ui.controller("project1.controller.App").onSelected("mainhome_display");
			}

		},

		onCreate: async function () {
			oView = this.getView();
			oCreateGl = oView.getModel('CreateGl');

			let selectedtoken = this.byId("gl_account").getTokens()[0]?.mProperties?.key; // 값이 없다면 undefin
			let selectedCoA = this.byId("CoA").getTokens()[0]?.mProperties?.key;
			let selectedAccountGroup = this.byId("accont_group").getTokens()[0]?.mProperties?.key;
			if (this.byId("gl_account").getTokens().length > 1) {
				return MessageBox.error("G/L 계정은 하나 이상 입력할 수 없습니다.")
			}

			let selectedcomcode = this.getView().getModel('CreateComCodeModel').getProperty('/0/comcode');

			oCreateGl.setProperty('/gl_account', selectedtoken);
			oCreateGl.setProperty('/CoA', selectedCoA);
			oCreateGl.setProperty('/accont_group', selectedAccountGroup);
			oCreateGl.setProperty('/gl_comcode', selectedcomcode);
			oBasicInfomation = oCreateGl.getProperty('/');

			let oGl = oView.getModel('SearchGlAccountModel');
			console.log(oGl);
			console.log(oGl.oData.length);
			console.log(oGl.oData[0].gl_external_id);
			// some 이라는 메소드는 array 내장메소드이며, 반복문입니다.
			// some 의 역할은 반복문중에서도 만약에 결과가 true값을 리턴하게되면
			// 멈춤니다.

			// 10번돌아야하는데 3번째에 true다 그럼 7번을 안돌아도되겠죠.
			// array.some(function(value, index, array) {
			//    return true; 이때 멈춤.
			// })
			var bCheckId = oGl.oData.some(function (gl) {
				if (
					// this.byId('gl_external_id').getValue() === gl.gl_external_id
					oBasicInfomation.gl_external_id === gl.gl_external_id
				) {
					return true;
				}
			}, this)

			if (bCheckId) {
				return MessageBox.error('G/L 계정 외부 ID가 중복되었습니다!');
			}

			if (!oBasicInfomation.gl_external_id) {
				return MessageBox.error('G/L 계정 외부 ID를 입력하세요!');
			} else if (!selectedtoken) {
				return MessageBox.error('G/L 계정을 입력하세요!');
			} else if (!oBasicInfomation.CoA) {
				return MessageBox.error('계정과목표를 입력하세요!');
			} else if (!oBasicInfomation.gl_account_type) {
				return MessageBox.error('G/L 계정 유형을 입력하세요!');
			} else if (!oBasicInfomation.accont_group) {
				return MessageBox.error('계정 그룹을 입력하세요!');
			} else if (!oBasicInfomation.history) {
				return MessageBox.error('내역을 입력하세요!');
			} else {
				this.onPost();
				sap.ui.controller("project1.controller.App").onSelected("gl_display");

				this.onBack();
				this.onReset();
			}
		},

		onPost: async function () {
			await $.ajax({
				type: "POST",
				url: "/gl/Gl",
				contentType: "application/json;IEEE754Compatible=true",
				data: JSON.stringify(oBasicInfomation)
			});
		},

		onCancel: function () {
			this.onReset();
			this.onClearComCode();
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

			this.byId('gl_account').destroyTokens("");
			this.byId('CoA').destroyTokens("");
			this.byId('accont_group').destroyTokens("");
		},

		onClearComCode: function () {
			let oCreateComCodeModel = this.getView().getModel("CreateComCodeModel");
			oCreateComCodeModel.setProperty('/0/comcode', '');
			oCreateComCodeModel.setProperty('/0/COarea', '');
			oCreateComCodeModel.setProperty('/0/comname', '');
			oCreateComCodeModel.setProperty('/0/currency', '');
			oCreateComCodeModel.setProperty('/0/CoA', '');
		},

		onSearchGlAccount: function () {
			var oTextTemplate = new Text({
				text: '{SearchGlAccountModel>gl_account}',
				renderWhitespace: true
			});
			var oTextTemplate2 = new Text({
				text: '{SearchGlAccountModel>CoA}',
				renderWhitespace: true
			});
			var oTextTemplate3 = new Text({
				text: '{SearchGlAccountModel>description}',
				renderWhitespace: true
			});
			this._oBasicSearchField = new SearchField({
				search: function () {
					this.oSearchGlDialog.getFilterBar().search();
				}.bind(this)
			});
			if (!this.pSearchGlDialog) {
				this.pSearchGlDialog = this.loadFragment({
					name: "project3.view.fragment.SearchGlAccount"
				});
			}
			this.pSearchGlDialog.then(function (oSearchGlDialog) {
				var oFilterBar = oSearchGlDialog.getFilterBar();
				this.oSearchGlDialog = oSearchGlDialog;
				if (this._bSearchDialogInitialized) {
					// Re-set the tokens from the input and update the table
					oSearchGlDialog.setTokens([]);
					// oSearchGlDialog.setTokens(this.byId("gl_account").getTokens());
					oSearchGlDialog.update();

					oSearchGlDialog.open();

					oFilterBar.setFilterBarExpanded(false);
					oFilterBar.setBasicSearch(this._oBasicSearchField);

					oSearchGlDialog.getTableAsync().then(function (oTable) {

						if (oTable.bindRows) {
							oTable.bindAggregation("rows", {
								path: "SearchGlAccountModel>/",
								events: {
									dataReceived: function () {
										oSearchGlDialog.update();
									}
								}
							});
						}

						oSearchGlDialog.update();
					}.bind(this));
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
						oTable.setSelectionMode('Single');
						oTable.addColumn(new UIColumn({
							label: "G/L 계정",
							template: oTextTemplate
						}));
						oTable.addColumn(new UIColumn({
							label: "계정과목표",
							template: oTextTemplate2
						}));
						oTable.addColumn(new UIColumn({
							label: "설명",
							template: oTextTemplate3
						}));
						oTable.bindAggregation("rows", {
							path: "SearchGlAccountModel>/",
							events: {
								dataReceived: function () {
									oSearchGlDialog.update();
								}
							}
						});
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						oTable.addColumn(new MColumn({
							header: new Label({
								text: "G/L 계정"
							})
						}));
						oTable.addColumn(new MColumn({
							header: new Label({
								text: "계정과목표"
							})
						}));
						oTable.addColumn(new MColumn({
							header: new Label({
								text: "설명"
							})
						}));
						oTable.bindItems({
							path: "SearchGlAccountModel>/",
							template: new ColumnListItem({
								cells: [new Label({
										text: "{SearchGlAccountModel>gl_account}"
									}),
									new Label({
										text: "{SearchGlAccountModel>CoA}"
									}),
									new Label({
										text: "{SearchGlAccountModel>description}"
									})
								]
							}),
							events: {
								dataReceived: function () {
									oSearchGlDialog.update();
								}
							}
						});
					}

					oSearchGlDialog.update();
				}.bind(this));

				oSearchGlDialog.setTokens(this.byId("gl_account").getTokens());
				this._bSearchDialogInitialized = true;
				oSearchGlDialog.open();
			}.bind(this));
		},
		onGlAccountOk: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			aTokens.forEach(function (oToken) {
				oToken.setText(this.whitespace2Char(oToken.getText()));
			}.bind(this));

			for (let i = 0; i < aTokens.length; i++) {
				aTokens[i].mProperties.text = aTokens[i].mProperties.key
			}

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
					new Filter({
						path: "gl_account",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new Filter({
						path: "CoA",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new Filter({
						path: "description",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					})
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
		},

		onCreateCompanyCode: function () {
			var oTextTemplate = new Text({
				text: '{ComCodeModel>comcode}',
				renderWhitespace: true
			});
			var oTextTemplate2 = new Text({
				text: '{ComCodeModel>COarea}',
				renderWhitespace: true
			});
			var oTextTemplate3 = new Text({
				text: '{ComCodeModel>comname}',
				renderWhitespace: true
			});
			var oTextTemplate4 = new Text({
				text: '{ComCodeModel>currency}',
				renderWhitespace: true
			});
			var oTextTemplate5 = new Text({
				text: '{ComCodeModel>CoA}',
				renderWhitespace: true
			});
			this._oBasicSearchField2 = new SearchField({
				search: function () {
					this.oCreateComCodeDialog.getFilterBar().search();
				}.bind(this)
			});
			if (!this.pCreateComCodeDialog) {
				this.pCreateComCodeDialog = this.loadFragment({
					name: "project3.view.fragment.CreateComCode"
				});
			}
			this.pCreateComCodeDialog.then(function (oCreateComCodeDialog) {
				var oFilterBar = oCreateComCodeDialog.getFilterBar();
				this.oCreateComCodeDialog = oCreateComCodeDialog;
				if (this._bWhitespaceDialogInitialized) {
					// Re-set the tokens from the input and update the table
					oCreateComCodeDialog.setTokens([]);
					// oCreateComCodeDialog.setTokens(this.byId("gl_account").getTokens());
					oCreateComCodeDialog.update();

					oCreateComCodeDialog.open();

					oFilterBar.setFilterBarExpanded(false);
					oFilterBar.setBasicSearch(this._oBasicSearchField2);
					oCreateComCodeDialog.getTableAsync().then(function (oTable) {
						if (oTable.bindRows) {
							oTable.bindAggregation("rows", {
								path: "ComCodeModel>/",
								events: {
									dataReceived: function () {
										oCreateComCodeDialog.update();
									}
								}
							});
						}
						oCreateComCodeDialog.update();
					}.bind(this));
					oCreateComCodeDialog.open();
					return;
				}
				this.getView().addDependent(oCreateComCodeDialog);

				// Set key fields for filtering in the Define Conditions Tab
				// oCreateComCodeDialog.setRangeKeyFields([{
				// 	label: "회사코드",
				// 	key: "comcode"
				// }]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField2);

				// Re-map whitespaces
				// oFilterBar.determineFilterItemByName("comcode").getControl().setTextFormatter(this._inputTextFormatter);

				oCreateComCodeDialog.getTableAsync().then(function (oTable) {
					// oTable.setModel(this.oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.setSelectionMode('Single');
						oTable.addColumn(new UIColumn({
							label: "회사코드",
							template: oTextTemplate
						}));
						oTable.addColumn(new UIColumn({
							label: "관리회계영역",
							template: oTextTemplate2
						}));
						oTable.addColumn(new UIColumn({
							label: "회사 이름",
							template: oTextTemplate3
						}));
						oTable.addColumn(new UIColumn({
							label: "계정 통화",
							template: oTextTemplate4
						}));
						oTable.addColumn(new UIColumn({
							label: "계정과목표",
							template: oTextTemplate5
						}));
						oTable.bindAggregation("rows", {
							path: "ComCodeModel>/",
							events: {
								dataReceived: function () {
									oCreateComCodeDialog.update();
								}
							}
						});
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						oTable.addColumn(new MColumn({
							header: new Label({
								text: "회사코드"
							})
						}));
						oTable.addColumn(new MColumn({
							header: new Label({
								text: "관리회계영역"
							})
						}));
						oTable.addColumn(new MColumn({
							header: new Label({
								text: "회사 이름"
							})
						}));
						oTable.addColumn(new MColumn({
							header: new Label({
								text: "계정 통화"
							})
						}));
						oTable.addColumn(new MColumn({
							header: new Label({
								text: "계정과목표"
							})
						}));
						oTable.bindItems({
							path: "ComCodeModel>/",
							template: new ColumnListItem({
								cells: [new Label({
										text: "{ComCodeModel>comcode}"
									}),
									new Label({
										text: "{ComCodeModel>COarea}"
									}),
									new Label({
										text: "{ComCodeModel>comname}"
									}),
									new Label({
										text: "{ComCodeModel>currency}"
									}),
									new Label({
										text: "{ComCodeModel>CoA}"
									})
								]
							}),
							events: {
								dataReceived: function () {
									oCreateComCodeDialog.update();
								}
							}
						});
					}

					oCreateComCodeDialog.update();
				}.bind(this));

				// oCreateComCodeDialog.setTokens(this.byId("gl_account").getTokens());
				this._bWhitespaceDialogInitialized = true;
				oCreateComCodeDialog.open();
			}.bind(this));
		},

		onComCodeOk: async function (oEvent) {

			var aTokens = oEvent.getParameter("tokens");
			var SelectedComCode = aTokens[0].mProperties.key;

			const SelectedComCodeData = await $.ajax({
				type: "get",
				url: "/companycode/Companycode/" + SelectedComCode
			});

			var SelectedComCodeModel = new JSONModel(SelectedComCodeData);
			this.getView().setModel(SelectedComCodeModel, "SelectedComCodeModel");

			const oView = this.getView(),
				oCreateComCodeModel = oView.getModel('CreateComCodeModel'),
				oSelectedComCodeModel = oView.getModel('SelectedComCodeModel');

			oCreateComCodeModel.setProperty('/', [oSelectedComCodeModel.getData()]);
			console.log(oCreateComCodeModel.getData());

			this.getView().getModel("tablenumber").setProperty('/tablenumber', oCreateComCodeModel.oData.length)
			this.oCreateComCodeDialog.close();
		},

		onComCodeCancel: function () {
			this.oCreateComCodeDialog.close();
		},

		onFilterBarSearch2: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField2.getValue(),
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
					new Filter({
						path: "comcode",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new Filter({
						path: "COarea",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new Filter({
						path: "comname",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new Filter({
						path: "currency",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new Filter({
						path: "CoA",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					})
				],
				and: false
			}));

			this._filterTable2(new Filter({
				filters: aFilters,
				and: true
			}));
		},

		_filterTable2: function (oFilter) {
			var oVHD = this.oCreateComCodeDialog;

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
		},

		onCoAfragment: function () {
			var that = this;

			var oCoATemplate = new Text({
				text: {
					path: 'GLModel>CoA'
				},
				renderWhitespace: true
			});
			var ohistoryTemplate = new Text({
				text: {
					path: 'GLModel>history'
				},
				renderWhitespace: true
			});

			if (!this.pCoADialog) {
				this.pCoADialog = this.loadFragment({
					name: "project3.view.fragment.CoA"
				});
			}
			this.pCoADialog.then(function (oCoADialog) {
				var oFilterBar = oCoADialog.getFilterBar();
				this.oCoADialog = oCoADialog;




				if (this._bCoADialogInitialized) {
					// Re-set the tokens from the input and update the table

					this._oBasicSearchField.setValue();
					oCoADialog.setTokens([]);
					oCoADialog.setTokens(this.oCoAInput.getTokens());
					oCoADialog.update();

					oFilterBar.setFilterBarExpanded(false);
					oFilterBar.setBasicSearch(this._oBasicSearchField);

					oCoADialog.getTableAsync().then(function (oTable) {
						oTable.setModel(this.oModel);


						// For Desktop and tabled the default table is sap.ui.table.Table
						if (oTable.bindRows) {

							oTable.bindAggregation("rows", {
								path: "GLModel>/",
								events: {
									dataReceived: function () {
										oCoADialog.update();
									}
								}
							});


						}


						oCoADialog.update();
					}.bind(this));

					oCoADialog.open();
					return;
				}




				this.getView().addDependent(oCoADialog);

				this._oBasicSearchField = new SearchField({
					search: function () {
						this.oCoADialog.getFilterBar().search();
					}.bind(this)
				});
				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Re-map whitespaces
				oFilterBar.determineFilterItemByName("CoA").getControl().setTextFormatter(this._inputTextFormatter);


				oCoADialog.getTableAsync().then(function (oTable) {
					oTable.setModel(this.oModel);


					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.setSelectionMode('Single');
						oTable.addColumn(new UIColumn({
							label: "CoA",
							template: oCoATemplate
						}));
						oTable.addColumn(new UIColumn({
							label: "history",
							template: ohistoryTemplate
						}));

						oTable.bindAggregation("rows", {
							path: "GLModel>/",
							events: {
								dataReceived: function () {
									oCoADialog.update();
								}
							}
						});
					}


					oCoADialog.update();
				}.bind(this));


				// oCoADialog.setTokens(this.oCoAInput.getTokens());
				this._bCoADialogInitialized = true;
				oCoADialog.open();
			}.bind(this));
		},


		onCoACancelPress: function () {
			this.oCoADialog.close();
		},

		onFilterBarCoASearch: function (oEvent) {
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

			aFilters.push(new Filter({
				filters: [
					new Filter({
						path: "CoA",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new Filter({
						path: "history",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					})
				],
				and: false
			}));

			this._filterTableCoA(new Filter({
				filters: aFilters,
				and: true
			}));
		},

		_filterTableCoA: function (oFilter) {
			var oValueHelpDialog = this.oCoADialog;
			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				oValueHelpDialog.update();
			});
		},


		//CoA 검색했을 때 함수
		onCoAOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			aTokens.forEach(function (oToken) {
				oToken.setText(this.whitespace2Char(oToken.getText()));
			}.bind(this));



			// let SelectedCoA = [];
			for (let i = 0; i < aTokens.length; i++) {
				aTokens[i].mProperties.text = aTokens[i].mProperties.key
				// .push(aTokens[i].mProperties.key);
			}

			this.byId("CoA").setTokens(aTokens);
			this.byId("accont_group").destroyTokens("");

			this.oCoADialog.close();

		},

		whitespace2Char: function (sOriginalText) {
			var sWhitespace = " ",
				sUnicodeWhitespaceCharacter = "\u00A0"; // Non-breaking whitespace

			if (typeof sOriginalText !== "string") {
				return sOriginalText;
			}

			return sOriginalText
				.replaceAll((sWhitespace + sWhitespace), (sWhitespace + sUnicodeWhitespaceCharacter)); // replace spaces
		},

		onAccountGroup: function () {
			var that = this;
			var oAccountGroupemplate = new Text({
				text: {
					path: 'GLModel>accont_group'
				},
				renderWhitespace: false
			});
			var oMeaningTemplate = new Text({
				text: {
					path: 'GLModel>meaning'
				},
				renderWhitespace: false
			});
			var oPLTemplate = new Text({
				text: {
					path: 'GLModel>pl_account_type'
				},
				renderWhitespace: false
			});

			if (!this.pAGDialog) {
				this.pAGDialog = this.loadFragment({
					name: "project3.view.fragment.AccountGroup"
				});
			}
			this.pAGDialog.then(function (oAGDialog) {
				var oFilterBar = oAGDialog.getFilterBar();
				this.oAGDialog = oAGDialog;





				function openTableLogic(oAGDialog, bAdd) {
					oAGDialog.getTableAsync().then(function (oTable) {
						oTable.setModel(that.oModel);
						// For Desktop and tabled the default table is sap.ui.table.Table
						if (oTable.bindRows) {
							if (bAdd) {
								oTable.setSelectionMode('Single');
								oTable.addColumn(new UIColumn({
									label: "계정 그룹",
									template: oAccountGroupemplate
								}));
								oTable.addColumn(new UIColumn({
									label: "손익계산서 계정 유형",
									template: oPLTemplate
								}));
								oTable.addColumn(new UIColumn({
									label: "의미",
									template: oMeaningTemplate
								}));
							}
							oTable.bindAggregation("rows", {
								path: "GLModel>/",
								events: {
									dataReceived: function () {
										oAGDialog.update();
									}
								}
							});

							let aFilter = [];

							//계정과목표의 Tokens의 key값을 가져오는 구문
							that.byId('CoA').getTokens().forEach((oToken) => {
								aFilter.push(new Filter('CoA', 'Contains', oToken.getKey()))
							})

							// 바인딩 되어있는 시점에서 filter 
							oTable.getBinding('rows').filter(aFilter);

						}
						oAGDialog.update();
					}.bind(this));
				}

				if (this._bAGDialogInitialized) {
					// Re-set the tokens from the input and update the table
					this._oBasicSearchField.setValue();
					oAGDialog.setTokens([]);
					// oAGDialog.setTokens(this.oAGInput.getTokens());
					oAGDialog.update();


					oFilterBar.setFilterBarExpanded(false);
					oFilterBar.setBasicSearch(this._oBasicSearchField);

					openTableLogic(oAGDialog, false)
					oAGDialog.open();


					return;
				}


				this._oBasicSearchField = new SearchField({
					search: function () {
						this.oAGDialog.getFilterBar().search();
					}.bind(this)
				});

				this.getView().addDependent(oAGDialog);


				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Re-map whitespaces
				oFilterBar.determineFilterItemByName("accont_group").getControl().setTextFormatter(this._inputTextFormatter);

				openTableLogic(oAGDialog, true);

				// oAGDialog.setTokens(this.oCoAInput.getTokens());
				this._bAGDialogInitialized = true;
				oAGDialog.open();
			}.bind(this));
		},




		onAGCancelPress: function () {
			this.oAGDialog.close();
		},

		onFilterBarAGSearch: function (oEvent) {
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

			aFilters.push(new Filter({
				filters: [
					new Filter({
						path: "accont_group",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new Filter({
						path: "meaning",
						operator: FilterOperator.Contains,
						value1: sSearchQuery
					})
				],
				and: false
			}));

			this.byId('CoA').getTokens().forEach((oToken) => {
				aFilters.push(new Filter('CoA', 'Contains', oToken.getKey()))
			})

			this._filterTableAG(new Filter({
				filters: aFilters,
				and: true
			}));
		},

		_filterTableAG: function (oFilter) {
			var oValueHelpDialog = this.oAGDialog;
			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				oValueHelpDialog.update();
			});
		},


		//계정그룹 검색했을 때 함수
		onAGOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			var Model = this.getView().getModel("GLModel").oData;
			var bTokens = [];

			aTokens.forEach(function (oToken) {
				oToken.setText(this.whitespace3Char(oToken.getText()));
			}.bind(this));

			for (let i = 0; i < aTokens.length; i++) {
				aTokens[i].mProperties.text = aTokens[i].mProperties.key
				//토큰의 텍스트를 키값과 동일하게 해주는 구문
				var aTokenskey = aTokens[i].mProperties.key
				for (let E = 0; E < Model.length; E++) {
					console.log(Model[E].accont_group);
					if (aTokenskey == Model[E].accont_group) {
						bTokens.push(new Token({
							text: Model[E].CoA,
							key: Model[E].CoA
						}))
					}
				}
			}

			bTokens = bTokens.reduce((prev, now) => {
				if (!prev.some(obj => obj.mProperties.key === now.mProperties.key)) prev.push(now);
				return prev;
			}, []); // bTokens 안에 중복된 key값을 가진 토큰을 제거(reduce : 배열 중복값 제거)

			this.byId("accont_group").setTokens(aTokens);
			this.byId("CoA").setTokens(bTokens);

			this.oAGDialog.close();

		},

		whitespace3Char: function (sOriginalText) {
			var sWhitespace = " ",
				sUnicodeWhitespaceCharacter = "\u00A0"; // Non-breaking whitespace

			if (typeof sOriginalText !== "string") {
				return sOriginalText;
			}

			return sOriginalText
				.replaceAll((sWhitespace + sWhitespace), (sWhitespace + sUnicodeWhitespaceCharacter)); // replace spaces
		}

	});
});