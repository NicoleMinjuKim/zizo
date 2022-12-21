sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/formatter"
], function (Controller, JSONModel, MessageBox, formatter) {
    "use strict";
    var SelectedNum;

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    return Controller.extend("project2.controller.customer_detail", {
        formatter: formatter,
        

        onInit: function() {

            this.getOwnerComponent()
                .getRouter()
                .getRoute("customer_detail")
                .attachPatternMatched(this.onMyRoutePatternMatched, this);

            this.getOwnerComponent()
                .getRouter()
                .getRoute("customer_detailexpand")
                .attachPatternMatched(this.onMyRoutePatternMatched2, this);
                
                var odata = {layout : false};
                let layoutModel = new JSONModel(odata);
                this.getView().setModel(layoutModel, "layout");
        },

        onMyRoutePatternMatched: async function(oEvent) {
            /**
             * b - boolean
             * i - number
             * s - string
             * a - array
             * o - object
             */

            const oArguments = oEvent.getParameter('arguments');
             
            SelectedNum = oEvent.getParameter("arguments").num;
            const Customer = await $.ajax({
              type:"get",
              url:"/customer/Customer/" + SelectedNum
            });
            console.log(Customer);
            let CustomerModel=new JSONModel(Customer);
            this.getView().setModel(CustomerModel, "CustomerModel");
            console.log(this.getView().getModel("CustomerModel"));

            

            let visible = {
                edit: false
            };

            var editModel = new JSONModel(visible);  
            this.getView().setModel(editModel, "editModel");
            this.getView().setModel(new JSONModel({}), 'historyModel');
            this.getView().getModel("layout").setProperty("/layout",false);

            
        },

        onMyRoutePatternMatched2: async function (oEvent) {
            SelectedNum = oEvent.getParameter("arguments").num;
            let url="/customer/Customer/"+SelectedNum;
            console.log(url);
            const Customer = await $.ajax({
                type: "get",
                url: url
            });
          
            let CustomerModel = new JSONModel(Customer);
            this.getView().setModel(CustomerModel,"CustomerModel");


            var visible = {
                footer : false
            }
            let visibleMode = new JSONModel(visible);

            this.getView().setModel(visibleMode, "visibleMode");
            this.getView().getModel("layout").setProperty("/layout",true);

        },

        onfull : function () {
            this.getOwnerComponent().getRouter().navTo("customer_detailexpand", {num:SelectedNum});
        },
        onexitfull : function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("customer_detail", {num:SelectedNum});
        },



        onEdit: function () {
            let oView = this.getView();
            
            oView.getModel("editModel").setProperty("/edit",true); 
            const oCustomerModel = oView.getModel('CustomerModel'),
            oHistoryModel = oView.getModel('historyModel');
      
      // 기존데이터를 히스토리 모델에 넣어놓는다.
      oHistoryModel.setProperty('/', $.extend({}, oCustomerModel.getData(), true));

            
        },

        onConfirm : async function () {
                
            
            debugger;
            var temp = {
                
                gender : String(this.byId("gender").getSelectedKey()),
                authority_group : String(this.byId("authority_group").getText()),
                birthday : String(this.byId("birthday").getValue()),
                create_person : String(this.byId("create_person").getValue()),
                create_date : String(this.byId("create_date").getValue()),
                final_changer : String(this.byId("final_changer").getValue()),
                final_change_date : String(this.byId("final_change_date").getValue()),
                bp_number : String(this.byId("bp_number").getText()),
                customer_group : String(this.byId("customer_group").getText()),
                first_name : String(this.byId("first_name").getValue()),
                deliverydate_rule : String(this.byId("deliverydate_rule").getValue()),
                group_key : String(this.byId("group_key").getText()),
                supplier : String(this.byId("supplier").getValue()),
                proxy_payer : String(this.byId("proxy_payer").getValue()),
                payment_reason : String(this.byId("payment_reason").getValue()),
                holdorder : (this.byId("holdorder").getSelectedKey() === 'true'), //boolean 형을 이렇게 바꿔야함. 
                holdclaim : (this.byId("holdclaim").getSelectedKey() === 'true'),
                holddelivery : (this.byId("holddelivery").getSelectedKey() === 'true'),
                holdposting : (this.byId("holdposting").getSelectedKey() === 'true'),
                classify_cust : String(this.byId("classify_cust").getText()),
                vat_duty : (this.byId("vat_duty").getSelectedKey() === 'true'),
                postoffice_postal_number : String(this.byId("postoffice_postal_number").getValue())
            
        
    

            }
            console.log(temp);
            let url = "/customer/Customer/" + temp.bp_number;
            try {
                
                await $.ajax({
                    type : "patch",
                    url : url,
                    contentType: "application/json;IEEE754Compatible=true",
                    data: JSON.stringify(temp)
                });
                
                MessageBox.success('변경 완료', {
                    onClose: function() {
                        this.getView().getModel("editModel").setProperty("/edit",false); 
                    }.bind(this)
                });

            } catch (error) {
                MessageBox.error('업데이트 실패');
            }
        },


        onCancel : function () {
            const oView = this.getView(),
                  oCustomerModel = oView.getModel('CustomerModel'),
                  oHistoryModel = oView.getModel('historyModel');
            
            oCustomerModel.setProperty('/', oHistoryModel.getData());
            this.getView().getModel("editModel").setProperty("/edit",false); 
        }, // oHistoryModel은 취소 클릭시, 원래의 값으로 돌려주기 위해 설정.

        onBack : function() {
            this.getOwnerComponent().getRouter().navTo("Customer");
        
        }






    
        
    });
});
