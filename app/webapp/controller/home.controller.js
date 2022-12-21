sap.ui.define([
    "sap/ui/core/mvc/Controller",
    
   
	
	
], function(
    Controller, 
	
) {
    "use strict";

	return Controller.extend("project1.controller.home", {
    onInit: function () {
                

    },

    // onlogin: function () {
    //   var oLoginModedl = this.getView().getModel('login')
    //   var username = this.getView().byId("inp_usernameId");
    //   var password = this.getView().byId("inp_passwordId");

    //   var user = "John" ;
    //   var pass = "1234";
   


    //   if (username.getValue() === "") {
    //     MessageBox.error("아이디를 입력하세요!");
    //     return;
    //   } else if (password.getValue() === "") {
    //     MessageBox.error("비밀번호를 입력하세요!");
    //     return;
    //   } else {
    //     if (username.getValue() === user && password.getValue() === pass) {
    //       MessageBox.success("로그인성공!", {
    //         onClose: function () {
    //           oLoginModedl.setProperty('/login', true);
    //           this.getOwnerComponent().getRouter().navTo("team");
    //         }.bind(this),
    //       });
    //     } else {
    //       MessageBox.error(" 등록되지 않은 계정입니다.");
    //     }
    //   }
    // },
    onAboutUs: function () {
      this.getOwnerComponent().getRouter().navTo("team");
    },

   
    
  });
  
});