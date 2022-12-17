sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    return Controller.extend("project2.controller.DetailOrganization", {
        onInit: function() {

            this.getOwnerComponent()
                .getRouter()
                .getRoute("DetailOrganization")
                .attachPatternMatched(this.onMyRoutePatternMatched, this);
                
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

            // let num = oArguments.num;
            
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



        onEdit: function () {
            let oView = this.getView();

            oView.getModel("editModel").setProperty("/edit",true); 

            const oCustomerModel = oView.getModel('CustomerModel'),
                  oHistoryModel = oView.getModel('historyModel');

                  oHistoryModel.setProperty('/', $.extend({}, oCustomerModel.getData(), true));
    },






    onConfirm : async function () {
            
        

        var temp = {
            
            
            authority_group : String(this.byId("authority_group").getText()),            
            create_person : String(this.byId("create_person").getValue()),
            create_date : String(this.byId("create_date").getValue()),
            final_changer : String(this.byId("final_changer").getValue()),
            final_change_date : String(this.byId("final_change_date").getValue()),
            bp_number : String(this.byId("bp_number").getText()),
            customer_group : String(this.byId("customer_group").getText()),          
            deliverydate_rule : String(this.byId("deliverydate_rule").getValue()),
            group_key : String(this.byId("group_key").getText()),
            supplier : String(this.byId("supplier").getValue()),
            proxy_payer : String(this.byId("proxy_payer").getValue()),
            payment_reason : String(this.byId("payment_reason").getValue()),
            holdorder : Boolean(this.byId("holdorder").getSelectedKey()),
            holdclaim : Boolean(this.byId("holdclaim").getSelectedKey()),
            holddelivery : Boolean(this.byId("holddelivery").getSelectedKey()),
            holdposting : Boolean(this.byId("holdposting").getSelectedKey()),
            classify_cust : String(this.byId("classify_cust").getText()),
            vat_duty : Boolean(this.byId("vat_duty").getSelectedKey()),
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
