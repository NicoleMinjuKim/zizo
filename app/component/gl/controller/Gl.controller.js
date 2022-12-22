sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter",
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text',
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/library",
	'sap/ui/core/BusyIndicator',
	'../model/models'
], function (
	Controller,
	Filter,
	FilterOperator,
	JSONModel,
	Fragment,
	Sorter,
	SearchField,
	Token,
	UIColumn,
	MColumn,
	Text,
	Spreadsheet,
	exportLibrary,
	BusyIndicator,
	formatter
) {
	"use strict";
	const EdmType = exportLibrary.EdmType;

	return Controller.extend("project3.controller.Gl", {
		models: formatter,
		onInit: function () {
			this.oCoAInput = this.byId("CoA");
			this.oAGInput = this.byId("accont_group");
			this.getOwnerComponent().getRouter().getRoute("Gl").attachPatternMatched(this.onMyRoutePatternMatched, this);			
			this.getOwnerComponent().getRouter().getRoute("DetailGl").attachPatternMatched(this.onMyRoutePatternMatched2, this);
		},

		onMyRoutePatternMatched: async function () {

			let oGLModel = this.getOwnerComponent().getModel("GLModel");
			//clear를 위해
			this.byId("CoA").destroyTokens("");
			this.byId("gl_account").setValue("");
			this.byId("gl_account_type").setSelectedKeys([]);
			this.byId("accont_group").destroyTokens("");
			this.byId("gl_comcode").setValue("");
			//clear를 위해

			const GL = await $.ajax({
				type: "GET",
				url: "/gl/Gl"
			});
			// let GLModel = new JSONModel(GL.value);
			// this.getView().setModel(GLModel, "GLModel");
			oGLModel.setProperty("/", GL.value);

			let totalNumber = oGLModel.oData.length;
			let number = {
				number: totalNumber
			};
			let numberModel = new JSONModel(number);
			this.getView().setModel(numberModel, "numberModel");

			this.onClear();
		},

		onMyRoutePatternMatched2: async function () {

			const GL = await $.ajax({
				type: "GET",
				url: "/gl/Gl"
			});

			this.getOwnerComponent().getModel("GLModel").setProperty("/", GL.value)

			this.onSearch();
		},

		goHack: function () {
			sap.ui.controller("project1.controller.App").onSelected("GL_home");

			this.getOwnerComponent().getRouter().navTo("gl_home")
		},

		onSearch: function () {

			let CoA = this.byId("CoA").getTokens();
			let gl_account = this.byId("gl_account").getValue();
			let gl_account_type = this.byId("gl_account_type").getSelectedKeys();
			let accont_group = this.byId("accont_group").getTokens();
			let gl_comcode = this.byId("gl_comcode").getValue();

			this.showBusyIndicator(800, 0);

			var aFilter = [];

			// if (CoA) {aFilter.push(new Filter("CoA", FilterOperator.Contains, CoA))}
			if (gl_account) {
				aFilter.push(new Filter("gl_account", FilterOperator.Contains, gl_account))
			}
			// if (gl_account_type) {aFilter.push(new Filter("gl_account_type", FilterOperator.Contains, gl_account_type) ) }
			// if (accont_group) {aFilter.push(new Filter("accont_group", FilterOperator.Contains, accont_group))}
			if (gl_comcode) {
				aFilter.push(new Filter("gl_comcode", FilterOperator.Contains, gl_comcode))
			}


			if (gl_account_type.length) {
				gl_account_type.forEach((oValue) => {
					console.log(oValue.split(' ')[0]);
					aFilter.push(new Filter("gl_account_type", FilterOperator.Contains, oValue.split(' ')[0]))
				})
			}

			if (CoA.length) {
				// aFilter.push(new Filter("CoA", FilterOperator.Contains, CoA))
				CoA.forEach((oToken) => {
					aFilter.push(new Filter("CoA", FilterOperator.EQ, oToken.getKey()))
				})
			}
			if (accont_group.length) {
				accont_group.forEach((oToken) => {
					aFilter.push(new Filter("accont_group", FilterOperator.EQ, oToken.getKey()))
				})
				// aFilter.push(new Filter("country", FilterOperator.Contains, accont_group))
			}

			let oTable = this.getView().byId("GLTable").getBinding("rows");
			oTable.filter(aFilter);
			// this.hideBusyIndicator()
			
			let totalNumber= oTable.iLength;
			this.getView().getModel('numberModel').setProperty('/number',totalNumber);
            this.getView().getModel('numberModel').refresh(true);
		},

		hideBusyIndicator: function () {
			BusyIndicator.hide();
		},

		showBusyIndicator: function (iDuration, iDelay) {
			BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = setTimeout(function () {
					this.hideBusyIndicator();
				}.bind(this), iDuration);
			}
		},

		onClear: function () {
			this.byId("CoA").destroyTokens("");
			this.byId("gl_account").setValue("");
			this.byId("gl_account_type").setSelectedKeys([]);
			this.byId("accont_group").destroyTokens("");
			this.byId("gl_comcode").setValue("");

			this.onSearch();
		},


		onSort: function () {
			if (!this.byId("GlSorting")) {
				Fragment.load({
					id: this.getView().getId(),
					name: "project3.view.fragment.GlSorting",
					controller: this
				}).then(function (oDialog) {
					this.getView().addDependent(oDialog);
					oDialog.open();
				}.bind(this));
			} else {
				this.byId("GlSorting").open();
			}
		},

		onConfirmSort: function (oEvent) {
			let mParams = oEvent.getParameters();
			let sPath = mParams.sortItem.getKey();
			let bDescending = mParams.sortDescending;
			let aSorters = [];

			aSorters.push(new Sorter(sPath, bDescending));

			let oBinding = this.byId("GLTable").getBinding("rows");

			oBinding.sort(aSorters);
		},

		onDeleteGL: async function () {
			var totalNumber = this.getView().getModel("GLModel").oData.length;
			console.log(totalNumber);
			let model = this.getView().getModel("GLModel");
			console.log(model);
			let i;
			for (i = 0; i < totalNumber; i++) {
				let chk = '/' + i + '/CHK'
				let key = '/' + i + '/gl_external_id';
				if (model.getProperty(chk) === true) {
					let gl_external_id = model.getProperty(key);
					let url = "/gl/Gl/" + gl_external_id;
					console.log(url);
					await $.ajax({
						type: "DELETE",
						url: url
					});
				}
			}
			this.onMyRoutePatternMatched();
		},


		//엑셀 다운로드 함수
		onExcel: function () {
			let aCols, oRowBinding, oSettings, oSheet, oTable;
			oTable = this.byId('GLTable');
			oRowBinding = oTable.getBinding('rows');
			aCols = this.createColumnConfig();
			let oList = [];
			for (let j = 0; j < oRowBinding.oList.length; j++) {
				if (oRowBinding.aIndices.indexOf(j) > -1) {
					oList.push(oRowBinding.oList[j]);
				}
			}

			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level'
				},
				dataSource: oList,
				fileName: 'GL계정마스터데이터.xlsx',
				worker: false
			};
			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});
		},

		createColumnConfig: function () {
			const aCols = [];
			aCols.push({
				label: "GL 계정 외부 ID",
				property: "gl_external_id",
				type: EdmType.String
			});
			aCols.push({
				label: "내역",
				property: "history",
				type: EdmType.String
			});
			aCols.push({
				label: "계정과목표",
				property: "CoA",
				type: EdmType.String
			});
			aCols.push({
				label: "GL 계정 유형",
				property: "gl_account_type",
				type: EdmType.String
			});
			aCols.push({
				label: "계정 그룹",
				property: "accont_group",
				type: EdmType.String
			});
			aCols.push({
				label: "GL 계정 설명",
				property: "description",
				type: EdmType.String
			});
			aCols.push({
				label: "GL 계정",
				property: "gl_account",
				type: EdmType.String
			});
			aCols.push({
				label: "의미",
				property: "meaning",
				type: EdmType.String
			});
			aCols.push({
				label: "회사코드",
				property: "gl_comcode",
				type: EdmType.String
			});
			aCols.push({
				label: "미결항목 여부",
				property: "opendata",
				trueValue: "open",
				falseValue: "closed",

				type: EdmType.Boolean
			});
			return aCols;
		},

		//여기까지가 엑셀 다운로드 함수


		///계정과목표 fragment

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





		///계정그룹 fragment
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
		},


		onNavToDetail: function (oEvent) {
			var SelectedNum = oEvent.getParameters().row.mAggregations.cells[1].mProperties.text;
			console.log(SelectedNum);
			this.getOwnerComponent().getRouter().navTo("DetailGl", {
				num: SelectedNum
			});

		},

		onCreateGl: function () {
			sap.ui.controller("project1.controller.App").onSelected("gl_create");

			this.getOwnerComponent().getRouter().navTo("CreateGl");
		}
	});
});