

sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.controller.Product", {

		onInit: function () {
			const oModel = this.getOwnerComponent().getModel("productsData");
			this.getView().setModel(oModel);
			const page = this.createPage();
			const productPanel = this.byId("productPanel");
			productPanel.addContent(page);
		},

		createColumnTemplate: function(){
			return new sap.m.ColumnListItem({
				cells: [
					new sap.m.Label({
						text: "{ProductID}"
					}),
					new sap.m.Label({
						text: "{ProductName}"
					}),
					new sap.m.Label({
						text: "{UnitPrice}"
					})
				],
				type: "Navigation",
				press:this.onPress.bind(this)
			});
		},
		createTable: function () {
			
			return new sap.m.Table( {
				growing: true,
				growingScrollToLoad: false,
				growingThreshold: 5,
				growingTriggerText: "Show More",
				mode: "MultiSelect",
				columns: [
					new sap.m.Column({
						header: new sap.m.Label({
							text: "ProductID"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "ProductName"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "UnitPrice"
						})
					})

				]
			});

		},

		createPage: function(){
			const oTable = this.createTable();
			const oTemplate = this.createColumnTemplate();
			oTable.bindAggregation("items", "/", oTemplate);
			return oTable;
		},
		onPress: function(oEvent) {
			var spath = oEvent.getSource().getBindingContext().getPath();
			var selectedProduct = oEvent.getSource().getBindingContext().getProperty(spath);
			//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ProductDetails", {
				"productID": selectedProduct.ProductID
			});
		}

	});
});

