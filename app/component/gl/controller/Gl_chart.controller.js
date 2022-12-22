sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (
    Controller,JSONModel) {
"use strict";

return Controller.extend("project3.controller.Gl_chart", {

  
  
onInit: function() {

    var oData=
    {
      
        true: 0,
        truepercent: '',
        false: 0,
        falsepercent: '',
        null: 0,
        nullpercent: '',
        
    };

    var oModel = new JSONModel(oData);
    this.getView().setModel(oModel, "open");
    this.onDataView();


},

onGlhome: function() {
  sap.ui.controller("project1.controller.App").onSelected("GL_home");
  this.getOwnerComponent().getRouter().navTo("gl_home")
 },

 onDataView: async function () {
  var view = this.getView()
  const Gl = await $.ajax({
    type: "get",
    url: "/gl/Gl"
  })
  
  let GlModel = new JSONModel(Gl.value);
  view.setModel(GlModel, "GlModel");
  let data = view.getModel("GlModel");
  let a = 0.00, b = 0.00, c = 0.00 ;
  for (let i = 0; i < data.oData.length; i++) {
      let open = '/' + i + '/opendata'
      console.log(open)
      if (data.getProperty(open) === true) {
          a++;
         
      }
      if (data.getProperty(open) === false){
        b++;

      }
      if (data.getProperty(open) === null){
        c++;

      }
      console.log(data)
    
  }
  view.getModel("open").setProperty("/true", parseInt((a / data.oData.length * 100).toFixed(2)));
  view.getModel("open").setProperty("/false", parseInt((b / data.oData.length * 100).toFixed(2)));
  view.getModel("open").setProperty("/null", parseInt((c / data.oData.length * 100).toFixed(2)));
  view.getModel("open").setProperty("/truepercent", (a / data.oData.length * 100).toFixed(2) + '%' );
  view.getModel("open").setProperty("/falsepercent", (b / data.oData.length * 100).toFixed(2) + '%' );
  view.getModel("open").setProperty("/nullpercent", (c / data.oData.length * 100).toFixed(2) + '%' );

  
  console.log(view.getModel("open")) 
},



});
});
