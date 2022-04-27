
const serviceUrl = "https://cors-anywhere.herokuapp.com/services.odata.org/Northwind/Northwind.svc/Products?$format=json&";
const countUrl = "https://cors-anywhere.herokuapp.com/services.odata.org/Northwind/Northwind.svc/Products/$count";
sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'../util/util'
], function (Controller, JSONModel,ProductUtil) {
	"use strict";
	console.log(ProductUtil);
	return Controller.extend("Product.controller.Product", {

		onInit: function () {
			 console.log(ProductUtil);
			 this.createTable();
			 
		},

		createTable: function () {
			const controller = this;
			let totalCount = 0;
			const oTable = new sap.m.Table("tableID", {
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

			const oTemplate = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Label({
						text: "{test>ProductID}"
					}),
					new sap.m.Label({
						text: "{test>ProductName}"
					}),
					new sap.m.Label({
						text: "{test>UnitPrice}"
					})
				],
				type: "Navigation"
			});

			const model = new JSONModel();
			model.setData([]);
			oTable.setModel(model,"test");
			oTable.bindAggregation("items", "test>/", oTemplate);

			const section = new sap.uxap.ObjectPageSection({
				title: "section",
				subSections: [
					new sap.uxap.ObjectPageSubSection({
						title: "subsection",
						blocks: [oTable]
					})
				]
			});
			const page = new sap.uxap.ObjectPageLayout({
				headerTitle: new sap.uxap.ObjectPageHeader({
					objectTitle: "Object"
				}),
				sections: [section]
			});
			page.setModel(model, "test");

			const successHandler =  (data) => {
				const cumulatedArr = [...oTable.getModel("test").getData(), ...data.value];
				oTable.getModel("test").setData(cumulatedArr);
			};
			const getTotalCount = (data) => {
				console.log(data);
				totalCount = parseInt(data);
				oTable._oGrowingDelegate._getListItemInfo = function () {
					return ("[ " + oTable._oGrowingDelegate._iRenderedDataItems + " / " + totalCount + " ]");
				};
			};

			const onUpdateStarted = (event) => {
				const reason = event.getParameter("reason");
				if (reason === "Growing") {
					oTable.setBusy(true);
					let itemsInTable = 0;
					itemsInTable = Object.keys(oTable.getModel("test").getData()).length;
					const url = serviceUrl + "$skip=" + itemsInTable + "&$top=5";
					ProductUtil.getProductData(url, successHandler, oTable);
					console.log("exiting update started");
					itemsInTable = Object.keys(oTable.getModel("test").getData()).length;
					if (itemsInTable === totalCount) {
						oTable._oGrowingDelegate._oTrigger.setActive(false);
					}
					oTable.setBusy(false);
				}
			};
			const onUpdateFinished = function (event) {
				const reason = event.getParameter("reason");

				if (reason === "Growing") {
					console.log(reason);
				}
			};
			const onGrowingFinished = function (event) {
				console.log(event);
			};
			oTable.attachEvent("updateStarted", onUpdateStarted.bind(oTable));
			oTable.attachEvent("updateFinished", onUpdateFinished.bind(oTable));
			oTable.attachEvent("growingFinished", onGrowingFinished.bind(oTable));
			oTable.addEventDelegate({ onAfterRendering: function () { console.log("rendering called for the table") } });
			let url = serviceUrl + "$skip=0&$top=6";
			ProductUtil.getProductData(countUrl, getTotalCount, oTable);
			ProductUtil.getProductData(url, successHandler, oTable);
			page.placeAt('content');


		}




	});
});

