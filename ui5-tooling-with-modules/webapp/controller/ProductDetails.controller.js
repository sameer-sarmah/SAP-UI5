
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
  "use strict";

  return Controller.extend("sap.ui.demo.controller.ProductDetails", {

    onInit: function () {
      const grid = this.createGrid();
      //const sPath = jQuery.sap.getModulePath("sap.ui.demo", "/model/product.json");
      const oModel = new JSONModel({});
     
      const productDetailsPanel = this.byId("productDetailsPanel");
      this.getView().setModel(oModel);
      productDetailsPanel.addContent(grid);
      const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("ProductDetails").attachMatched(this.onMatched, this);
    },

    createGrid() {
      const productIdText = new sap.m.Text({
        id: "productIdText",
        text: "{/ProductID}"
      });
      const productNameText = new sap.m.Text({
        id: "productNameText",
        text: "{/ProductName}"

      });
      const quantityPerUnitText = new sap.m.Text({
        id: "quantityPerUnitText",
        text: "{/QuantityPerUnit}"
      });
      const unitPriceText = new sap.m.Text({
        id: "unitPriceText",
        text: "{/UnitPrice}"
      });
      return new sap.ui.layout.Grid({
        defaultSpan: "XL2 L2 M2 S2",
        content: [
          productIdText,productNameText,
          quantityPerUnitText,unitPriceText
        ]
      });
    },
    
		onMatched: function(oEvent) {
			const selectedArguments = oEvent.getParameter("arguments");
			const productId = parseInt(selectedArguments.productID)
      const products = this.getOwnerComponent().getModel("productsData").getData();
      const product = products.find(product => product.ProductID === productId );
		  const model = this.getView().getModel();
			model.setData(product);
		},
    onNavBack: function(){
      window.history.go(-1);
    }
  });

});