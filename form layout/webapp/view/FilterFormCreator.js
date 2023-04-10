const FILTER_CONFIG_MODEL = "filterConfigModel";
const EVENT_META_MODEL = 'eventMetadataModel';
sap.ui.define(["sap/ui/base/Object","sap/ui/demo/view/FilterControlCreator"], function(Object,FilterControlCreator) {
    return Object.extend("FilterFormCreator",{
        constructor: function(controller,form,eventMetadata,supportedFilters) {
            this.controller = controller;
            this.eventMetadata = eventMetadata;
            this.supportedFilters = supportedFilters;
            this.form = form;
            this.controlCreator = new FilterControlCreator(controller,form,eventMetadata,supportedFilters);
        },
        createEventFormContainers: function(filterConfigs, controller){
            const eventInput =this.controlCreator.createEventTypeDropdown(filterConfigs,controller);
            const eventFormElement = new sap.ui.layout.form.FormElement({
                fields: [eventInput]
            });
            const eventFormContainer = new sap.ui.layout.form.FormContainer({
                id:"eventFormContainer",
                formElements: eventFormElement
            });
            return [eventFormContainer];
        },
        createFilterFormContainers: function(filterConfig, controller) {
            this.controller = controller;
            this.filterConfig = filterConfig;
            const topic  = filterConfig.topicEventType.topic;
            const eventType  = filterConfig.topicEventType.eventType;
            const filterSetFormContainers = [];
            const filterNode = filterConfig.filterNode;
            const parentOperation = filterNode.operation;
            if (filterNode && filterNode.children.length > 0) {
                const numberOfFilterSets = filterNode.children.length;
                filterNode.children.forEach((filterSetConfig, filterSetIndex) => {
                    if (filterSetConfig && filterSetConfig.children.length > 0) {
                        const filterSetFormContainer = this.createFilterSetFormContainer(filterSetConfig,filterSetIndex,topic,eventType,controller);
                        filterSetFormContainers.push(filterSetFormContainer);
                    }
                    //Add/Or button in between filter sets
                    const horizontalDividerFormContainer = this.createHorizontalDividerFormContainer(filterSetIndex, numberOfFilterSets, parentOperation, controller);
                    if (horizontalDividerFormContainer) {
                        filterSetFormContainers.push(horizontalDividerFormContainer);
                    }

                });
                const isAddfilterSetButtonAllowed = this.controlCreator.showAddFilterButton(this.filterConfig,5);  
                if(isAddfilterSetButtonAllowed === true){
                    const addFilterSetFormContainer =  this.createAddFilterSetFormContainer(controller);
                    filterSetFormContainers.push(addFilterSetFormContainer);
                }
            }
            return filterSetFormContainers;
        },
        createAddFilterSetFormContainer: function(controller){
            const addFilterSetButton = this.controlCreator.createAddFilterSetButton(controller);
            const addFilterSetButtonFlexBox = this.controlCreator.wrapItemsInFlexBox([addFilterSetButton], sap.m.FlexAlignItems.Start, sap.m.FlexAlignItems.Start,
                new sap.ui.layout.GridData({
                    span: "XL2 L2 M2"
                }));
            const addFilterSetFormElement = new sap.ui.layout.form.FormElement({
                fields: [addFilterSetButtonFlexBox]
            });
            const addFilterSetFormContainer = new sap.ui.layout.form.FormContainer({
                formElements: addFilterSetFormElement
            });
            return addFilterSetFormContainer;
        }, 
        createFilterSetFormContainer: function(filterSetConfig,filterSetIndex,topic,eventType,controller){
            const filterSetFormElements = [];
            const filterSetOperation = filterSetConfig.operation;
            //'Field' 'Operation' 'Value' Labels
            const filterFormLabelElement = this.createFilterLabelFormElement();
            filterSetFormElements.push(filterFormLabelElement);
            //create row for each filter param
            filterSetConfig.children.forEach((filter, filterIndexInFilterSet) => {
                const numberOfFiltersInFilterSet = filterSetConfig.children.length;
                const filterFormElementFields = this.createFilterFormElementFields({
                    filter,
                    filterSetIndex,
                    filterIndexInFilterSet,
                    numberOfFiltersInFilterSet,
                    filterSetOperation,
                    topic,
                    eventType,
                    controller
                });
                const filterFormElement = new sap.ui.layout.form.FormElement({
                    fields: filterFormElementFields
                });
                filterSetFormElements.push(filterFormElement);
            });
            const filterSetFormContainer = new sap.ui.layout.form.FormContainer({
                title : `Filter Set ${filterSetIndex + 1}`,
                formElements: filterSetFormElements
            });
            return filterSetFormContainer;
        },
        createHorizontalDivider: function() {
            const horizontalDivider = new sap.ui.core.HTML({
                content: "<hr/>",
                layoutData: new sap.m.FlexItemData({
                    growFactor: 1,
                    maxWidth: "60%"
                })
            });
            return horizontalDivider;
        },
        createHorizontalDividerFormContainer: function(filterSetIndex, numberOfFilterSets, filterSetOperation, controller) {
            if (filterSetIndex === 0 && numberOfFilterSets === 1) {
                return null;
            }
            const that = this;
            const horizontalDividerLeft = this.createHorizontalDivider();
            const horizontalDividerRight = this.createHorizontalDivider();
            let controls = [];
            /*
            In case there are multiple filter sets we have to render in and-or segmented button after the first filter set 
            & then 'and' oe 'or' label after the other filter sets 
            */
            if (filterSetIndex === 0 && numberOfFilterSets > 1) {
                const andOrButton = this.controlCreator.createAddOrButton(controller, filterSetOperation, -1, true);
                controls = [horizontalDividerLeft, andOrButton, horizontalDividerRight];
            } else {
                const andOrLabel = new sap.m.Label({
                    text: filterSetOperation
                });
                controls = [horizontalDividerLeft, andOrLabel, horizontalDividerRight];
            }
            const row = this.controlCreator.wrapItemsInFlexBox(controls, sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center);
            const items = row.getItems();
            const horizontalDividerLeftFlexBox = items[0];
            horizontalDividerLeftFlexBox.setWidth("100%");
            const andOrButtonFlexBox = items[1];
            andOrButtonFlexBox.setWidth("100px");
            const horizontalDividerRightFlexBox = items[2];
            horizontalDividerRightFlexBox.setWidth("100%");
            const horizontalDividerFormElement = new sap.ui.layout.form.FormElement({
                fields: row
            });
            const horizontalDividerFormContainer = new sap.ui.layout.form.FormContainer({
                formElements: horizontalDividerFormElement
            });
            return horizontalDividerFormContainer;
        },
        createFilterLabelFormElement: function() {
            const that = this;
            const fieldOperandLabel = new sap.m.Label({
                text: "Field"
            });
            const fieldOperandLabelFlexBox = this.controlCreator.wrapItemsInFlexBox([fieldOperandLabel], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                new sap.ui.layout.GridData({
                    span: "XL3 L3 M3"
                }));
            const operationLabel = new sap.m.Label({
                text: "Operation"
            });
            const operationLabelFlexBox = this.controlCreator.wrapItemsInFlexBox([operationLabel], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                new sap.ui.layout.GridData({
                    span: "XL2 L2 M2"
                }));
            const valueOperandLabel = new sap.m.Label({
                text: "Value"
            });
            const valueOperandLabelFlexBox = this.controlCreator.wrapItemsInFlexBox([valueOperandLabel], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                new sap.ui.layout.GridData({
                    span: "XL3 L3 M3"
                }));
            const emptyLeftCell = new sap.m.Label({
                text: ""
            });
            const emptyLeftCellFlexBox = this.controlCreator.wrapItemsInFlexBox([emptyLeftCell], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                new sap.ui.layout.GridData({
                    span: "XL2 L2 M2"
                }));
            const emptyRightCell = new sap.m.Label({
                text: ""
            });
            const emptyRightCellFlexBox = this.controlCreator.wrapItemsInFlexBox([emptyRightCell], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                new sap.ui.layout.GridData({
                    span: "XL2 L2 M2"
                }));
            const filterFormLabelElement = new sap.ui.layout.form.FormElement({
                fields: [emptyLeftCellFlexBox, fieldOperandLabelFlexBox,
                    operationLabelFlexBox, valueOperandLabelFlexBox, emptyRightCellFlexBox
                ]
            });
            return filterFormLabelElement;
        },
        createFilterFormElementFields: function(filterData) {
            const {
                filter,
                filterSetIndex,
                filterIndexInFilterSet,
                numberOfFiltersInFilterSet,
                filterSetOperation,
                topic,
                eventType,
                controller
            } = filterData;
            const fieldOperand = filter.fieldOperand;
            const operation = filter.operation;
            const valueOperand = filter.valueOperand;
  
            const fieldOperandDropdown = this.controlCreator.createFieldOperandDropdown(filterSetIndex, filterIndexInFilterSet,topic,eventType,controller);
            fieldOperandDropdown.setSelectedKey(fieldOperand);
            const fieldOperandDropdownFlexBox = this.controlCreator.wrapItemsInFlexBox([fieldOperandDropdown], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                new sap.ui.layout.GridData({
                    span: "XL3 L3 M3"
                }), 1);

            const valueOperandControl = this.controlCreator.createValueOperandControl(this.filterConfig,fieldOperand,valueOperand,filterSetIndex, filterIndexInFilterSet,controller);

            const operationDropdown = this.controlCreator.createOperationDropdown(filterSetIndex, filterIndexInFilterSet, controller);
            operationDropdown.setSelectedKey(operation);
            const operationDropdownFlexBox = this.controlCreator.wrapItemsInFlexBox([operationDropdown], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                new sap.ui.layout.GridData({
                    span: "XL2 L2 M2"
                }));
            let filterFormElementFields = [];
            if (numberOfFiltersInFilterSet === 1) {
                const emptyCell = new sap.m.Label({
                    text: ""
                });
                const emptyCellFlexBox = this.controlCreator.wrapItemsInFlexBox([emptyCell], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                    new sap.ui.layout.GridData({
                        span: "XL2 L2 M2"
                    }));
                const actionButtonsFlexBox = this.controlCreator.createActionButtonsFlexBox(this.filterConfig,filterSetIndex, filterIndexInFilterSet,true, controller);
                filterFormElementFields = [emptyCellFlexBox, fieldOperandDropdownFlexBox, operationDropdownFlexBox, valueOperandControl, actionButtonsFlexBox];
            }
            /*
            In case there are multiple filters we have to render in and-or segmented button for the first filter & then 'and' oe 'or' label for the other filters 
            */
            //When there are multiple filters & we are dealing with the first filter then we have to enable And/Or button in along side the first filter
            else if (numberOfFiltersInFilterSet > 1 && filterIndexInFilterSet === 0) {
                const andOrButton = this.controlCreator.createAddOrButton(controller, operation, filterSetIndex, false);
                const andOrButtonFlexBox = this.controlCreator.wrapItemsInFlexBox([andOrButton], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                    new sap.ui.layout.GridData({
                        span: "XL2 L2 M2"
                    }));
                const actionButtonsFlexBox = this.controlCreator.createActionButtonsFlexBox(this.filterConfig,filterSetIndex, filterIndexInFilterSet,false, controller);
                filterFormElementFields = [andOrButtonFlexBox, fieldOperandDropdownFlexBox, operationDropdownFlexBox, valueOperandControl, actionButtonsFlexBox];
            }
            //When there are multiple filters & we are dealing with the last filter then we have to enable And/Or label and Add filter button 
            else if (numberOfFiltersInFilterSet > 1 && filterIndexInFilterSet === numberOfFiltersInFilterSet - 1) {
                const andOrLabel = new sap.m.Text({
                    text: filterSetOperation
                });
                const andOrLabelFlexBox = this.controlCreator.wrapItemsInFlexBox([andOrLabel], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                    new sap.ui.layout.GridData({
                        span: "XL2 L2 M2"
                    }));
                const actionButtonsFlexBox = this.controlCreator.createActionButtonsFlexBox(this.filterConfig,filterSetIndex, filterIndexInFilterSet,true, controller);    
                filterFormElementFields = [andOrLabelFlexBox, fieldOperandDropdownFlexBox, operationDropdownFlexBox, valueOperandControl, actionButtonsFlexBox];
            }
            //There are multiple filter ,We have to enable And/Or label in along side the filters,but not the add filter button
            else if (numberOfFiltersInFilterSet > 1 && filterIndexInFilterSet > 0) {
                const andOrLabel = new sap.m.Text({
                    text: filterSetOperation
                });
                const andOrLabelFlexBox = this.controlCreator.wrapItemsInFlexBox([andOrLabel], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                    new sap.ui.layout.GridData({
                        span: "XL2 L2 M2"
                    }));
                const actionButtonsFlexBox = this.controlCreator.createActionButtonsFlexBox(this.filterConfig,filterSetIndex, filterIndexInFilterSet,true, controller);    
                filterFormElementFields = [andOrLabelFlexBox, fieldOperandDropdownFlexBox, operationDropdownFlexBox, valueOperandControl, actionButtonsFlexBox];
            }
            //When there is only onle filter in the filter set then we have to add filter button but neither And/Or label nor And/Or button 
            else if (numberOfFiltersInFilterSet === 1) {
                filterFormElementFields = [fieldOperandDropdownFlexBox, operationDropdownFlexBox, valueOperandControl, actionButtonsFlexBox];
            }
            return filterFormElementFields;
        },
        createFilterFieldOperandOnFilterFieldOperandChange: function(selectedFieldOperand,filterSetIndex, filterIndexInFilterSet, controller){     
            const control = this.controlCreator.createValueOperandControl(this.filterConfig,selectedFieldOperand,null,filterSetIndex, filterIndexInFilterSet, controller);
            const formContainers = this.form.getFormContainers();
            /*form container at index 0 represents form container for event type 
              1 represents form container for filter set 1 ,2 represents form container for horizontal divider
              form container index for a particular filter set 0 =>  (2*n + 1) e.g  filter set => 1 , filter set 2 => 3
            */
            const formContainerIndex = (2*filterSetIndex) + 1;
            const formElements = formContainers[formContainerIndex].getFormElements();
            /*Each filter in a filter set is represented by form element
            form element index 0 => Labels 'Field','Operator','Value'
            form element at index n+1 represents form element for filter n 
            */
            const valueOperandFormElement = formElements[filterIndexInFilterSet+1];
            /* form element field index 0 => And/Or button or label ,1 => field operand dropdown,
            2 => operator dropdown,3 => value operand dropdown,4 => action buttons
            */
            const valueOperandFormFieldIndex = 3;
            const controlToRemove = valueOperandFormElement.removeField(valueOperandFormFieldIndex);
            controlToRemove.destroy();
            valueOperandFormElement.insertField(control,valueOperandFormFieldIndex);
        }


    });
});