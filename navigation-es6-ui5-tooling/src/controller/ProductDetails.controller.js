import Title from 'sap/m/Title';
import Text from 'sap/m/Text';
import Controller from "sap/ui/core/mvc/Controller";
import AppComponent from "../Component";
import JSONModel from 'sap/ui/model/json/JSONModel';
import Grid from 'sap/ui/layout/Grid';
/**
 * @namespace sap.ui.demo.controller
 */
export default class ProductDetails extends Controller {
   onInit () {
    const grid = this.createGrid();
    //const sPath = jQuery.sap.getModulePath("sap.ui.demo", "/model/product.json");
    const oModel = new JSONModel({});
   
    const productDetailsPanel = this.byId("productDetailsPanel");
    this.getView().setModel(oModel);
    productDetailsPanel.addContent(grid);
    const oRouter = this.getOwnerComponent().getRouter();
    oRouter.getRoute("ProductDetails").attachMatched(this.onMatched, this);
  }

   createGrid() {
    const productIdText = new Text({
      id: "productIdText",
      text: "{/ProductID}"
    });
    const productNameText = new Text({
      id: "productNameText",
      text: "{/ProductName}"

    });
    const quantityPerUnitText = new Text({
      id: "quantityPerUnitText",
      text: "{/QuantityPerUnit}"
    });
    const unitPriceText = new Text({
      id: "unitPriceText",
      text: "{/UnitPrice}"
    });
    return new Grid({
      defaultSpan: "XL2 L2 M2 S2",
      content: [
        productIdText,productNameText,
        quantityPerUnitText,unitPriceText
      ]
    });
  }
  
   onMatched(oEvent) {
    const selectedArguments = oEvent.getParameter("arguments");
    const productId = parseInt(selectedArguments.productID)
    const products = this.getOwnerComponent().getModel("productsData").getData();
    const product = products.find(product => product.ProductID === productId );
    const model = this.getView().getModel();
    model.setData(product);
  }

   onNavBack(){
    window.history.go(-1);
  }
}