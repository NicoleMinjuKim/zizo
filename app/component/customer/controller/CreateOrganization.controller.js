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

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    return Controller.extend("project2.controller.CreateOrganization", {
        
        onInit: function() {
            this._initModel();

            this.getOwnerComponent()
                .getRouter()
                .getRoute("CreateOrganization")
                .attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

        _initModel: async function() {
            // model - 데이터를 저장 및 보관하는 역할 합니다.
            this.getView()
                .setModel(
                    new JSONModel({
                        bp_category: "2",
                        classify_cust: '조직'
                    }),
                    'CreateOrganization'
                );   
                
                const Customer = await $.ajax({
                    type:"get",
                    url:"/customer/Customer"
                });
        
                let CustomerModel = new JSONModel (Customer.value);
                this.getView().setModel(CustomerModel,'CustomerModel'); 
                //this.onReset();   
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

        onMyRoutePatternMatched: function(oEvent) {
            this._initModel();
            let oDay = new Date().getFullYear() + "-" + (new Date().getMonth()+1)+ "-" + (new Date().getDate());      // 생성일에 오늘날짜 들어오게 
			this.getView().getModel('CreateOrganization').setProperty('/create_date',oDay);
			this.getView().getModel('CreateOrganization').setProperty('/final_change_date',oDay);
        },

        onSave : async function () {
            const oView = this.getView(),
                  oCreateModel = oView.getModel('CreateOrganization'),
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
                "region": oCreateData.region || '',
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
                "holdorder":  oCreateData.holdorder === 'true',
                "holdclaim":  oCreateData.holdclaim === 'true',
                "holddelivery":  oCreateData.holddelivery === 'true',
                "holdposting":  oCreateData.holdposting === 'true',
                "classify_cust": oCreateData.classify_cust || '',
                "vat_duty": oCreateData.vat_duty === 'true',
                "postoffice_postal_number": oCreateData.postoffice_postal_number || '',
                "legal_state": oCreateData.legal_state || '',
                "foundation_day": oCreateData.foundation_day || '',
                "liquidation_day": oCreateData.liquidation_day || '',
            }

            console.log(createData);
            // console.log(this.byId("classifycust_").getSelectedKey());

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
            } else if (x==="CreateCustomer"){
                sap.ui.controller("project1.controller.App").onSelected("cm_create");
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

        onBack : function () {
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
            } else if (x==="CreateCustomer"){
                sap.ui.controller("project1.controller.App").onSelected("cm_create");
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
			
            this.onReset1();	

        },

        
        onCancel : function () {
            this.getOwnerComponent().getRouter().navTo("Customer");
        },


        onEdit: function () {
            this.getView().getModel("editModel").setProperty("/edit",true); 
        },

        onHelp: function () {
            var oCounrtyTemplate = new Text({text: {path: 'CustomerModel>country'}, renderWhitespace: true});
            var oCityTemplate = new Text({text: {path: 'CustomerModel>city'}, renderWhitespace: true});

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
                                path: "CustomerModel>/",
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
        },

        onReset1: function () {
			let oModel = this.getView().getModel('CreateOrganization');
			oModel.setProperty('/org', '');
			oModel.setProperty('/bp_number', '');
			oModel.setProperty('/address', '');
			oModel.setProperty('/bp_name', '');
			oModel.setProperty('/customer_group', '');
			oModel.setProperty('/house_num', '');
			oModel.setProperty('/create_date', '');
			oModel.setProperty('/cust_authority_group', '');
			oModel.setProperty('/potal_code', '');
			oModel.setProperty('/create_person', '');
			oModel.setProperty('/city', '');
            oModel.setProperty('/authority_group', '');
            oModel.setProperty('/supplier', '');
            oModel.setProperty('/country', '');
            oModel.setProperty('/affliation_com_num', '');
            oModel.setProperty('/proxy_payer', '');
            oModel.setProperty('/postoffice_postal_number', '');
            oModel.setProperty('/final_changer', '');
            oModel.setProperty('/payment_reason', '');
            oModel.setProperty('/final_change_date', '');
            oModel.setProperty('/holdorder', '');
            oModel.setProperty('/comcode', '');
            oModel.setProperty('/holdclaim', '');
            oModel.setProperty('/bp_category', '');
            oModel.setProperty('/holdposting', '');
            oModel.setProperty('/comcode', '');
            oModel.setProperty('/comcode', '');

			// this.byId('gl_account').setTokens([]);
			// this.byId('CoA').setTokens([]);
			// this.byId('accont_group').setTokens([]);
			this.byId('City').setTokens([]);
			this.byId('Region').setTokens([]);
		}    
        
    });
});
