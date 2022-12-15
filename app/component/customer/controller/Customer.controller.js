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
	'sap/m/Text'


], function(
	Controller, Filter, FilterOperator,  JSONModel, Fragment, Sorter,
    SearchField, Token, ODataModel, UIColumn, MColumn, Text
) {
	"use strict";

	return Controller.extend("project2.controller.Customer", {

		onInit: async function () {
            const myRoute=this.getOwnerComponent().getRouter().getRoute('Customer');
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

        onMyRoutePatternMatched: async function(){
            this.onDataView();

        },

        onDataView: async function () {
			
            const Customer=await $.ajax({
                type:"get",
                url:"/customer/Customer"
            });
			
            let CustomerModel =new JSONModel(Customer.value);
            this.getView().setModel(CustomerModel, "CustomerModel");

            let totalNumber=this.getView().getModel("CustomerModel").oData.length;

            let TableIndex="고객 ("+totalNumber+")";
            this.getView().byId("TableName").setText(TableIndex);


		},


        onSearch: function(){
            let BP = this.byId("BP").getValue();
            let Adress = this.byId("Adress").getValue();
            let City = this.byId("City").getTokens();
            let Region = this.byId("Region").getTokens();
            let BP_Category = this.byId("BP_Category").getValue();
            let Com_Code = this.byId("Com_Code").getValue();
            let Postal_Num = this.byId("Postal_Num").getValue();



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
        },

        onReset: function(){
            this.byId("BP").setValue("");
            this.byId("Adress").setValue(""); 
            this.byId("City").setTokens();
            this.byId("Region").setTokens();
            this.byId("BP_Category").setValue("");
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
        }

        
        
        















	});
});