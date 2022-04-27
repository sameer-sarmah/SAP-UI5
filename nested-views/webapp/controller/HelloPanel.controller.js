sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/Button",
	"sap/m/Input",
	"sap/m/Text"
], function (Controller, MessageToast,Button,Input,Text) {
	"use strict";

	return Controller.extend("sap.ui.demo.controller.HelloPanel", {

		onShowHello : function () {
			// read msg from i18n model
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("helloMsg", [sRecipient]);

			// show message
			MessageToast.show(sMsg);
		},
		onInit:function(){
			const button = new Button({
				"text":"{i18n>showHelloButtonText}",
				"press":this.onShowHello.bind(this),
				"class":"myCustomButton"
			});

			const input = new Input({
				"value":"{/recipient/name}",
				"valueLiveUpdate":true,
				"width":"60%"
			});

			const text = new Text({
				"text":"Hello {/recipient/name}",
				"class":"sapUiSmallMargin sapThemeHighlight-asColor myCustomText"
			});
			const helloPanel = this.getView().getContent()[0];
			helloPanel.addContent(button);
			helloPanel.addContent(input);
			helloPanel.addContent(text);
		}
	});

});
