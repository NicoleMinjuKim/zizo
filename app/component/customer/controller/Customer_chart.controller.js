sap.ui.define([
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel"
], function (
      Controller,JSONModel) {
  "use strict";

  return Controller.extend("project2.controller.Customer_chart", {

    onInit: function() {
      var oData=
      {
          person: 0,
          personpercent: '',
          organization: 0,
          organizationpercent: '',
          
      };

      var oModel = new JSONModel(oData);
      this.getView().setModel(oModel, "category");
      this.onDataView();


  },

   onCustomerhome: function() {
    this.getOwnerComponent().getRouter().navTo("customer_home")
   },

   onDataView: async function () {
    var view = this.getView()
    const Customer = await $.ajax({
      type: "get",
      url: "/customer/Customer"
    })
    
    let CustomerModel = new JSONModel(Customer.value);
    view.setModel(CustomerModel, "CustomerModel");
    let data = view.getModel("CustomerModel");
    let a = 0.00, b = 0.00 ;
    for (let i = 0; i < data.oData.length; i++) {
        let category = '/' + i + '/bp_category'
        if (data.getProperty(category) === '1') {
            a++;
        }
        if (data.getProperty(category) === '2') {
            b++;
        }
      
    }
    view.getModel("category").setProperty("/person", a / data.oData.length * 100);
    view.getModel("category").setProperty("/organization", b / data.oData.length * 100);
    view.getModel("category").setProperty("/personpercent", (a / data.oData.length * 100) + '%');
    view.getModel("category").setProperty("/organizationpercent", (b / data.oData.length * 100) + '%');
}

  });
});
