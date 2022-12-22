sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/formatter"
], function (Controller, JSONModel, MessageBox, formatter) {
    "use strict";
    var SelectedNum;
    let Expandflag=false;
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    return Controller.extend("project2.controller.DetailOrganization", {
        formatter: formatter,
        
        
        onInit: function() {

            this.getOwnerComponent()
                .getRouter()
                .getRoute("DetailOrganization")
                .attachPatternMatched(this.onMyRoutePatternMatched, this);

                this.getOwnerComponent()
                .getRouter()
                .getRoute("DetailOrganizationexpand")
                .attachPatternMatched(this.onMyRoutePatternMatched2, this);
                
                var odata = {layout : false};
                let layoutModel = new JSONModel(odata);
                this.getView().setModel(layoutModel, "layout");

                let visible={
                    edit: false
                };
                var Model = new JSONModel(visible);  
                this.getView().setModel(Model, "editModel");
                
        },

        onMyRoutePatternMatched: async function(oEvent) {
            /**
             * b - boolean
             * i - number
             * s - string
             * a - array
             * o - object
             */
             if(Expandflag==true){
				Expandflag=false;
				this.getView().getModel('layout').setProperty("/layout", false);
				return;
			}

            // console.log(oEvent.getParameter('arguments'));
            

            const oArguments = oEvent.getParameter('arguments');
            
            SelectedNum = oEvent.getParameter("arguments").num;
            // let num = oArguments.num;
            // console.log(num);
            
            // let num = 100000009;
            const Customer=await $.ajax({
              type:"get",
              url:"/customer/Customer/" + SelectedNum
            });

            let CustomerModel = new JSONModel (Customer);

            this.getView().setModel(CustomerModel,'CustomerModel');

            let oDay = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
            this.getView().getModel('CustomerModel').setProperty('/final_change_date', oDay);   
            
            this.getView().setModel(new JSONModel({}), 'historyModel');
            this.getView().getModel("layout").setProperty("/layout",false);

            this.getView().getModel("editModel").setProperty("/edit",false);
        },

        onEdit: function () {
            let oView = this.getView();
            
            oView.getModel("editModel").setProperty("/edit",true); 
            const oCustomerModel = oView.getModel('CustomerModel'),
        oHistoryModel = oView.getModel('historyModel');

        oHistoryModel.setProperty('/', $.extend({}, oCustomerModel.getData(), true));

           
    },

    onMyRoutePatternMatched2 : async function (oEvent) {
        if(Expandflag==true){
            Expandflag=false;
            this.getView().getModel('layout').setProperty("/layout", true);
            return;
        }
        

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
        Expandflag=true;
        this.getOwnerComponent().getRouter().navTo("DetailOrganizationexpand", {num:SelectedNum});
    },
    onexitfull : function () {
        Expandflag=true;
        this.getOwnerComponent().getRouter().navTo("DetailOrganization", {num:SelectedNum});
    },






    onConfirm : async function () {           
        

        var temp = {           
            
            authority_group : String(this.byId("authority_group").getText()),            
            create_person : String(this.byId("create_person").getValue()),
            final_changer : String(this.byId("final_changer").getValue()),
            bp_number : String(this.byId("bp_number").getText()),
            customer_group : String(this.byId("customer_group").getText()),          
            deliverydate_rule : String(this.byId("deliverydate_rule").getValue()),
            group_key : String(this.byId("group_key").getText()),
            supplier : String(this.byId("supplier").getValue()),
            proxy_payer : String(this.byId("proxy_payer").getValue()),
            payment_reason : String(this.byId("payment_reason").getValue()),
            holdorder : (this.byId("holdorder").getSelectedKey() === 'true'),
            holdclaim : (this.byId("holdclaim").getSelectedKey() === 'true'),
            holddelivery : (this.byId("holddelivery").getSelectedKey() === 'true'),
            holdposting : (this.byId("holdposting").getSelectedKey() === 'true'),
            classify_cust : String(this.byId("classifycust_").getText()),
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
    oView.getModel("editModel").setProperty("/edit",false); 

},

onBack : function() {
    Expandflag=false;
    this.getOwnerComponent().getRouter().navTo("Customer");

}






    
        
    });
});
