const FILTER_CONFIG_MODEL = "filterConfigModel";
const EVENT_META_MODEL = 'eventMetadataModel';

const destinationCode = "SCP_TASK_CENTER";
sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/demo/json/FilterConfig",
    "sap/ui/demo/json/EventMetadata",
    "sap/ui/demo/json/SupportedFilters",
    "sap/ui/demo/util/Util",
    "sap/ui/demo/view/FilterFormCreator"
], function (Controller,filterConfigs,eventMetadata,supportedFilters,util,FilterFormCreator) {
	"use strict";

	return Controller.extend("sap.ui.demo.controller.Filter", {

		onInit: function () {
            
            const eventMetadataModel = new sap.ui.model.json.JSONModel();
            eventMetadataModel.setData(eventMetadata);
            const supportedFiltersModel = new sap.ui.model.json.JSONModel();
            supportedFiltersModel.setData(supportedFilters);
            const filterConfigModel = new sap.ui.model.json.JSONModel();
       
            this.getView().setModel(eventMetadataModel,EVENT_META_MODEL);
            this.getView().setModel(supportedFiltersModel,"supportedFiltersModel");
            this.getView().setModel(filterConfigModel,FILTER_CONFIG_MODEL);
            const formCreator = this.getFilterForm();
            const form = this.getView().byId("filterForm");
            this.destinationCodeFilterParamMap = util.createDestinationCodeFilterParamMapping(eventMetadata,supportedFilters);
            const formContainers = formCreator.createEventFormContainers(filterConfigs,this);
            formContainers.forEach((formContainer) => form.addFormContainer(formContainer));
            
            this.selectedFilterConfig = filterConfigs[0];
            this.createFilterSetForm(this.selectedFilterConfig);
            this.setModel(this.selectedFilterConfig,FILTER_CONFIG_MODEL);
		},
        setModel:function(data,modelName){
          const model =  this.getView().getModel(modelName);
          model.setData(data);
        },
        onBeforeRendering: function(){
            console.log("onBeforeRendering completed");
        },
        onAfterRendering: function(){
            console.log("onAfterRendering completed");
        },
        fieldDropdownHandler :function(filterSetIndex,filterIndexInFilterSet,event){
            const fieldOperand = event.getParameters().selectedItem.getKey();
            this.setFilterFieldOperand(fieldOperand,destinationCode,filterSetIndex,filterIndexInFilterSet);
        },
        valueInputHandler :function(filterSetIndex,filterIndexInFilterSet,event){
                const valueOperand = event.getParameters().value;
                this.setFilterValueOperand(valueOperand,destinationCode,filterSetIndex,filterIndexInFilterSet);
        },
        deleteFilter : function(filterSetIndex, filterIndexInFilterSet) {
            const filterConfig = this.getView().getModel(FILTER_CONFIG_MODEL).getData();
            const filterSets = filterConfig.filterNode.children;
            if(filterSets && filterSets.length >= filterSetIndex && filterSets[filterSetIndex].children.length >=filterIndexInFilterSet){
                const filterSet = filterSets[filterSetIndex];
                filterSet.children.splice(filterIndexInFilterSet,1);
                console.log(`Filter node deleted in filter set ${filterSetIndex} at index ${filterIndexInFilterSet}`);	
                this.removeFilterSetIfEmptyChildren(filterConfig);
                this.recreateFormContainer();
            }			
        },
        removeFilterSetIfEmptyChildren:function(filterConfig){
            const filterSetIndicesToDelete = [];
            const filterSets = filterConfig.filterNode.children;
            for(let filterSetIndex =0 ;filterSetIndex < filterSets.length;filterSetIndex++ ){
                const filterSet = filterSets[filterSetIndex];
                if(filterSet.children.length === 0){
                    filterSetIndicesToDelete.push(filterSetIndex);
                }
            }
            filterSetIndicesToDelete.forEach((filterSetIndex) => {
                filterConfig.children.splice(filterSetIndex,1);
            });
        },
        addFilterInFilterSet : function(filterSetIndex) {
            const filterConfig = this.getView().getModel(FILTER_CONFIG_MODEL).getData();
            const filterSets = filterConfig.filterNode.children;
            if(filterSets && filterSets.length >= filterSetIndex){
                const filterSet = filterSets[filterSetIndex];
                if(!(filterSet.children && filterSet.children instanceof Array)){
                    filterSet.children = [];
                } 
                filterSet.children.push({operation : "and", children : [{fieldOperand: "", operation : "", valueOperand:""}]})
                console.log(`Filter node added in filter set ${filterSetIndex} at index ${filterSet.children.length - 1}`);	
                this.recreateFormContainer();
            }			
        },
        addFilterSet : function() {
            const filterConfigModel = this.getView().getModel(FILTER_CONFIG_MODEL);
            let filterConfig = this.getView().getModel(FILTER_CONFIG_MODEL).getData();
            if(!filterConfig){
                filterConfig = {operation:"and", children : []};
                filterConfigModel.setData(filterConfig);
            }	else {
                filterConfig.children.push({
                    operation: "and",
                    children: [{
                        "fieldOperand": "",
                        "operation": "",
                        "valueOperand": ""
                    }]
                });
            }
            this.recreateFormContainer();		
        },
        setFilterFieldOperand : function(fieldOperand ,destinationCode,filterSetIndex, filterIndexInFilterSet) {
            const filterConfig = this.getView().getModel(FILTER_CONFIG_MODEL).getData();
            const filterParams = this.destinationCodeFilterParamMap.get(destinationCode);
            const filterSets = filterConfig.filterNode.children;
            if(filterSets && filterSets.length >= filterSetIndex && filterSets[filterSetIndex].children.length >=filterIndexInFilterSet){
                const filterSet = filterSets[filterSetIndex];
                const filterParamNode = filterSet.children[filterIndexInFilterSet];
                if(filterParams && filterParams instanceof Array){
                   const filterParamFound =  filterParams.find((filterParam) =>  filterParam.name === fieldOperand );
                   if(filterParamFound){
                    filterParamNode.fieldOperand = fieldOperand;
                    console.log(`Filter field ${fieldOperand} set to filter node present in filter set ${filterSetIndex} at index ${filterIndexInFilterSet}`);
                   } 
                }
                this.formCreator.createFilterFieldOperandOnFilterFieldOperandChange(fieldOperand,filterSetIndex, filterIndexInFilterSet,this);
            }
        },
        setFilterOperation : function(operation,filterSetIndex, filterIndexInFilterSet) {
            const filterConfig = this.getView().getModel(FILTER_CONFIG_MODEL).getData();
            const filterSets = filterConfig.filterNode.children;
            if(filterSets && filterSets.length >= filterSetIndex && filterSets[filterSetIndex].children.length >=filterIndexInFilterSet){
                const filterSet = filterSets[filterSetIndex];
                const filterParamNode = filterSet.children[filterIndexInFilterSet];
                filterParamNode.operation = operation;	
                console.log(`Filter operation ${operation} set to filter node present in filter set ${filterSetIndex} at index ${filterIndexInFilterSet}`);	
            }
        },
        setFilterValueOperand : function(valueOperand ,destinationCode,filterSetIndex, filterIndexInFilterSet) {
            const filterConfig = this.getView().getModel(FILTER_CONFIG_MODEL).getData();
            const filterSets = filterConfig.filterNode.children;
            if(filterSets && filterSets.length >= filterSetIndex && filterSets[filterSetIndex].children.length >=filterIndexInFilterSet){
                //convert into datatype as described in event meta
                const filterParams = this.destinationCodeFilterParamMap.get(destinationCode);
                const filterSet = filterSets[filterSetIndex];
                const filterParamNode = filterSet.children[filterIndexInFilterSet];
                if(filterParams && filterParams instanceof Array){
                    const filterParamFound =  filterParams.find((filterParam) =>  filterParam.name === filterParamNode.fieldOperand );
                    if(filterParamFound){
                        const targetDatatype = filterParamFound.dataType;
                        filterParamNode.valueOperand = util.typecast(targetDatatype,valueOperand);
                        console.log(`Filter value ${filterParamNode.valueOperand} set to filter node present in filter set ${filterSetIndex} at index ${filterIndexInFilterSet}`);	
                    }
                }

            }
        },
        opertionDropdownHandler :function(filterSetIndex,filterIndexInFilterSet,event){
            const operation = event.getParameters().selectedItem.getKey();
            this.setFilterOperation(operation,filterSetIndex,filterIndexInFilterSet);
        },
        recreateFormContainer: function(){
            const form = this.getView().byId("filterForm");
            let formContainers = form.getFormContainers();
            const formContainersToDestroy = formContainers.filter((formContainer) => formContainer.getId() !== "eventFormContainer" )
            formContainersToDestroy.forEach((formContainer) => {
                formContainer.destroyFormElements();
                formContainer.destroy();
            });    
            this.createFilterSetForm(this.selectedFilterConfig);
        },
        addOrButtonSelectionChangeHandler: function (filterSetIndex,isRootOperation,event){
            const operation = event.getParameters().item.getKey();
            const filterNode = filterConfigs.filterNode;
            if(isRootOperation === true){
                filterNode.operation = operation;
            } else if(filterSetIndex < filterNode.children.length){
                const filterSet = filterNode.children[filterSetIndex];
                filterSet.operation = operation;
            }
        },
        eventTypeSelected: function(event){
            const selectedEventType = event.getParameters().selectedItem.getKey();
            const selectedFilterConfig = filterConfigs.find((filterConfig) => selectedEventType === `${filterConfig.topicEventType.topic}_${filterConfig.topicEventType.eventType}`)
            this.selectedFilterConfig = selectedFilterConfig;
            this.setModel(this.selectedFilterConfig,FILTER_CONFIG_MODEL);
            this.recreateFormContainer();
        },
        createFilterSetForm: function(filterConfig){
            const form = this.getView().byId("filterForm");
            const filterForm = this.getFilterForm();
            const filterSetFormContainers = filterForm.createFilterFormContainers(filterConfig,this);
            filterSetFormContainers.forEach((formContainer) => form.addFormContainer(formContainer))
        },
        getFilterForm:function(){
            if(this.formCreator){
                return this.formCreator;
            } else {
                const form = this.getView().byId("filterForm");
                this.formCreator = new FilterFormCreator(this,form,eventMetadata,supportedFilters);
                return this.formCreator;
            }
     
        }
	});

});