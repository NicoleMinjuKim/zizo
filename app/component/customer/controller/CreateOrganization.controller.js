sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
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

        _initModel: function() {
            // model - 데이터를 저장 및 보관하는 역할 합니다.
            this.getView()
                .setModel(
                    new JSONModel({}),
                    'CreateOrganization'
                );
        },

        onMyRoutePatternMatched: async function(oEvent) {
            /**
             * b - boolean
             * i - number
             * s - string
             * a - array
             * o - object
             */

            // const oArguments = oEvent.getParameter('arguments');
            
            // this.onDataView(oArguments.bpnum); 
            let num = 100000009;
            const Customer=await $.ajax({
              type:"get",
              url:"/customer/Customer/" + num
            });

            let CustomerModel = new JSONModel (Customer);
            this.getView().setModel(CustomerModel,'CustomerModel');

            

            let visible={
                edit: false
            };
            var Model = new JSONModel(visible);  
            this.getView().setModel(Model, "editModel");


            
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

            var createData = {
                "bp_number": oCreateData.bp_number || '',
                "comcode": oCreateData.comcode || '',
                "bp_name": oCreateData.bp_name || '',
                "address": oCreateData.address || '',
                "house_num": oCreateData.house_num || '',
                "potal_code": oCreateData.potal_code || '',
                "city": oCreateData.city || '',
                "country": oCreateData.country || '',
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
                "holdorder": oCreateData.holdorder || true,
                "holdclaim": oCreateData.holdclaim || true,
                "holddelivery": oCreateData.holddelivery || true,
                "holdposting": oCreateData.holdposting || true,
                "classify_cust": oCreateData.classify_cust || '',
                "vat_duty": oCreateData.vat_duty || true,
                "postoffice_postal_number": oCreateData.postoffice_postal_number || '',
                "legal_state": oCreateData.legal_state || '',
                "foundation_day": oCreateData.foundation_day || '',
                "liquidation_day": oCreateData.liquidation_day || '',
            }

            let url = "/customer/Customer";
            
            try {
                await $.ajax({
                    type : "post",
                    url : url,
                    contentType: "application/json;IEEE754Compatible=true",
                    data: JSON.stringify(createData)

                }).then((result) => { 
                    MessageBox.success('조직 데이터 생성 성공', {
                        onClose: function() {
                            window.history.back();
                        }
                    });
                });   
            } catch (error) {
                debugger;
                MessageBox.error('생성 실패!');
            }            
        },

        onBack : function () {
            this.getOwnerComponent().getRouter().navTo("Customer");
        },

        
        onCancel : function () {
            this.getOwnerComponent().getRouter().navTo("Customer");
        },


        onEdit: function () {
            this.getView().getModel("editModel").setProperty("/edit",true); 
        },

        onHelp: function () {
             
        },



        onConfirm : async function () {
                
            

            var temp = {
                
                
                authority_group : String(this.byId("authority_group").getValue()),
                
                create_person : String(this.byId("create_person").getValue()),
                create_date : String(this.byId("create_date").getValue()),
                final_changer : String(this.byId("final_changer").getValue()),
                final_change_date : String(this.byId("final_change_date").getValue()),
                bp_number : String(this.byId("bp_number").getText()),
                customer_group : String(this.byId("customer_group").getValue()),
                cust_authority_group : String(this.byId("cust_authority_group").getValue()),
                deliverydate_rule : String(this.byId("deliverydate_rule").getValue()),
                group_key : String(this.byId("group_key").getValue()),
                supplier : String(this.byId("supplier").getValue()),
                proxy_payer : String(this.byId("proxy_payer").getValue()),
                payment_reason : String(this.byId("payment_reason").getValue()),
                holdorder : Boolean(this.byId("holdorder").getValue()),
                holdclaim : Boolean(this.byId("holdclaim").getValue()),
                holddelivery : Boolean(this.byId("holddelivery").getValue()),
                holdposting : Boolean(this.byId("holdposting").getValue()),
                classify_cust : String(this.byId("classify_cust").getValue()),
                vat_duty : Boolean(this.byId("vat_duty").getValue()),
                postoffice_postal_number : String(this.byId("postoffice_postal_number").getValue())
            
        
    

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
        }






    
        
    });
});
