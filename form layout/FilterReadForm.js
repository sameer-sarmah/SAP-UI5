const supportedFilters = [{
    "integrationName": "sap.sf.plt.task_foundation.sap_task_center_integration.push_tasks.push_tasks.v3",
    "eventType": "sap.hr.odm.task.decorated",
    "topic": "sap.hr.odm.task",
    "destinationCode":"SCP_TASK_CENTER"
}];

const eventMetadata = [
    {
        "eventType": "sap.hr.odm.task.decorated",
        "topic": "sap.hr.odm.task",
        "sourceArea": "MODULE_ECT",
        "filterParameters": [{
                "name": "department/name",
                "dataType": "string"
            }, {
                "name": "age",
                "dataType": "integer"
            },{
                "name": "gender",
                "dataType": "string",
                "supportedValues" : "Male,Female"
            },
            {
                "name": "lob",
                "dataType": "string_set"
            }
        ]
    }
];

const filterConfig = {
	"operation": "and",
	"children": [
		{
			"operation": "and",
			"children": [
				{
					"fieldOperand": "age",
					"operation": "gt",
					"valueOperand": 60
				},
				{
					"fieldOperand": "age",
					"operation": "lt",
					"valueOperand": 80
				}
			]
		},
		{
			"operation": "and",
			"children": [
				{
					"fieldOperand": "gender",
					"operation": "eq",
					"valueOperand": "male"
				},
			    {
					"fieldOperand": "department/name",
					"operation": "eq",
					"valueOperand": "Engineering"
				}
			]
		}
	]
};

sap.ui.controller("my.own.controller.form", {


onInit:function(){
     const eventMetadataModel = new sap.ui.model.json.JSONModel();
     eventMetadataModel.setData(eventMetadata);
     const supportedFiltersModel = new sap.ui.model.json.JSONModel();
     supportedFiltersModel.setData(supportedFilters);
     const filterConfigModel = new sap.ui.model.json.JSONModel();
     filterConfigModel.setData(filterConfig);

     this.getView().setModel(eventMetadataModel,"eventMetadataModel");
     this.getView().setModel(supportedFiltersModel,"supportedFiltersModel");
     this.getView().setModel(filterConfigModel,"filterConfigModel");

     const form = this.getView().byId("productForm");
     this.destinationCodeFilterParamMap = this.createDestinationCodeFilterParamMapping(eventMetadata,supportedFilters);
     console.log(this.destinationCodeFilterParamMap);        
                     
    const formContainers = this.createForm(filterConfig);
    formContainers.forEach((formContainer) => form.addFormContainer(formContainer))
    console.log("onInit completed");
},
createForm: function(filterConfig){
    const filterSetFormContainers = [];
    const that = this;
    const  parentOperation = filterConfig.operation;
    if(filterConfig && filterConfig.children.length > 0){
        const numberOfFilterSets = filterConfig.children.length;
        /*
        In case there are multiple filter sets we have to render in and-or segmented button after the first filter set ,the parent operation value after the other filter sets
        */
        filterConfig.children.forEach((filterSetConfig,filterSetIndex) => {
            const filterSetFormElements = [];
            if(filterSetConfig && filterSetConfig.children.length > 0){
                const  filterSetOperation = filterSetConfig.operation;
                //e.g 'Filter Set 1' Label
                const filterSetLabel = new sap.m.Label({text: `Filter Set ${filterSetIndex + 1}`});  
                //const filterSetLabelFlexBox = that.wrapItemsInFlexBox([filterSetLabel],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
                const filterSetFormLabelElement = new sap.ui.layout.form.FormElement({
                    fields:[filterSetLabel]
                });
                filterSetFormElements.push(filterSetFormLabelElement);
                //'Field' 'Operation' 'Value' Labels
                const filterFormLabelElement = that.createfilterLabelFormElement();
                filterSetFormElements.push(filterFormLabelElement);
                //create row for each filter param
                filterSetConfig.children.forEach((filter,filterIndexInFilterSet) => {
                        const numberOfFiltersInFilterSet = filterConfig.children[filterSetIndex].children.length;
                        const filterFormElementFields = that.createfilterFormElementFields({filter,filterSetIndex,filterIndexInFilterSet,numberOfFiltersInFilterSet,filterSetOperation});
                        const filterFormElement = new sap.ui.layout.form.FormElement({
                            fields:filterFormElementFields
                        });
                        filterSetFormElements.push(filterFormElement);
                });
            }
            //Add/Or button in between filter sets if there are multiple filter sets and the current filter set is not the last one
            const horizontalDividerFormElement = that.createHorizontalDividerFormElement();
            if(numberOfFilterSets > 0 && filterSetIndex < numberOfFilterSets - 1 ){
                filterSetFormElements.push(horizontalDividerFormElement);
            }

            const filterSetFormContainer = new sap.ui.layout.form.FormContainer({
                formElements:filterSetFormElements
            });
            filterSetFormContainers.push(filterSetFormContainer);
        });

    }
    return filterSetFormContainers;
},
createHorizontalDividerFormElement :function(){
    const that = this;
    const horizontalDividerLeft = new sap.ui.core.HTML({content:"<hr/>"});
    const horizontalDividerLeftFlexBox = that.wrapItemsInFlexBox([horizontalDividerLeft],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
    const andOrButton = that.createAddOrButton();
    const andOrButtonFlexBox = that.wrapItemsInFlexBox([andOrButton],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
    const horizontalDividerRight = new sap.ui.core.HTML({content:"<hr/>"});
    const horizontalDividerRightFlexBox = that.wrapItemsInFlexBox([horizontalDividerRight],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
    const horizontalDividerFormElement = new sap.ui.layout.form.FormElement({
        fields:[horizontalDividerLeft,andOrButtonFlexBox,horizontalDividerRight]
    });
    return horizontalDividerFormElement;
},
createfilterLabelFormElement :function(){
    const that = this;
    const fieldOperandLabel = new sap.m.Label({text: "Field"});  
    const fieldOperandLabelFlexBox = that.wrapItemsInFlexBox([fieldOperandLabel],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
    const operationLabel = new sap.m.Label({text: "Operation"});
    const operationLabelFlexBox = that.wrapItemsInFlexBox([operationLabel],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center) ;
    const valueOperandLabel = new sap.m.Label({text: "Value"});  
    const valueOperandLabelFlexBox =that.wrapItemsInFlexBox([valueOperandLabel],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
    const filterFormLabelElement = new sap.ui.layout.form.FormElement({
        fields:[new sap.m.Label({text: ""}),fieldOperandLabelFlexBox ,
        operationLabelFlexBox , valueOperandLabelFlexBox,new sap.m.Label({text: ""})]
    });
    return filterFormLabelElement;
},
createfilterFormElementFields :function(filterData){
    const that = this;
    const {filter,filterSetIndex,filterIndexInFilterSet,numberOfFiltersInFilterSet,filterSetOperation} = filterData;
    const fieldOperand = filter.fieldOperand;
    const operation = filter.operation;
    const valueOperand = filter.valueOperand;

    const fieldOperandInput = new sap.m.Input({
        value: fieldOperand,
        submit: that.fieldInputHandler.bind(that,filterSetIndex,filterIndexInFilterSet)
      });
      
    const valueOperandInput = new sap.m.Input({
    value: valueOperand,
    submit: that.valueInputHandler.bind(that,filterSetIndex,filterIndexInFilterSet)
    });

    const deleteFilterButton = that.createDeleteFilterButton();

    let  filterFormElementFields = [];
    /*
    In case there are multiple filters we have to render in and-or segmented button for the first filter ,the selected value for the other filters 
    */
    //When there are multiple filters & we are dealing with the first filter then we have to enable And/Or button in along side the first filter
    if(numberOfFiltersInFilterSet > 1 && filterIndexInFilterSet === 0){
        const andOrButton = that.createAddOrButton();
        const andOrButtonFlexBox = that.wrapItemsInFlexBox([andOrButton],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
        const actionButtons = that.wrapItemsInFlexBox([deleteFilterButton],sap.m.FlexAlignItems.Start,sap.m.FlexAlignItems.Start);
        filterFormElementFields = [andOrButtonFlexBox,fieldOperandInput,that.createDropdown(filterSetIndex,filterIndexInFilterSet,operation),valueOperandInput,actionButtons];
    }
    //When there are multiple filters & we are dealing with the last filter then we have to enable And/Or label and Add filter button 
    else if(numberOfFiltersInFilterSet > 1 && filterIndexInFilterSet === numberOfFiltersInFilterSet - 1){
        const andOrLabel = new sap.m.Label({text: filterSetOperation});  
        const andOrLabelFlexBox = that.wrapItemsInFlexBox([andOrLabel],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
        const addFilterButton = that.createAddFilterButton();
        const actionButtons = that.wrapItemsInFlexBox([deleteFilterButton,addFilterButton],sap.m.FlexAlignItems.Start,sap.m.FlexAlignItems.Start);
        filterFormElementFields = [andOrLabelFlexBox,fieldOperandInput,that.createDropdown(filterSetIndex,filterIndexInFilterSet,operation),valueOperandInput,actionButtons];
    }
    //There are multiple filter ,We have to enable And/Or label in along side the filters
    else if(numberOfFiltersInFilterSet > 1 && filterIndexInFilterSet > 0){
        const andOrLabel = new sap.m.Label({text: filterSetOperation});  
        const andOrLabelFlexBox = that.wrapItemsInFlexBox([andOrLabel],sap.m.FlexAlignItems.Center,sap.m.FlexAlignItems.Center);
        const actionButtons = that.wrapItemsInFlexBox([deleteFilterButton],sap.m.FlexAlignItems.Start,sap.m.FlexAlignItems.Start);
        filterFormElementFields = [andOrLabelFlexBox,fieldOperandInput,that.createDropdown(filterSetIndex,filterIndexInFilterSet,operation),valueOperandInput,actionButtons];
    } 

    //When there is only onle filter in the filter set then we have to add filter button but neither And/Or label nor And/Or button 
    else if(numberOfFiltersInFilterSet === 1){
        const addFilterButton = that.createAddFilterButton();
        const actionButtons = that.wrapItemsInFlexBox([deleteFilterButton,addFilterButton],sap.m.FlexAlignItems.Start,sap.m.FlexAlignItems.Start);
        filterFormElementFields = [fieldOperandInput,that.createDropdown(filterSetIndex,filterIndexInFilterSet,operation),valueOperandInput,actionButtons];
    }
    return filterFormElementFields;
},
onAfterRendering:function(){
    console.log("onAfterRendering");
},
onBeforeRendering:function(){
    console.log("onBeforeRendering");
},
wrapItemsInFlexBox:function(items,alignItems,justifyContent){
    if(items instanceof Array && items.length > 0){
        const childrenFlexBoxes =  items.map((item)=>{
            const childFlexBox=new sap.m.FlexBox({
                "direction":sap.m.FlexDirection.Row,
                "alignItems":alignItems,
                "justifyContent":justifyContent
            }); 
            childFlexBox.addItem(item);
            return childFlexBox;
        });
        const parentFlexBox = new sap.m.FlexBox({
            "direction":sap.m.FlexDirection.Row,
            "alignItems":alignItems,
            "justifyContent":justifyContent,
            "items":childrenFlexBoxes
        }); 
        return parentFlexBox;
    }
},
createDestinationCodeFilterParamMapping :function(eventMeta,supportedFilters){
    const destinationCodeFilterParamMap =  new Map();
    if(eventMeta instanceof Array){
        eventMeta.forEach((eventMetaDatum)=>{
            if(supportedFilters instanceof Array){
                const supportedFilter = supportedFilters.find((supportedFilter) => {
                    return (eventMetaDatum.topic === supportedFilter.topic && eventMetaDatum.eventType === supportedFilter.eventType)
                });
                if(supportedFilter){
                    destinationCodeFilterParamMap.set(supportedFilter.destinationCode,eventMetaDatum.filterParameters);
                }
            }
        });
    }
    return destinationCodeFilterParamMap;
},
deleteFilter : function(filterSetIndex, filterIndexInFilterSet) {
    const filterConfig = this.getView().getModel("filterConfig");
    if(filterConfig.children.length >= filterSetIndex && filterConfig.children[filterSetIndex].children.length >=filterIndexInFilterSet){
        filterConfig.children[filterSetIndex].children.splice(filterIndexInFilterSet,1);
    }			
},
/*
validate before setting 
*/ 
setFilterFieldOperand : function(destinationCode,filterSetIndex, filterIndexInFilterSet) {
    const filterConfig = this.getView().getModel("filterConfig");
    const filterParam = this.destinationCodeFilterParamMap.get(destinationCode);
    
},
setFilterOperation : function(filterSetIndex, filterIndexInFilterSet,) {
    const filterConfig = this.getView().getModel("filterConfig");
    if(filterConfig.children.length >= filterSetIndex && filterConfig.children[filterSetIndex].children.length >=filterIndexInFilterSet){
        filterConfig.children[filterSetIndex].children[filterIndexInFilterSet].operation = operation;		
    }
},
setFilterValueOperand : function(destinationCode,filterSetIndex, filterIndexInFilterSet,valueOperand) {
    const filterConfig = this.getView().getModel("filterConfig");
    if(filterConfig.children.length >= filterSetIndex && filterConfig.children[filterSetIndex].children.length >=filterIndexInFilterSet){
        //convert into datatype as described in event meta
        const filterParam = this.destinationCodeFilterParamMap.get(destinationCode);
        filterConfig.children[filterSetIndex].children[filterIndexInFilterSet].valueOperand = valueOperand;		
    }
},
typecast:function(datatype,object){
    if(this.stringJsDataTypeMap.STRING === datatype){
        return object.toString();
    } else if(this.stringJsDataTypeMap.LONG === datatype || this.stringJsDataTypeMap.INTEGER === datatype){
        parseInt(object);
    } else if(this.stringJsDataTypeMap.BOOLEAN === datatype){
        return ( typeof object === 'string' && object.toLowerCase() === 'true')
    }
},
isNonEmptyString: function(value){
    return typeof value === 'string' && value.trim().length > 0;
},
isLeafFilterConfigValid : function(filterNode){
    return (this.isNonEmptyString(filterNode.fieldOperand) && this.isNonEmptyString(filterNode.operation) && this.isNonEmptyString(filterNode.valueOperand) ) ;
},
isLeafNode: function(filterNode){
    return !(filterNode.children &&  filterNode.children instanceof Array && filterNode.children.length > 0);
},
//every leaf filter node should have non empty properties fieldOperand,operation & valueOperand  
deleteIncompleteFilterConfigs: function(filterNode){
    if(this.isLeafNode(filterNode) === false){
        for(let childIndex = 0;childIndex < filterNode.children.length; childIndex++){
              const childFilterNode = filterNode.children[childIndex]; 
         if(this.isLeafNode(childFilterNode) === false){
            this.deleteIncompleteFilterConfigs(childFilterNode);
         } else{
               const filterConfigValid = this.isLeafFilterConfigValid(childFilterNode);
            if( filterConfigValid === false ){
             console.log(`deleting filter config ${deleteFilterConfig}`);
             filterNode.children.splice(childIndex,1);
            }
         }
      }
   }
},
dropdownHandler :function(filterSetIndex,filterIndexInFilterSet,event){
        console.log(`FilterSetIndex=${filterSetIndex},FilterIndexInFilterSet=${filterIndexInFilterSet}`);
        console.log(event);
}, 
createDropdown : function(filterSetIndex,filterIndexInFilterSet,operation){		
    const that = this;		 
    const select =new  sap.m.Select({
            items : [
                     new sap.ui.core.Item({key:"eq",text:"Equal"}),
                     new sap.ui.core.Item({key:"ne", text:"Not equal"}),
                     new sap.ui.core.Item({key:"gt", text:"Greater than"}),
                     new sap.ui.core.Item({key:"ge", text:"Greater than or equal to "})					         
                     ],
            change : that.dropdownHandler.bind(that,filterSetIndex, filterIndexInFilterSet)
        });
    select.setSelectedKey(operation);
    return select;

},
fieldInputHandler :function(filterSetIndex,filterIndexInFilterSet,event){
        console.log(`FilterSetIndex=${filterSetIndex},FilterIndexInFilterSet=${filterIndexInFilterSet}`);
        console.log(event);
},
valueInputHandler :function(filterSetIndex,filterIndexInFilterSet,event){
        console.log(`FilterSetIndex=${filterSetIndex},FilterIndexInFilterSet=${filterIndexInFilterSet}`);
        console.log(event);
},
createDeleteFilterButton: function(filterSetIndex,filterIndexInFilterSet){
    const deleteButton = new sap.m.Button({
        icon : "sap-icon://sys-cancel", 
        type: sap.m.ButtonType.Transparent,
        press:function(){
            
        }
    });
    return deleteButton;
},
createAddFilterButton: function(filterSetIndex,filterIndexInFilterSet){
            //Add a add button to the last filter in a filter set
    const addButton = new sap.m.Button({icon : "sap-icon://sys-add",
            type: sap.m.ButtonType.Transparent,
            press:function(){
                            
            }
    }); 
    return addButton;
},
createAddFilterSetButton: function(){

    const addFilterSetButton = new sap.m.Button({
            text: "Add Filter Set", 
            icon: "sap-icon://add", 
            type: sap.m.ButtonType.Transparent,
			press:function(){
				if(!this.reportDefinition.filter){
                    this.reportDefinition.filter={operation:"and", children : []};
                }
                this.reportDefinition.filter.children.push({operation : "and", children : [{path: "", operation : "", operand:null}]})
			}
	});
    return addFilterSetButton;
},
createAddOrButton: function(){
    const oAndOrControl = new sap.m.SegmentedButton({
        buttons:[new sap.m.Button(
                        {text:"And",
                         customData: {
                                Type:"sap.ui.core.CustomData",
                                key:"key",
                                value:"and"
                            }	
                        }),
                new sap.m.Button(
                        {text:'Or',
                        customData: {
                                Type:"sap.ui.core.CustomData",
                                key:"key",
                                value:"or"
                            }	
                        })]});
    return oAndOrControl;
}

});
sap.ui.xmlview({viewContent:jQuery('#view1').html() }).placeAt('content');
