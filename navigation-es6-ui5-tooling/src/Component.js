import UIComponent from "sap/ui/core/UIComponent";
import { support } from "sap/ui/Device";


/**
 * @namespace sap.ui.demo
 */
export default class Component extends UIComponent {

	static metadata = {
		manifest: "json"
	};

	init()  {
		// call the base component's init function
		super.init();
		UIComponent.prototype.init.apply(this, arguments);
		this.getRouter().initialize();
	}
}
