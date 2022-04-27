import MessageBox from "sap/m/MessageBox";
import Controller from "sap/ui/core/mvc/Controller";
import AppComponent from "../Component";
import JSONModel from 'sap/ui/model/json/JSONModel';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import Table from 'sap/ui/table/Table';
import Icon from 'sap/ui/core/Icon';
import NavigationMode from 'sap/ui/table/NavigationMode';
import SelectionMode from 'sap/ui/table/SelectionMode';
import OverflowToolbar from 'sap/m/OverflowToolbar';
import Title from 'sap/m/Title';
import ToolbarSpacer from 'sap/m/ToolbarSpacer';
import Button from 'sap/m/Button';
import Label from 'sap/m/Label';
import Column from 'sap/ui/table/Column';
import Integer from 'sap/ui/model/type/Integer';


const filterCache = {};

/**
 * @namespace sap.ui.demo.controller
 */
 export default class Product extends Controller {

	 onInit()  {
		// apply content density mode to root view
	//	this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());
		const oModel = this.getOwnerComponent().getModel("productsData");
			this.getView().setModel(oModel);
			const page = this.createPage();
			const productPanel = this.byId("productPanel");
			productPanel.addContent(page);
	}

	 filterOnProductId(productIdQuery, productTable, filterCache) {
		const productIdFilter = new Filter({
			path: 'ProductId',
			operator: FilterOperator.EQ,
			value1: productIdQuery
		});
		const filters = [];
		filters.push(productIdFilter);
		filterCache['ProductId'] = productIdFilter;
		productTable.getBinding().filter(filters);
	}

	 onFilterHandler(evt) {
		console.log("On filter triggered");
		const params = evt.getParameters();
		const filteredColumn = params.column;
		const productTable = evt.getSource();
		const columns = productTable.getColumns();
		if (filteredColumn.getId() === "ProductID") {
			this.filterOnProductId(parseInt(params.value), productTable, filterCache);
		}
		else if (filteredColumn.getId() === "ProductName") {
			this.filterOnProductName(params.value, productTable, filterCache);
		}
	}

	 onBeforeRendering(){
		console.log("onBeforeRendering called")
	}
	
	 onAfterRendering(){
		console.log("onAfterRendering called")
	}

	 createPage () {
		this.oTable = this.createTable();
		this.oTable.bindAggregation("rows", "/");
		return this.oTable;
	}

	 onPress (oEvent) {
		var spath = oEvent.getSource().getBindingContext().getPath();
		var selectedProduct = oEvent.getSource().getBindingContext().getProperty(spath);
		//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.navTo("ProductDetails", {
			"productID": selectedProduct.ProductID
		});
	}

	 clearFilters(evt) {
		const productTable = this.oTable;
		const aColumns = productTable.getColumns();
		for (let i = 0; i < aColumns.length; i++) {
			productTable.filter(aColumns[i], null);
		}
	}



	 restoreFilters(evt) {
		const productTable = this.oTable;
		let filters = [];
		const filterNames = Object.keys(filterCache);
		if (filterNames && filterNames instanceof Array) {
			filters = filterNames.map(filterKey => filterCache[filterKey]);
		}
		productTable.getBinding().filter(filters);
	}

	 filterOnProductName(productNameQuery, productTable, filterCache) {
		const productNameFilter = new Filter({
			path: 'ProductName',
			operator: FilterOperator.Contains,
			value1: productNameQuery
		});
		const filters = [];
		filters.push(productNameFilter);
		filterCache['ProductName'] = productNameFilter;
		productTable.getBinding().filter(filters);
	}

	 createTable () {
		const icon = new Icon({
			press: this.onPress.bind(this),
			src: "sap-icon://navigation-right-arrow"
		});
		const table = new Table({
			filter: this.onFilterHandler.bind(this),
			enableCellFilter: true,
			selectionMode : SelectionMode.Single,
			navigationMode : NavigationMode.Paginator,
			extension: new OverflowToolbar({
				content: [new Title({
					text: "Products"
				}),
				new ToolbarSpacer(),
				new Button({
					icon: "sap-icon://decline",
					tooltip: "Clear filters",
					press: this.clearFilters.bind(this)
				}),
				new Button({
					icon: "sap-icon://cause",
					tooltip: "Restore filters",
					press: this.restoreFilters.bind(this)
				})]
			}),
			columns: [
				new Column({
					template: new Label({
						text: "{ProductID}"
					}),
					filterProperty: "ProductID",
					filtered: true,
					filterType: new Integer,
					defaultFilterOperator: "EQ",
					label: new Label({
						text: "ProductID"
					})
				}),
				new Column({
					template: new Label({
						text: "{ProductName}"
					}),
					filtered: true,
					filterProperty: "ProductName",
					label: new Label({
						text: "ProductName"
					})
				}),
				new Column({
					template: new Label({
						text: "{UnitPrice}"
					}),
					filtered: true,
					filterProperty: "UnitPrice",
					label: new Label({
						text: "UnitPrice"
					})
				}),
				new Column({
					label: new Label({text: " "}),
					width: "35px",
					template: icon
				})

			]
		});
		return table;
	}
}



