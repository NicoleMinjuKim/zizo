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
      
        false: 0,
        falsepercent: '',
        true: 0,
        truepercent: '',
        
    };

    var oModel = new JSONModel(oData);
    this.getView().setModel(oModel, "open");
    this.onDataView();


},

onGlhome: function() {
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
  let a = 0.00, b = 0.00 ;
  for (let i = 0; i < data.oData.length; i++) {
      let open = '/' + i + '/opendata'
      console.log(open)
      if (data.getProperty(open) === false) {
          a++;
         
      }
      if (data.getProperty(open) === true ){
        b++;

      }
      console.log(data)
    
  }
  view.getModel("open").setProperty("/false", a / data.oData.length * 100);
  view.getModel("open").setProperty("/true", b / data.oData.length * 100);
  view.getModel("open").setProperty("/falsepercent", (a / data.oData.length * 100) + '%');
  view.getModel("open").setProperty("/truepercent", (b / data.oData.length * 100) + '%');
  console.log(view.getModel("open")) 
}

});
});
