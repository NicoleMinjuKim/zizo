sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
        },

        onhome: function (){
          this.getOwnerComponent().getRouter().navTo("home");
        },
        
        onCustomer: function(){
          this.getOwnerComponent().getRouter().navTo("Customer");
        },

        onGl: function(){
          this.getOwnerComponent().getRouter().navTo("Gl");
        }
      });
    }
  );
  