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

    var CustomerModel;
    var DuplicateModel;

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
            cus_1_Route.attachPatternMatched(this.onMyRoutePatternMatched2, this);
            org_1_Route.attachPatternMatched(this.onMyRoutePatternMatched2, this);

            const Customer = await $.ajax({
                type:"get",
                url:"/customer/Customer"
            });
			
            


            DuplicateModel = CustomerModel;
            DuplicateModel = new JSONModel(Customer.value);
            for (let j=DuplicateModel.oData.length-1; j>=0; j--) {                 
                for (let k=0; k<j; k++) {  
                    if (DuplicateModel.oData[j].city == DuplicateModel.oData[k].city) {
                        DuplicateModel.oData.splice(j,1); 
                        break;                   
                    }                 
                }             
            }
            // DuplicateModel.oData.splice(0,1);
            this.getView().setModel(DuplicateModel, "DuplicateModel")


        },

        onMyRoutePatternMatched: async function(){            

            this.onDataView();
            

        },

        onMyRoutePatternMatched2: async function(){            

            let oCustomerModel = this.getOwnerComponent().getModel("CustomerModel");

            const Customer = await $.ajax({
                type:"get",
                url:"/customer/Customer"
            });

            oCustomerModel.setProperty('/', Customer.value);
            
            this.onSearch();

        },

        onDataView: async function () {
            let oCustomerModel = this.getOwnerComponent().getModel("CustomerModel");

            const Customer = await $.ajax({
                type:"get",
                url:"/customer/Customer"
            });

            oCustomerModel.setProperty('/', Customer.value);
			
            let CustomerModel =new JSONModel(Customer.value);
            this.getView().setModel(CustomerModel, "CustomerModel");
               
            let totalNumber = oCustomerModel.oData.length;

            let number = { number: totalNumber };
            let numberModel = new JSONModel(number);
            this.getView().setModel(numberModel, "numberModel");
            // DuplicateModel
            let TableIndex="?????? ("+totalNumber+")";
            this.getView().byId("TableName").setText(TableIndex);

            this.onReset();

            // let DuplicateModel = CustomerModel;
            // for (let j=DuplicateModel.oData.length-1; j>=0; j--) {                 
            //     for (let k=0; k<j; k++) {  
            //         if (DuplicateModel.oData[j].city == DuplicateModel.oData[k].city) {
            //             DuplicateModel.oData.splice(j,1); 
            //             break;                   
            //         }                 
            //     }             
            // }
            // DuplicateModel.oData.splice(0,1);
            // this.getView().setModel(DuplicateModel, "DuplicateModel")

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
         * ??????/?????? valueHelpDialog Open 
         */
        onOpenSearchRegion: function (oEvent, sPopName) {
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

            

            DuplicateModel = CustomerModel;
           
            DuplicateModel = new JSONModel(Customer.value);
            for (let j=DuplicateModel.oData.length-1; j>=0; j--) {                 
                for (let k=0; k<j; k++) {  
                    if (DuplicateModel.oData[j].city == DuplicateModel.oData[k].city) {
                        DuplicateModel.oData.splice(j,1); 
                        break;                   
                    }                 
                }             
            }
            // DuplicateModel.oData.splice(0,1);
            this.getView().setModel(DuplicateModel, "DuplicateModel")

			var oCounrtyTemplate = new Text({text: {path: 'DuplicateModel>country'}, renderWhitespace: true});
            var oCityTemplate = new Text({text: {path: 'DuplicateModel>city'}, renderWhitespace: true});

			if (!this.pWhitespaceDialog) {
				this.pWhitespaceDialog = this.loadFragment({
					name: "project2.view.Fragment.Region"
				});
			}
            
            if(sPopName === 'city') {
                this._oWhiteSpacesInput = this.byId("City");                
            }

            if(sPopName === 'region') {
                this._oWhiteSpacesInput = this.byId("Region");    
            }

			this.pWhitespaceDialog.then(function(oWhitespaceDialog) {
				var oFilterBar = oWhitespaceDialog.getFilterBar();
				this.oWhitespaceDialog = oWhitespaceDialog;
				if (this._bWhitespaceDialogInitialized) {
					// Re-set the tokens from the input and update the table

                    oFilterBar.setFilterBarExpanded(false);
                    this._oBasicSearchField.setValue('');
                    this.byId("Contry1").setValue('');
                    this.byId("City1").setValue('');

					oWhitespaceDialog.setTokens([]);
					oWhitespaceDialog.setTokens(this._oWhiteSpacesInput.getTokens());
                    oWhitespaceDialog.getTableAsync().then(function (oTable) {
                        oTable.setModel(this.oModel);
    
                        // For Desktop and tabled the default table is sap.ui.table.Table
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "DuplicateModel>/",
                                events: {
                                    dataReceived: function() {
                                        oWhitespaceDialog.update();
                                    }
                                }
                            });
                        }
    
                        oWhitespaceDialog.update();
                    }.bind(this));

					oWhitespaceDialog.open();
					return;
				}
				this.getView().addDependent(oWhitespaceDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oWhitespaceDialog.setRangeKeyFields([{
					label: "country",
					key: "country"
				}]);
                this._oBasicSearchField = new SearchField({
                    search: function() {
                        this.oWhitespaceDialog.getFilterBar().search();
                    }.bind(this)
                });
				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Re-map whitespaces
				oFilterBar.determineFilterItemByName("country").getControl().setTextFormatter(this._inputTextFormatter);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(this.oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({label: "??????/??????", template: oCounrtyTemplate }));
						oTable.addColumn(new UIColumn({label: "??????", template: oCityTemplate }));
						oTable.bindAggregation("rows", {
							path: "DuplicateModel>/",
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
							path: "DuplicateModel>/",
							template: new ColumnListItem({
								cells: [new Label({text: "{DuplicateModel>city}"}), new Label({text: "{DuplicateModel>city}"})]
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
         * ??????/?????? valueHelpDialog ?????? ?????? ????????? ??????.
         */
        onCancelPress: function(){
            this.byId("RegionPop").close();
        },

        /**
         * ??????/?????? valueHelpDialog ?????? ?????? ????????? ??????.
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
         * valueHelpDialog ????????? ??????.
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
		},

        /**
         * ???????????? ?????????????????? ??????.
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
            sap.ui.controller("project1.controller.App").onSelected("CUST_home");
            this.getOwnerComponent().getRouter().navTo("customer_home");

        },

        onCreateBP1: function() {
            sap.ui.controller("project1.controller.App").onSelected("cm_create");
            this.getOwnerComponent().getRouter().navTo("CreateCustomer");

        },

        onCreateBP2: function() {
            sap.ui.controller("project1.controller.App").onSelected("org_create");
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
                fileName: 'Customer??????????????????.xlsx',
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
                label: "???????????? ?????????(Number)",
                property: "bp_number",
                type:EdmType.String
            });
            aCols.push({
                label: "???????????? ?????????(Name)",
                property: "bp_name",
                type:EdmType.String
            });
            aCols.push({
                label: "?????? ??????",
                property: "comcode",
                type:EdmType.String
            });
            aCols.push({
                label: "?????? ??????",
                property: "address",
                type:EdmType.String
            });
            aCols.push({
                label: "??????",
                property: "city",
                type:EdmType.String
            });
            aCols.push({
                label: "?????? ??????",
                property: "potal_code",
                type:EdmType.String
            });
            aCols.push({
                label: "??????/??????",
                property: "country",
                type:EdmType.String
            });
            aCols.push({
                label: "?????? ??????",
                property: "classify_cust",
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
            

            if(selectedclassify_cust==="??????") {this.getOwnerComponent().getRouter().navTo("customer_detail", {num : SelectedNum});
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

            if (org) {aFilter.push(new Filter("bp_name", FilterOperator.Contains, org))}
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