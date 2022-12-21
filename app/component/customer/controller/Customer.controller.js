sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text',
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    'sap/ui/core/BusyIndicator'


], function(
	Controller, Filter, FilterOperator,  JSONModel, Fragment, Sorter,
    SearchField, Token, ODataModel, UIColumn, MColumn, Text, Spreadsheet, exportLibrary, BusyIndicator
) {
	"use strict";

    const EdmType=exportLibrary.EdmType;

	return Controller.extend("project2.controller.Customer", {
    

		onInit: async function () {
            const oRouter =  this.getOwnerComponent().getRouter();
            const customerRoute = oRouter.getRoute('Customer'),
                  cus_1_Route = oRouter.getRoute('customer_detail'),
                  cus_2_Route = oRouter.getRoute('customer_detailexpand'),
                  org_1_Route = oRouter.getRoute('DetailOrganization'),
                  org_2_Route = oRouter.getRoute('DetailOrganization_detailexpand');
                        
            
            
            customerRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
            cus_1_Route.attachPatternMatched(this.onMyRoutePatternMatched, this);
            cus_2_Route.attachPatternMatched(this.onMyRoutePatternMatched, this);


        },

        onMyRoutePatternMatched: async function(){
            

            this.onDataView();

        },

        onDataView: async function () {
            const Customer = await $.ajax({
                type:"get",
                url:"/customer/Customer"
            });
			
            let CustomerModel =new JSONModel(Customer.value);
            this.getView().setModel(CustomerModel, "CustomerModel");
               
            let totalNumber = this.getView().getModel("CustomerModel").oData.length;
            let number = { number: totalNumber };
            let numberModel = new JSONModel(number);
            this.getView().setModel(numberModel, "numberModel");
            
            let TableIndex="고객 ("+totalNumber+")";
            this.getView().byId("TableName").setText(TableIndex);

            this.onReset();


		},

        hideBusyIndicator : function() {
			BusyIndicator.hide();
		},

		showBusyIndicator : function (iDuration, iDelay) {
			BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = setTimeout(function() {
					this.hideBusyIndicator();
				}.bind(this), iDuration);
			}
		},

    


        


        onSearch: function(){

            var oGlobalBusyDialog = new sap.m.BusyDialog();


            let BP = this.byId("BP").getValue();
            let Adress = this.byId("Adress").getValue();
            let City = this.byId("City").getTokens();
            let Region = this.byId("Region").getTokens();
            let BP_Category = this.byId("BP_Category").getSelectedKey();
            let Com_Code = this.byId("Com_Code").getValue();
            let Postal_Num = this.byId("Postal_Num").getValue();

            this.showBusyIndicator(1200, 0);



            var aFilter = [];

            if (BP) {aFilter.push(new Filter("bp_number", FilterOperator.Contains, BP))}
            if (Adress) {aFilter.push(new Filter("address", FilterOperator.Contains, Adress))}
            if (City.length) {
                // aFilter.push(new Filter("city", FilterOperator.Contains, City))
                City.forEach(
                    (oToken) => {
                        aFilter.push(
                            new Filter(
                                "city", FilterOperator.EQ, oToken.getKey()
                            )
                        )
                    }
                )
            }
            if (Region.length) {
                Region.forEach(
                    (oToken) => {
                        aFilter.push(
                            new Filter(
                                "country", FilterOperator.EQ, oToken.getKey()
                            )
                        )
                    }
                )
                // aFilter.push(new Filter("country", FilterOperator.Contains, Region))
            }
            if (BP_Category) {aFilter.push(new Filter("classify_cust", FilterOperator.Contains, BP_Category))}
            if (Com_Code) {aFilter.push(new Filter("comcode", FilterOperator.Contains, Com_Code))}
            if (Postal_Num) {aFilter.push(new Filter("potal_code", FilterOperator.Contains, Postal_Num))}


            let oTable=this.byId("CustomerTable").getBinding("rows");
            oTable.filter(aFilter);

            let totalNumber= oTable.iLength;
            this.getView().getModel('numberModel').setProperty('/number',totalNumber);
            this.getView().getModel('numberModel').refresh(true);
            console.log(this.getView().getModel('numberModel'));



        },

        onReset: function(){
            this.byId("BP").setValue("");
            this.byId("Adress").setValue(""); 
            this.byId("City").destroyTokens();
            this.byId("Region").destroyTokens();
            this.byId("BP_Category").setSelectedKey("");
            this.byId("Com_Code").setValue("");
            this.byId("Postal_Num").setValue("");


            this.onSearch();
        }, 

        onSort: function () {
            if (!this.byId("SortDialog")) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "project2.view.Fragment.SortDialog",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this.byId("SortDialog").open();
            }
            this.onSearch();
        },

        onConfirmSortDialog: function (oEvent) {
            let mParams = oEvent.getParameters();
            let sPath = mParams.sortItem.getKey();
            let bDescending = mParams.sortDescending;
            let aSorters = [];

            aSorters.push(new Sorter(sPath, bDescending));

            let oBinding = this.byId("CustomerTable").getBinding("rows");
            oBinding.sort(aSorters);
        },

        /**
         * 국가/지역 valueHelpDialog Open 
         */
        onOpenSearchRegion: function () {
            // if (!this.byId("SortDialog")) {
            //     Fragment.load({
            //         id: this.getView().getId(),
            //         name: "project2.view.Fragment.Region",
            //         controller: this
            //     }).then(function (oDialog) {
            //         this.getView().addDependent(oDialog);
            //         oDialog.open();
            //     }.bind(this));
            // } 

			var oCounrtyTemplate = new Text({text: {path: 'CustomerModel>country'}, renderWhitespace: true});
            var oCityTemplate = new Text({text: {path: 'CustomerModel>city'}, renderWhitespace: true});
			this._oBasicSearchField = new SearchField({
				search: function() {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});
			if (!this.pWhitespaceDialog) {
				this.pWhitespaceDialog = this.loadFragment({
					name: "project2.view.Fragment.Region"
				});
			}
			this.pWhitespaceDialog.then(function(oWhitespaceDialog) {
				var oFilterBar = oWhitespaceDialog.getFilterBar();
				this.oWhitespaceDialog = oWhitespaceDialog;
				if (this._bWhitespaceDialogInitialized) {
					// Re-set the tokens from the input and update the table
					oWhitespaceDialog.setTokens([]);
					// oWhitespaceDialog.setTokens(this._oWhiteSpacesInput.getTokens());
					oWhitespaceDialog.update();

					oWhitespaceDialog.open();
					return;
				}
				this.getView().addDependent(oWhitespaceDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oWhitespaceDialog.setRangeKeyFields([{
					label: "country",
					key: "country"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Re-map whitespaces
				oFilterBar.determineFilterItemByName("country").getControl().setTextFormatter(this._inputTextFormatter);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(this.oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({label: "국가/지역", template: oCounrtyTemplate }));
						oTable.addColumn(new UIColumn({label: "도시", template: oCityTemplate }));
						oTable.bindAggregation("rows", {
							path: "CustomerModel>/",
							events: {
								dataReceived: function() {
									oWhitespaceDialog.update();
								}
							}
						});
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						oTable.addColumn(new MColumn({header: new Label({text: "country"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "city"})}));
						oTable.bindItems({
							path: "CustomerModel>/",
							template: new ColumnListItem({
								cells: [new Label({text: "{CustomerModel>city}"}), new Label({text: "{CustomerModel>city}"})]
							}),
							events: {
								dataReceived: function() {
									oWhitespaceDialog.update();
								}
							}
						});
					}

					oWhitespaceDialog.update();
				}.bind(this));

				// oWhitespaceDialog.setTokens(this._oWhiteSpacesInput.getTokens());
				this._bWhitespaceDialogInitialized = true;
				oWhitespaceDialog.open();

			}.bind(this));
            
        },

        /**
         * 국가/지역 valueHelpDialog 취소 버튼 클릭시 닫기.
         */
        onCancelPress: function(){
            this.byId("RegionPop").close();
        },

        /**
         * 국가/지역 valueHelpDialog 확인 버튼 클릭시 닫기.
         */
        onOkPress: function(oEvent) {
			var aTokens = oEvent.getParameter("tokens");
            var aCountry = [];
            var aCountryToken = [];
            aTokens.forEach(
                (oToken) => {
                    if(!aCountry.includes(oToken.getText().split(' ')[0])) {
                        aCountry.push(oToken.getText().split(' ')[0]);

                        aCountryToken.push(
                            new Token({
                                key: oToken.getText().split(' ')[0],
                                text: oToken.getText().split(' ')[0]
                            })
                        )
                    }
                }
            )

			this.byId('City').setTokens(
                aTokens.map(
                (oToken) => {
                    return new Token({
                        key: oToken.getKey(),
                        text: oToken.getKey()
                    })
                }
            ));
            this.byId('Region').setTokens(aCountryToken);
			this.byId("RegionPop").close();
        },

        /**
         * valueHelpDialog 필터링 기능.
         * @param {object} oEvent 
         */
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

			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "country", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "city", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
            aSelectionSet.update();

		},

        /**
         * 테이블을 필터링해주는 함수.
         * @param {array or object} oFilter 
         */
        _filterTable: function (oFilter) {
			var oValueHelpDialog = this.oWhitespaceDialog;
			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}
				oValueHelpDialog.update();
			});
		},

        
		onWhitespaceOkPress: function (oEvent) {

			var aTokens = oEvent.getParameter("tokens");
			aTokens.forEach(function (oToken) {
				oToken.setText(this.whitespace2Char(oToken.getText()));
			}.bind(this));
			this._oWhiteSpacesInput.setTokens(aTokens);
			this.oWhitespaceDialog.close();



		},

		onWhitespaceCancelPress: function () {

			this.oWhitespaceDialog.close();



		},

        onBack: function() {
            this.getOwnerComponent().getRouter().navTo("customer_home");

        },

        onCreateBP1: function() {
            this.getOwnerComponent().getRouter().navTo("CreateCustomer");

        },

        onCreateBP2: function() {
            this.getOwnerComponent().getRouter().navTo("CreateOrganization");

        },

        onDataExport: function () {
            let aCols, oRowBinding, oSettings, oSheet, oTable;
            oTable = this.byId('CustomerTable');
            oRowBinding = oTable.getBinding('rows');
            aCols = this.createColumnConfig();
            let oList=[];
            for (let j=0; j<oRowBinding.oList.length; j++) {
                if (oRowBinding.aIndices.indexOf(j)>-1){
                    oList.push(oRowBinding.oList[j]);                   
                }
            }
            


            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oList,
                fileName: 'CustomerTable.xlsx',
                worker: false
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },

        createColumnConfig: function() {
            const aCols=[];
            aCols.push({
                lables: "비즈니스 파트너(Num)",
                property: "bp_number",
                type:EdmType.String
            });
            aCols.push({
                lables: "비즈니스 파트너(Name)",
                property: "org",
                type:EdmType.String
            });
            aCols.push({
                lables: "회사 코드",
                property: "comcode",
                type:EdmType.String
            });
            aCols.push({
                lables: "도로 주소",
                property: "address",
                type:EdmType.Int32
            });
            aCols.push({
                lables: "도시",
                property: "city",
                type:EdmType.String
            });
            aCols.push({
                lables: "우편 번호",
                property: "potal_code",
                type:EdmType.String
            });
            aCols.push({
                lables: "국가/지역",
                property: "country",
                type:EdmType.String
            });
            aCols.push({
                lables: "BP범주",
                property: "bp_category",
                type:EdmType.String
            });
            return aCols;
        },


        oncheckselect: function(){
            console.log(this.getView().getModel("CustomerModel"));
        },

        onDelete: async function(){

            var totalNumber=this.getView().getModel("CustomerModel").oData.length;
            let model=this.getView().getModel("CustomerModel");
            let i;
            for (i=0; i<totalNumber; i++) {
                let chk ='/'+i+'/CHK';
                let key='/'+i+'/bp_number';
                if (model.getProperty(chk)===true) {
                    let bp_number=model.getProperty(key);
                    let url="/customer/Customer/"+bp_number;
                    await $.ajax ({
                        type: "DELETE",
                        url: url
                    });

                }

            }
            this.onDataView();
        },

        onNavToDetail: function(oEvent) {

            console.log(oEvent.getParameters());
            console.log(oEvent.getParameters().row.mAggregations.cells[1].mProperties.text);
            var SelectedNum=oEvent.getParameters().row.mAggregations.cells[1].mProperties.text;
            
            console.log(oEvent.getParameters().row.mAggregations.cells[7].mProperties.text);
            var selectedclassify_cust=oEvent.getParameters().row.mAggregations.cells[7].mProperties.text;
            

            if(selectedclassify_cust==="개인") {this.getOwnerComponent().getRouter().navTo("customer_detail", {num : SelectedNum});
        }
 
            else {this.getOwnerComponent().getRouter().navTo("DetailOrganization", {num : SelectedNum});}

        },

        showValueHelp: function () {
            if (!this.byId("BPpop")) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "project2.view.Fragment.BP",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this.byId("BPpop").open();
            }
            // this.onSearch();
        },

        onCloseBPDialog: function () {
            this.byId("BPpop").destroy();
            this.pDialog=null;
        },

        oncellClick: function(oEvent){
            console.log(oEvent);
            var oParams=oEvent.getParameters();            
            console.log(oParams);
            var rowIndex=oParams.rowIndex;
            console.log(rowIndex);
            var sPath = oParams.rowBindingContext.sPath;
            console.log(sPath);
            console.log(this.byId("BPTable1").getContextByIndex(rowIndex).sPath);
            var selecteddata=this.getView().getModel("CustomerModel").getProperty(sPath);
            console.log(selecteddata);
            var selectedorg=selecteddata.org;
            console.log(selectedorg);
            var selectedbp_number=selecteddata.bp_number;
            console.log(selectedbp_number);
            this.byId("BP").setValue(selectedbp_number);
            this.onCloseBPDialog();
        },

        onSearch2: function(){
            let org= this.byId("Name").getValue();
            let bp_number= this.byId("Number").getValue();

            var aFilter = [];

            if (org) {aFilter.push(new Filter("org", FilterOperator.Contains, org))}
            if (bp_number) {aFilter.push(new Filter("bp_number", FilterOperator.Contains, bp_number))}

            
            let oTable=this.byId("BPTable1").getBinding("rows");
            oTable.filter(aFilter);
        },

        onReset2: function(){

            this.byId("Name").setValue("");
            this.byId("Number").setValue("");
            this.onSearch2();

            
        }







        


	});
});