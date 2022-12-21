sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox"
    ],
    function(BaseController, MessageBox) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
          this.onMyRoutePatternMatched();
        },

        onhome: function (){
          this.getOwnerComponent().getRouter().navTo("home");
        
        },
        
        onCustomer: function(){

          const oLoginModel = this.getView().getModel('login');

          if(!oLoginModel.getProperty('/login')){
            return MessageBox.error('로그인이 되어있지 않습니다!\n :로그인이 필요합니다!');
          }
          this.getOwnerComponent().getRouter().navTo("Customer");
        
        },

        onGl: function(){

          const oLoginModel = this.getView().getModel('login');

          if(!oLoginModel.getProperty('/login')){
            return MessageBox.error('로그인이 되어있지 않습니다!\n :로그인이 필요합니다!');
          }
          this.getOwnerComponent().getRouter().navTo("Gl");
       
        },

        
        onItemSelect:function(oEvent){
          const oLoginModel = this.getView().getModel('login');

          if(!oLoginModel.getProperty('/login')){
            return MessageBox.error('로그인이 되어있지 않습니다!\n :로그인이 필요합니다!');
          }

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
            case "revenue_chart":
              this.getOwnerComponent().getRouter().navTo("Gl",{},{
                Gl:{
                  route:"GlChartFixFlex"
              }});
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
        },


        onlogin: function () {
          var oLoginModedl = this.getView().getModel('login')
          var username = this.getView().byId("inp_usernameId");
          var password = this.getView().byId("inp_passwordId");
    
          var user = "John" ;
          var pass = "1234";
       
    
    
          if (username.getValue() === "") {
            MessageBox.error("아이디를 입력하세요!");
            return;
          } else if (password.getValue() === "") {
            MessageBox.error("비밀번호를 입력하세요!");
            return;
          } else {
            if (username.getValue() === user && password.getValue() === pass) {
              MessageBox.success("로그인이 완료되었습니다", {
                onClose: function () {
                  oLoginModedl.setProperty('/login', true);
                  this.getOwnerComponent().getRouter().navTo("home");
                }.bind(this),
              });
            } else {
              MessageBox.error(" 등록되지 않은 계정입니다.");
            }
          }
        },

        onlogout: function () {
          var oLoginModedl = this.getView().getModel('login')

          MessageBox.success("로그아웃이 완료되었습니다", {
            onClose: function () {
              oLoginModedl.setProperty('/login', false);
              this.getOwnerComponent().getRouter().navTo("home");
            }.bind(this)
        })
      },


 

      onMyRoutePatternMatched:  async function() {
        const oLoginModel = this.getView().getModel('login');

        if(!oLoginModel.getProperty('/login')){ 
          this.getOwnerComponent().getRouter().navTo("home");
        }
   
     
      },

        
        
    

      

      });
    }
  );
  