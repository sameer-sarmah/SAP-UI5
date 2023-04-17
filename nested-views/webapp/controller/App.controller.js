sap.ui.define([
	"sap/ui/core/mvc/Controller","sap/ui/core/mvc/XMLView"
], function (Controller,XMLView) {
	"use strict";

	return Controller.extend("sap.ui.demo.controller.App", {

		onInit: function () {
			const view = this.getView();
			const helloViewPromise =  XMLView.create({
				viewName: "sap.ui.demo.view.HelloPanel"
			});
			const productViewPromise =  XMLView.create({
				viewName: "sap.ui.demo.view.Product"
			});
			$.when(helloViewPromise, productViewPromise).done(function (helloView,productView) {
				const page = view.byId("appPage");
				page.addContent(helloView);
				page.addContent(productView);
			});

		}
	});

});
