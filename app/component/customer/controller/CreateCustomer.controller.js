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
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
    
], function (Controller, Filter, FilterOperator,  JSONModel, Fragment, Sorter,
    SearchField, Token, ODataModel, UIColumn, MColumn, Text, Spreadsheet, exportLibrary, MessageBox, History) {
    "use strict";

    var CustomerModel;
    var DuplicateModel;

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    return Controller.extend("project2.controller.CreateCustomer", {

        onInit: function() {
            this._initModel();

            this.getOwnerComponent()
                .getRouter()
                .getRoute("CreateCustomer")
                .attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

        _initModel: async function() {
            // model - 데이터를 저장 및 보관하는 역할 합니다.
            this.getView()
                .setModel(
                    new JSONModel({
                        bp_category : "1",
                        classify_cust: '개인'  // 두개의 값을 제외하고(고정) 페이지 시작하면 모두 빈값을 줌. 
                    }),
                    'CreateCustomer'
                );

        
            const Customer = await $.ajax({
                type:"get",
                url:"/customer/Customer"
            });

            CustomerModel = new JSONModel (Customer.value);
            this.getView().setModel(CustomerModel,'CustomerModel');   
            
            DuplicateModel = CustomerModel;
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
        },

        onCloseBPDialog: function () {
            this.byId("BPpop").destroy();
            this.pDialog=null;
        },

        onMyRoutePatternMatched: async function(oEvent) { 
            let oDay = new Date().getFullYear() + "-" + (new Date().getMonth()+1)+ "-" + (new Date().getDate());
            
            this.getView().getModel("CreateCustomer").setProperty("/", {
                bp_category : "1",
                classify_cust: '개인',  // 두개의 값을 제외하고(고정) 페이지 시작하면 모두 빈값을 줌. 
                create_date : oDay,
                final_change_date : oDay,
                holdorder : '',
                holdclaim : '',
                holddelivery : '',
                holdposting : '',
                vat_duty : '',
            });

            this.byId('City').setTokens([]);
            this.byId('Region').setTokens([]);
			// this.getView().getModel('CreateCustomer').setProperty('/create_date',oDay);
			// this.getView().getModel('CreateCustomer').setProperty('/final_change_date',oDay);
        },

        onSave : async function () {
            const oView = this.getView(),
                  oCreateModel = oView.getModel('CreateCustomer'),
                  oCreateData = oCreateModel.getProperty('/');

            // getProperty('/') < = > getData()
            // getProperty('/bp_number') o
            // getData('/bp_number') x

            if(!oCreateData.bp_number) {
                return MessageBox.error('비즈니스 파트너 번호를 입력하세요!');
            }

            if(!Number(oCreateData.bp_number)) {
                return MessageBox.error('비즈니스 파트너 번호에 숫자를 입력하세요');
            }

            let sCity = '', sCountry = '';
            this.byId('City').getTokens().forEach(function(oToken, index) {
                sCity += oToken.getKey()
                if(index !== this.byId('City').getTokens().length-1) {
                    sCity += ', ';
                }
            }, this);
            this.byId('Region').getTokens().forEach(function(oToken, index) {
                sCountry += oToken.getKey();
                if(index !== this.byId('Region').getTokens().length-1) {
                    sCountry += ', ';
                }
            }, this);

            var createData = {
                "bp_number": oCreateData.bp_number || '',
                "comcode": oCreateData.comcode || '',
                "bp_name": oCreateData.bp_name || '',
                "address": oCreateData.address || '',
                "house_num": oCreateData.house_num || '',
                "potal_code": oCreateData.potal_code || '',
                "city": sCity || '',
                "country": sCountry || '',
               // "region": oCreateData.region || '',
                "bp_category": oCreateData.bp_category || '',
                "gendercall": oCreateData.gendercall || null,
                "first_name": oCreateData.first_name || null,
                "last_name": oCreateData.last_name || null,
                "gender": oCreateData.gender || '',
                "org": oCreateData.org || '',
                "authority_group":oCreateData.authority_group || '',
                "birthday": oCreateData.birthday || '',
                "affliation_com_num": oCreateData.affliation_com_num || null,
                "create_person": oCreateData.create_person || '',
                "create_date": oCreateData.create_date || '',
                "final_changer": oCreateData.final_changer || '',
                "final_change_date": oCreateData.final_change_date || '',
                "customer_group": oCreateData.customer_group || '',
                "cust_authority_group": oCreateData.cust_authority_group || '',
                "deliverydate_rule": oCreateData.deliverydate_rule || '',
                "group_key": oCreateData.group_key || '',
                "supplier": oCreateData.supplier || '',
                "proxy_payer": oCreateData.proxy_payer || '',
                "payment_reason": oCreateData.payment_reason || '',
                "holdorder": oCreateData.holdorder.length ? oCreateData.holdorder : undefined, // Boolean형 이렇게 표시해줘야함.
                "holdclaim": oCreateData.holdclaim.length ? oCreateData.holdclaim : undefined,
                "holddelivery": oCreateData.holddelivery.length ? oCreateData.holddelivery : undefined,
                "holdposting": oCreateData.holdposting.length ? oCreateData.holdposting : undefined,
                "classify_cust": oCreateData.classify_cust || '',
                "vat_duty": oCreateData.vat_duty.length ? oCreateData.vat_duty : undefined,
                "postoffice_postal_number": oCreateData.postoffice_postal_number || '',
                "legal_state": oCreateData.legal_state || '',
                "foundation_day": oCreateData.foundation_day || '',
                "liquidation_day": oCreateData.liquidation_day || '',
            }

            console.log(createData);

            let url = "/customer/Customer";
            
            try {
                await $.ajax({
                    type : "post",
                    url : url,
                    contentType: "application/json;IEEE754Compatible=true",
                    data: JSON.stringify(createData)

                }).then((result) => { 
                    MessageBox.success('고객 데이터 생성 성공', {
                        onClose: function() {
                            window.history.back();
                            var x= History.getInstance().getPreviousHash().split('/').slice(2).toString();
            if (x==="Customer_chart") {
                sap.ui.controller("project1.controller.App").onSelected("cus_chart");
            } else if (x==="CreateOrganization"){
                sap.ui.controller("project1.controller.App").onSelected("org_create");
            } else if (x==="Customer") {
                sap.ui.controller("project1.controller.App").onSelected("cm_display");
            } else if(x==="CoA") {
                sap.ui.controller("project1.controller.App").onSelected("COA_view");
            } else if(x==="Gl") {
                sap.ui.controller("project1.controller.App").onSelected("gl_display");
            } else if(x==="CreateGl") {
                sap.ui.controller("project1.controller.App").onSelected("gl_create");
            } else if(x==="Gl_chart") {
                sap.ui.controller("project1.controller.App").onSelected("glchart_view");
            } else if(x==="GlChartFixFlex") {
                sap.ui.controller("project1.controller.App").onSelected("revenue_chart");
            }

            // console.log(History.getInstance().getPreviousHash().split('/').slice(0).toString());
            var y= History.getInstance().getPreviousHash().split('/').slice(0).toString();
            if (y==="Customer") {
                sap.ui.controller("project1.controller.App").onSelected("CUST_home");
            } else if (y==="Gl") {
                sap.ui.controller("project1.controller.App").onSelected("GL_home");
            } else if(y==="team") {
                sap.ui.controller("project1.controller.App").onSelected("teampage_view");
            }

            // console.log(History.getInstance().getPreviousHash().toString());
            var z= History.getInstance().getPreviousHash();
            if (z==="") {
                sap.ui.controller("project1.controller.App").onSelected("mainhome_display");
            }
                        }
                    });
                });   
            } catch (error) {
                
                MessageBox.error('생성 실패!');
            }            
        },

		onBack : function (oEvent) {
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} 

            // console.log(oEvent.getParameter());
            // console.log(oEvent.getSource());
            // console.log(History.getInstance().getPreviousHash().split('/').slice(2).toString());

            var x= History.getInstance().getPreviousHash().split('/').slice(2).toString();
            if (x==="Customer_chart") {
                sap.ui.controller("project1.controller.App").onSelected("cus_chart");
            } else if (x==="CreateOrganization"){
                sap.ui.controller("project1.controller.App").onSelected("org_create");
            } else if (x==="Customer") {
                sap.ui.controller("project1.controller.App").onSelected("cm_display");
            } else if(x==="CoA") {
                sap.ui.controller("project1.controller.App").onSelected("COA_view");
            } else if(x==="Gl") {
                sap.ui.controller("project1.controller.App").onSelected("gl_display");
            } else if(x==="CreateGl") {
                sap.ui.controller("project1.controller.App").onSelected("gl_create");
            } else if(x==="Gl_chart") {
                sap.ui.controller("project1.controller.App").onSelected("glchart_view");
            } else if(x==="GlChartFixFlex") {
                sap.ui.controller("project1.controller.App").onSelected("revenue_chart");
            }

            // console.log(History.getInstance().getPreviousHash().split('/').slice(0).toString());
            var y= History.getInstance().getPreviousHash().split('/').slice(0).toString();
            if (y==="Customer") {
                sap.ui.controller("project1.controller.App").onSelected("CUST_home");
            } else if (y==="Gl") {
                sap.ui.controller("project1.controller.App").onSelected("GL_home");
            } else if(y==="team") {
                sap.ui.controller("project1.controller.App").onSelected("teampage_view");
            }

            // console.log(History.getInstance().getPreviousHash().toString());
            var z= History.getInstance().getPreviousHash();
            if (z==="") {
                sap.ui.controller("project1.controller.App").onSelected("mainhome_display");
            }

           //this.onReset1();	
              		

        },

        
        onCancel : function () {
           this.getOwnerComponent().getRouter().navTo("Customer");
        },


        onEdit: function () {
            this.getView().getModel("editModel").setProperty("/edit",true); 
        },

        onHelp: function (oEvent, sPopName) {
            DuplicateModel = CustomerModel;
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
					// oWhitespaceDialog.setTokens(this._oWhiteSpacesInput.getTokens());
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
						oTable.addColumn(new UIColumn({label: "국가/지역", template: oCounrtyTemplate }));
						oTable.addColumn(new UIColumn({label: "도시", template: oCityTemplate }));
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
							path: "CustomerModel>/",
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

        onCancelPress: function(){
            this.byId("RegionPop").close();
        },

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


        onConfirm : async function () {       
            var temp = {                
                
                authority_group : String(this.byId("authority_group").getValue()),                
                create_person : String(this.byId("create_person").getValue()),
                final_changer : String(this.byId("final_changer").getValue()),
                bp_number : String(this.byId("bp_number").getText()),
                customer_group : String(this.byId("customer_group").getValue()),
                cust_authority_group : String(this.byId("cust_authority_group").getValue()),
                deliverydate_rule : String(this.byId("deliverydate_rule").getValue()),
                group_key : String(this.byId("group_key").getValue()),
                supplier : String(this.byId("supplier").getValue()),
                proxy_payer : String(this.byId("proxy_payer").getValue()),
                payment_reason : String(this.byId("payment_reason").getValue()),
                holdorder : Boolean(this.byId("holdorder").getSelectedKey()),
                holdclaim : Boolean(this.byId("holdclaim").getValue()),
                holddelivery : Boolean(this.byId("holddelivery").getValue()),
                holdposting : Boolean(this.byId("holdposting").getValue()),
                classify_cust : String(this.byId("classify_cust").getText()),
                vat_duty : Boolean(this.byId("vat_duty").getValue()),
                postoffice_postal_number : String(this.byId("postoffice_postal_number").getValue()),
                comcode : String(this.byId("comcode").getValue()),
                bp_category : String(this.byId("bp_category").getText())
            
        
    

            }
            console.log(temp);
            let url = "/customer/Customer/" + temp.bp_number;
            await $.ajax({
                type : "patch",
                url : url,
                contentType: "application/json;IEEE754Compatible=true",
                data: JSON.stringify(temp)

            });
        
            this.onCancel();
        },


        onCancel : function () {
        this.getView().getModel("editModel").setProperty("/edit",false); 
        },

        
        oncellClick: function(oEvent){
            var oParams=oEvent.getParameters();            
            var rowIndex=oParams.rowIndex;
            var sPath = oParams.rowBindingContext.sPath;
            var selecteddata=this.getView().getModel("CustomerModel").getProperty(sPath);
            var selectedorg=selecteddata.org;
            var selectedbp_number=selecteddata.bp_number;
            this.byId("bpnumber_").setValue(selectedbp_number);
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
