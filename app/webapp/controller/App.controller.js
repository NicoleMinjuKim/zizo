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
        },

        
        onItemSelect:function(oEvent){
          switch(oEvent.getParameters().item.mProperties.key){
            case "cm_display":
              this.getOwnerComponent().getRouter().navTo("Customer",{},{
                Customer:{
                  route:"Customer"
              }});
            break;
            case "gl_display":
              this.getOwnerComponent().getRouter().navTo("Gl",{},{
                Gl:{
                  route:"Gl"
              }});
            break;
            case "gl_create":
              this.getOwnerComponent().getRouter().navTo("Gl",{},{
                Gl:{
                  route:"CreateGl"
              }});
            break;
            case "cm_create":
              this.getOwnerComponent().getRouter().navTo("Customer",{},{
                Customer:{
                  route:"CreateCustomer"
              }});
            break;
            case "org_create":
              this.getOwnerComponent().getRouter().navTo("Customer",{},{
                Customer:{
                  route:"CreateOrganization"
              }});
            break;
            case "cus_chart":
              this.getOwnerComponent().getRouter().navTo("Customer",{},{
                Customer:{
                  route:"Customer_chart"
              }});
            break;
            case "COA_view":
              this.getOwnerComponent().getRouter().navTo("Gl",{},{
                Gl:{
                  route:"CoA"
              }});
            break;
            case "glchart_view":
              this.getOwnerComponent().getRouter().navTo("Gl",{},{
                Gl:{
                  route:"Gl_chart"
              }});
            break;
            case "mainhome_display":
              this.getOwnerComponent().getRouter().navTo("home");
            break;
            case "teampage_view":
              this.getOwnerComponent().getRouter().navTo("team");
            break;
            
          

            // case "GL_home":
            //   if(!window.location.hash){
            //     window.location.href = window.location.href + '/Gl';

            //   } else {
            //   this.getOwnerComponent().getRouter().navTo("Gl",{},{
            //     Gl:{
            //       route:"gl_home"
            //     }
            //   });
            // }
            // break;
            // case "CUST_home":
            //   // window.location.hash 라는 걸 써서 라우팅하는 것처럼 만듬.
            //   if(!window.location.hash){
            //     window.location.href = window.location.href + '/Customer';
            //   } else {
            //     this.getOwnerComponent().getRouter().navTo("Customer",{},{
            //       Customer:{
            //         route:"customer_home"
            //       }
            //     });
            //   }
            // break;

          }
        },

        onSideNavButtonPress: function () {
          var oToolPage = this.byId("toolPage");
          var bSideExpanded = oToolPage.getSideExpanded();
    
          this._setToggleButtonTooltip(bSideExpanded);
    
          oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },

        _setToggleButtonTooltip: function (bLarge) {
          var oToggleButton = this.byId('sideNavigationToggleButton');
          if (bLarge) {
            oToggleButton.setTooltip('Large Size Navigation');
          } else {
            oToggleButton.setTooltip('Small Size Navigation');
          }
        }
    

       

      });
    }
  );
  