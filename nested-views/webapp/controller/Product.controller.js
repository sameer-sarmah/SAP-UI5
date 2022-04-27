
const serviceUrl = "https://cors-anywhere.herokuapp.com/services.odata.org/Northwind/Northwind.svc/Products?$format=json&";
const countUrl = "https://cors-anywhere.herokuapp.com/services.odata.org/Northwind/Northwind.svc/Products/$count";
const products =  [
	{
		"ProductID": 1,
		"ProductName": "Chai",
		"SupplierID": 1,
		"CategoryID": 1,
		"QuantityPerUnit": "10 boxes x 20 bags",
		"UnitPrice": "18.0000",
		"UnitsInStock": 39,
		"UnitsOnOrder": 0,
		"ReorderLevel": 10,
		"Discontinued": false
	},
	{
		"ProductID": 2,
		"ProductName": "Chang",
		"SupplierID": 1,
		"CategoryID": 1,
		"QuantityPerUnit": "24 - 12 oz bottles",
		"UnitPrice": "19.0000",
		"UnitsInStock": 17,
		"UnitsOnOrder": 40,
		"ReorderLevel": 25,
		"Discontinued": false
	},
	{
		"ProductID": 3,
		"ProductName": "Aniseed Syrup",
		"SupplierID": 1,
		"CategoryID": 2,
		"QuantityPerUnit": "12 - 550 ml bottles",
		"UnitPrice": "10.0000",
		"UnitsInStock": 13,
		"UnitsOnOrder": 70,
		"ReorderLevel": 25,
		"Discontinued": false
	},
	{
		"ProductID": 4,
		"ProductName": "Chef Anton's Cajun Seasoning",
		"SupplierID": 2,
		"CategoryID": 2,
		"QuantityPerUnit": "48 - 6 oz jars",
		"UnitPrice": "22.0000",
		"UnitsInStock": 53,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": false
	},
	{
		"ProductID": 5,
		"ProductName": "Chef Anton's Gumbo Mix",
		"SupplierID": 2,
		"CategoryID": 2,
		"QuantityPerUnit": "36 boxes",
		"UnitPrice": "21.3500",
		"UnitsInStock": 0,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": true
	},
	{
		"ProductID": 6,
		"ProductName": "Grandma's Boysenberry Spread",
		"SupplierID": 3,
		"CategoryID": 2,
		"QuantityPerUnit": "12 - 8 oz jars",
		"UnitPrice": "25.0000",
		"UnitsInStock": 120,
		"UnitsOnOrder": 0,
		"ReorderLevel": 25,
		"Discontinued": false
	},
	{
		"ProductID": 7,
		"ProductName": "Uncle Bob's Organic Dried Pears",
		"SupplierID": 3,
		"CategoryID": 7,
		"QuantityPerUnit": "12 - 1 lb pkgs.",
		"UnitPrice": "30.0000",
		"UnitsInStock": 15,
		"UnitsOnOrder": 0,
		"ReorderLevel": 10,
		"Discontinued": false
	},
	{
		"ProductID": 8,
		"ProductName": "Northwoods Cranberry Sauce",
		"SupplierID": 3,
		"CategoryID": 2,
		"QuantityPerUnit": "12 - 12 oz jars",
		"UnitPrice": "40.0000",
		"UnitsInStock": 6,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": false
	},
	{
		"ProductID": 9,
		"ProductName": "Mishi Kobe Niku",
		"SupplierID": 4,
		"CategoryID": 6,
		"QuantityPerUnit": "18 - 500 g pkgs.",
		"UnitPrice": "97.0000",
		"UnitsInStock": 29,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": true
	},
	{
		"ProductID": 10,
		"ProductName": "Ikura",
		"SupplierID": 4,
		"CategoryID": 8,
		"QuantityPerUnit": "12 - 200 ml jars",
		"UnitPrice": "31.0000",
		"UnitsInStock": 31,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": false
	},
	{
		"ProductID": 11,
		"ProductName": "Queso Cabrales",
		"SupplierID": 5,
		"CategoryID": 4,
		"QuantityPerUnit": "1 kg pkg.",
		"UnitPrice": "21.0000",
		"UnitsInStock": 22,
		"UnitsOnOrder": 30,
		"ReorderLevel": 30,
		"Discontinued": false
	},
	{
		"ProductID": 12,
		"ProductName": "Queso Manchego La Pastora",
		"SupplierID": 5,
		"CategoryID": 4,
		"QuantityPerUnit": "10 - 500 g pkgs.",
		"UnitPrice": "38.0000",
		"UnitsInStock": 86,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": false
	},
	{
		"ProductID": 13,
		"ProductName": "Konbu",
		"SupplierID": 6,
		"CategoryID": 8,
		"QuantityPerUnit": "2 kg box",
		"UnitPrice": "6.0000",
		"UnitsInStock": 24,
		"UnitsOnOrder": 0,
		"ReorderLevel": 5,
		"Discontinued": false
	},
	{
		"ProductID": 14,
		"ProductName": "Tofu",
		"SupplierID": 6,
		"CategoryID": 7,
		"QuantityPerUnit": "40 - 100 g pkgs.",
		"UnitPrice": "23.2500",
		"UnitsInStock": 35,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": false
	},
	{
		"ProductID": 15,
		"ProductName": "Genen Shouyu",
		"SupplierID": 6,
		"CategoryID": 2,
		"QuantityPerUnit": "24 - 250 ml bottles",
		"UnitPrice": "15.5000",
		"UnitsInStock": 39,
		"UnitsOnOrder": 0,
		"ReorderLevel": 5,
		"Discontinued": false
	},
	{
		"ProductID": 16,
		"ProductName": "Pavlova",
		"SupplierID": 7,
		"CategoryID": 3,
		"QuantityPerUnit": "32 - 500 g boxes",
		"UnitPrice": "17.4500",
		"UnitsInStock": 29,
		"UnitsOnOrder": 0,
		"ReorderLevel": 10,
		"Discontinued": false
	},
	{
		"ProductID": 17,
		"ProductName": "Alice Mutton",
		"SupplierID": 7,
		"CategoryID": 6,
		"QuantityPerUnit": "20 - 1 kg tins",
		"UnitPrice": "39.0000",
		"UnitsInStock": 0,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": true
	},
	{
		"ProductID": 18,
		"ProductName": "Carnarvon Tigers",
		"SupplierID": 7,
		"CategoryID": 8,
		"QuantityPerUnit": "16 kg pkg.",
		"UnitPrice": "62.5000",
		"UnitsInStock": 42,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": false
	},
	{
		"ProductID": 19,
		"ProductName": "Teatime Chocolate Biscuits",
		"SupplierID": 8,
		"CategoryID": 3,
		"QuantityPerUnit": "10 boxes x 12 pieces",
		"UnitPrice": "9.2000",
		"UnitsInStock": 25,
		"UnitsOnOrder": 0,
		"ReorderLevel": 5,
		"Discontinued": false
	},
	{
		"ProductID": 20,
		"ProductName": "Sir Rodney's Marmalade",
		"SupplierID": 8,
		"CategoryID": 3,
		"QuantityPerUnit": "30 gift boxes",
		"UnitPrice": "81.0000",
		"UnitsInStock": 40,
		"UnitsOnOrder": 0,
		"ReorderLevel": 0,
		"Discontinued": false
	}
]
;
sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.controller.Product", {

		onInit: function () {
			const oModel = new JSONModel(products);
			this.getView().setModel(oModel);
			const page = this.createPage();
			const productPanel = this.getView().getContent()[0];
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
				type: "Navigation"
			});
		},
		createTable: function () {
			
			return new sap.m.Table("productTable", {
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
			// const section = this.createSection(oTable);
			// const page = new sap.uxap.ObjectPageLayout({
			// 	id:"productPage",
			// 	headerTitle: new sap.uxap.ObjectPageHeader({
			// 		objectTitle: "Object"
			// 	}),
			// 	sections: [section]
			// });
			const oTemplate = this.createColumnTemplate();
			oTable.bindAggregation("items", "/", oTemplate);
			return oTable;
		},
		enableGrowingFeature: function(oTable){
			const getProductData = (url, onSuccess, context) => {
				return $.ajax({
					type: "GET",
					url: url,
					async: true,
					success: onSuccess.bind(context)
				});
			};

			const successHandler =  (data) => {
				const cumulatedArr = [...oTable.getModel().getData(), ...data.value];
				oTable.getModel().setData(cumulatedArr);
			};

			const getTotalCount = (data) => {
				console.log(data);
				totalCount = parseInt(data);
				oTable._oGrowingDelegate._getListItemInfo = function () {
					return ("[ " + oTable._oGrowingDelegate._iRenderedDataItems + " / " + totalCount + " ]");
				};
			};


			const onGrowingFinished = function (event) {
				console.log(event);
			};
			oTable.attachEvent("updateStarted", this.onUpdateStarted.bind(oTable));
			oTable.attachEvent("updateFinished", this.onUpdateFinished.bind(oTable));
			oTable.attachEvent("growingFinished", onGrowingFinished.bind(oTable));
			oTable.addEventDelegate({ onAfterRendering: function () { console.log("rendering called for the table") } });
			let url = serviceUrl + "$skip=0&$top=6";
			getProductData(countUrl, getTotalCount, oTable);
			getProductData(url, successHandler, oTable);
		},
		createSection: function(oTable){
			
			return new sap.uxap.ObjectPageSection({
				title: "section",
				subSections: [
					new sap.uxap.ObjectPageSubSection({
						title: "",
						blocks: [oTable]
					})
				]
			});
			
		},
	  onUpdateStarted : function(event) {
			const reason = event.getParameter("reason");
			if (reason === "Growing") {
				oTable.setBusy(true);
				let itemsInTable = 0;
				itemsInTable = Object.keys(oTable.getModel("test").getData()).length;
				const url = serviceUrl + "$skip=" + itemsInTable + "&$top=5";
				getProductData(url, successHandler, oTable);
				console.log("exiting update started");
				itemsInTable = Object.keys(oTable.getModel("test").getData()).length;
				if (itemsInTable === totalCount) {
					oTable._oGrowingDelegate._oTrigger.setActive(false);
				}
				oTable.setBusy(false);
			}
		},
		onUpdateFinished : function (event) {
			const reason = event.getParameter("reason");

			if (reason === "Growing") {
				console.log(reason);
			}
		}




	});
});

