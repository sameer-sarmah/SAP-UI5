
const filterCache = {};
sap.ui.define([
	'sap/ui/core/mvc/Controller',"sap/ui/demo/model/MenuFactory","sap/ui/demo/model/ProductFactory","sap/ui/demo/model/product"
], function (Controller,MenuFactory,ProductFactory,product) {
	"use strict";
	return Controller.extend("sap.ui.demo.controller.Product", {

		onInit: function () {
			const MenuFactory = sap.ui.require('sap/ui/demo/model/MenuFactory');
			console.log(new MenuFactory().getMenus());
			const ProductFactory = sap.ui.require('sap/ui/demo/model/ProductFactory');
			console.log(new ProductFactory().getProduct());
			const product = sap.ui.require('sap/ui/demo/model/product');
			console.log(product);
			// sap.ui.require(["sap/ui/demo/model/MenuFactory"],function(MenuFactory){
			// 	console.log(new MenuFactory().getMenus());
			// },
			// function(error){
			// 	console.log(error);
			// }
			// );

			const oModel = this.getOwnerComponent().getModel("productsData");
			this.getView().setModel(oModel);
			const i18nModel = this.getOwnerComponent().getModel("i18n");
			this.getView().setModel(i18nModel, "i18n");
			const oBundle = i18nModel.getResourceBundle();
			const sMsg = oBundle.getText("productIdColumnHeaderText");
			const page = this.createPage();
			const productPanel = this.byId("productPanel");
			productPanel.addContent(page);
		},

		createTable: function () {
			const icon = new sap.ui.core.Icon({
				press: this.onPress.bind(this),
				src: "sap-icon://navigation-right-arrow"
			});
			const table = new sap.ui.table.Table({
				filter: this.onFilterHandler.bind(this),
				enableCellFilter: true,
				selectionMode : sap.ui.table.SelectionMode.Single,
				navigationMode : sap.ui.table.NavigationMode.Paginator,
				extension: new sap.m.OverflowToolbar({
					content: [new sap.m.Title({
						text: "Products"
					}),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						icon: "sap-icon://decline",
						tooltip: "Clear filters",
						press: this.clearFilters.bind(this)
					}),
					new sap.m.Button({
						icon: "sap-icon://cause",
						tooltip: "Restore filters",
						press: this.restoreFilters.bind(this)
					})]
				}),
				columns: [
					new sap.ui.table.Column({
						template: new sap.m.Label({
							text: "{ProductID}"
						}),
						filterProperty: "ProductID",
						filtered: true,
						filterType: new sap.ui.model.type.Integer,
						defaultFilterOperator: "EQ",
						label: new sap.m.Label({
							text: "{i18n>productIdColumnHeaderText}"
						})
					}),
					new sap.ui.table.Column({
						template: new sap.m.Label({
							text: "{ProductName}"
						}),
						filtered: true,
						filterProperty: "ProductName",
						label: new sap.m.Label({
							text: "{i18n>productNameColumnHeaderText}"
						})
					}),
					new sap.ui.table.Column({
						template: new sap.m.Label({
							text: "{UnitPrice}"
						}),
						filtered: true,
						filterProperty: "UnitPrice",
						label: new sap.m.Label({
							text: "{i18n>unitPriceColumnHeaderText}"
						})
					}),
					new sap.ui.table.Column({
						label: new sap.m.Label({text: " "}),
						width: "35px",
						template: icon
					})

				]
			});
			return table;
		},

		createPage: function () {
			this.oTable = this.createTable();
			this.oTable.bindAggregation("rows", "/");
			return this.oTable;
		},
		onPress: function (oEvent) {
			var spath = oEvent.getSource().getBindingContext().getPath();
			var selectedProduct = oEvent.getSource().getBindingContext().getProperty(spath);
			//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ProductDetails", {
				"productID": selectedProduct.ProductID
			});
		},

		clearFilters: function (evt) {
			const productTable = this.oTable;
			const aColumns = productTable.getColumns();
			for (let i = 0; i < aColumns.length; i++) {
				productTable.filter(aColumns[i], null);
			}
		},



		restoreFilters: function (evt) {
			const productTable = this.oTable;
			let filters = [];
			const filterNames = Object.keys(filterCache);
			if (filterNames && filterNames instanceof Array) {
				filters = filterNames.map(filterKey => filterCache[filterKey]);
			}
			productTable.getBinding().filter(filters);
		},

		filterOnProductName: function (productNameQuery, productTable, filterCache) {
			const productNameFilter = new sap.ui.model.Filter({
				path: 'ProductName',
				operator: sap.ui.model.FilterOperator.Contains,
				value1: productNameQuery
			});
			const filters = [];
			filters.push(productNameFilter);
			filterCache['ProductName'] = productNameFilter;
			productTable.getBinding().filter(filters);
		},

		filterOnProductId: function (productIdQuery, productTable, filterCache) {
			const productIdFilter = new sap.ui.model.Filter({
				path: 'ProductId',
				operator: sap.ui.model.FilterOperator.EQ,
				value1: productIdQuery
			});
			const filters = [];
			filters.push(productIdFilter);
			filterCache['ProductId'] = productIdFilter;
			productTable.getBinding().filter(filters);
		},

		onFilterHandler: function (evt) {
			console.log("On filter triggered");
			const params = evt.getParameters();
			const filteredColumn = params.column;
			const productTable = evt.getSource();
			const columns = productTable.getColumns();
			if (filteredColumn.getId() === "ProductID") {
				filterOnProductId(parseInt(params.value), productTable, filterCache);
			}
			else if (filteredColumn.getId() === "ProductName") {
				filterOnProductName(params.value, productTable, filterCache);
			}
		},
		onBeforeRendering:function(){
			console.log("onBeforeRendering called")
		},
		onAfterRendering:function(){
			console.log("onAfterRendering called")
		}
	});
});

