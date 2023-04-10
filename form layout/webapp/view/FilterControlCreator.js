sap.ui.define(["sap/ui/base/Object"
], function (Object) {
	"use strict";
    return Object.extend("FilterControlCreator", {
        constructor: function(controller,form,eventMetadata,supportedFilters) {
            this.controller = controller;
            this.eventMetadata = eventMetadata;
            this.supportedFilters = supportedFilters;
            this.form = form;
        },
        wrapItemsInFlexBox: function(items, alignItems, justifyContent, layoutData, growFactor) {
            if (items instanceof Array && items.length > 0) {
                const childrenFlexBoxes = items.map((item) => {
                    const childFlexBox = new sap.m.FlexBox({
                        "direction": sap.m.FlexDirection.Row,
                        "alignItems": alignItems,
                        "justifyContent": justifyContent,
                        fitContainer: true
                    });
                    if (growFactor) {
                        childFlexBox.setLayoutData(new sap.m.FlexItemData({
                            growFactor: 1
                        }));
                    }
                    childFlexBox.addItem(item);
                    return childFlexBox;
                });
                const parentFlexBox = new sap.m.FlexBox({
                    "width": "100%",
                    "direction": sap.m.FlexDirection.Row,
                    "alignItems": alignItems,
                    "justifyContent": justifyContent,
                    fitContainer: true,
                    "items": childrenFlexBoxes
                });
                parentFlexBox.addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom");
                if (layoutData) {
                    parentFlexBox.setLayoutData(layoutData);
                }
                return parentFlexBox;
            }
        },
        createValueOperandDropdown: function (supportedValues,filterSetIndex, filterIndexInFilterSet, controller) {
            if(supportedValues && supportedValues instanceof Array){
                const select = new sap.m.Select({
                    change: controller.eventTypeSelected.bind(controller,filterSetIndex, filterIndexInFilterSet),
                    width:"100%",
                    layoutData: new sap.m.FlexItemData({
                        growFactor: 1
                    })
                });
                const items = supportedValues.map((supportedValue) => new sap.ui.core.Item({ 
                    "key": supportedValue, 
                    "text": supportedValue
                }));
                items.forEach((item) => select.addItem(item));
                return select;
            }
        },
        createValueOperandInput: function (valueOperand,filterSetIndex, filterIndexInFilterSet, controller) {
            const valueOperandInput = new sap.m.Input({
                submit: controller.valueInputHandler.bind(controller, filterSetIndex, filterIndexInFilterSet),
                layoutData: new sap.m.FlexItemData({
                    growFactor: 1
                })
            });
            if(valueOperand){
                valueOperandInput.setValue(valueOperand);
            }
            return  valueOperandInput;  
        },
        createValueOperandInputFlexBox: function (valueOperand,filterSetIndex, filterIndexInFilterSet, controller) {
            const valueOperandInput = this.createValueOperandInput(valueOperand,filterSetIndex, filterIndexInFilterSet, controller);
            const valueOperandInputFlexBox = this.wrapItemsInFlexBox([valueOperandInput], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                new sap.ui.layout.GridData({
                    span: "XL3 L3 M3"
                }), 1);
            return  valueOperandInputFlexBox;  
        },
        createValueOperandControl: function(filterConfig,fieldOperand,valueOperand,filterSetIndex, filterIndexInFilterSet, controller){
            const eventMetadatum = this.eventMetadata.find((eventMeta) => {
                return (filterConfig.topicEventType.topic === eventMeta.topic && filterConfig.topicEventType.eventType === eventMeta.eventType);
            });
            const filterParam = eventMetadatum.filterParameters.find((filterParam) => filterParam.name === fieldOperand );
            // if the selected field is a have list of allowed, values then the value control should be a dropdown otherwise a input 
            if(filterParam && filterParam.supportedValues  && filterParam.supportedValues instanceof Array){
                const supportedValues = filterParam.supportedValues;
                const valueOperandDropdown = this.createValueOperandDropdown(supportedValues,filterSetIndex, filterIndexInFilterSet,controller);
                if(valueOperand){
                    valueOperandDropdown.setSelectedKey(valueOperand);
                }              
                const valueOperandDropdownFlexBox = this.wrapItemsInFlexBox([valueOperandDropdown], sap.m.FlexAlignItems.Center, sap.m.FlexAlignItems.Center,
                    new sap.ui.layout.GridData({
                        span: "XL3 L3 M3"
                    }),1);
                return valueOperandDropdownFlexBox;
            } 
            return this.createValueOperandInputFlexBox(valueOperand,filterSetIndex, filterIndexInFilterSet,controller);
        },
        createEventTypeDropdown: function (filterConfigs, controller) {
            const select = new sap.m.Select({
                change: controller.eventTypeSelected.bind(controller),
                layoutData: new sap.ui.layout.GridData({
                    span: "XL4 L4"
                })
            });
            const items = filterConfigs.map((filterConfig) => new sap.ui.core.Item({ 
                "key": `${filterConfig.topicEventType.topic}_${filterConfig.topicEventType.eventType}`, 
                "text": filterConfig.topicEventType.topic 
            }));
            items.forEach((item) => select.addItem(item));
            return select;
        },
        createAddOrButton: function(controller, operation, filterSetIndex, isRootOperation) {
            const oAndOrControl = new sap.m.SegmentedButton({
                items: [new sap.m.SegmentedButtonItem({
                        text: "And",
                        key: "and"
                    }),
                    new sap.m.SegmentedButtonItem({
                        text: 'Or',
                        key: "or"
                    })
                ],
                layoutData: new sap.m.FlexItemData({
                    growFactor: 1,
                    minWidth: "200px"
                }),
                selectionChange: controller.addOrButtonSelectionChangeHandler.bind(controller, filterSetIndex, isRootOperation)
            });
            oAndOrControl.setSelectedKey(operation);
            return oAndOrControl;
        },
        createDeleteFilterButton: function(filterSetIndex, filterIndexInFilterSet, controller) {
            const deleteButton = new sap.m.Button({
                icon: "sap-icon://sys-cancel",
                type: sap.m.ButtonType.Transparent,
                press: controller.deleteFilter.bind(controller, filterSetIndex, filterIndexInFilterSet)
            });
            return deleteButton;
        },
        createAddFilterButton: function(filterSetIndex, controller) {
            //Add a add button to the last filter in a filter set
            const addButton = new sap.m.Button({
                icon: "sap-icon://sys-add",
                type: sap.m.ButtonType.Transparent,
                press: controller.addFilterInFilterSet.bind(controller, filterSetIndex)
            });
            return addButton;
        },
        createAddFilterSetButton: function(controller) {
            const addFilterSetButton = new sap.m.Button({
                text: "Add Filter Set",
                icon: "sap-icon://add",
                type: sap.m.ButtonType.Transparent,
                press: controller.addFilterSet.bind(controller)
            });
            return addFilterSetButton;
        },
        createFieldOperandDropdown: function(filterSetIndex, filterIndexInFilterSet,topic,eventType, controller) {
            const select = new sap.m.Select({
                change: controller.fieldDropdownHandler.bind(controller, filterSetIndex, filterIndexInFilterSet),
                layoutData: new sap.m.FlexItemData({
                    growFactor: 1
                }),
                width:"100%"
            });
            const eventMetadatum = this.eventMetadata.find((eventMeta) => {
                return (topic === eventMeta.topic && eventType === eventMeta.eventType);
            });

            const items = eventMetadatum.filterParameters.map((filterParamNode)=>{
                return new sap.ui.core.Item({
                    key: `${filterParamNode.name}`,
                    text: `${filterParamNode.name}`
                })
            });
            items.forEach((item) => select.addItem(item));
            return select;
        },
        createOperationDropdown: function(filterSetIndex, filterIndexInFilterSet,controller) {
            const select = new sap.m.Select({
                items: [
                    new sap.ui.core.Item({
                        key: "eq",
                        text: "Equal"
                    }),
                    new sap.ui.core.Item({
                        key: "ne",
                        text: "Not equal"
                    }),
                    new sap.ui.core.Item({
                        key: "gt",
                        text: "Greater than"
                    }),
                    new sap.ui.core.Item({
                        key: "ge",
                        text: "Greater than or equal to "
                    })
                ],
                change: controller.opertionDropdownHandler.bind(controller, filterSetIndex, filterIndexInFilterSet),
                layoutData: new sap.m.FlexItemData({
                    growFactor: 1
                })
            });
            return select;
        },
        createActionButtonsFlexBox:function(filterConfig,filterSetIndex, filterIndexInFilterSet,includeAddFilterButton, controller){
            // includeAddFilterButton implies that add filter button should be applicable provided it doesnot breach the max limit 
            const deleteFilterButton = this.createDeleteFilterButton(filterSetIndex, filterIndexInFilterSet, controller);
            const isAddFilterButtonAllowed = this.showAddFilterButton(filterConfig,5);   
            let actionButtons = [deleteFilterButton];
            if(includeAddFilterButton === true && isAddFilterButtonAllowed === true){
                const addFilterButton = this.createAddFilterButton(filterSetIndex, controller);
                actionButtons.push(addFilterButton);
            } 
            const actionButtonsFlexBox = this.wrapItemsInFlexBox(actionButtons, sap.m.FlexAlignItems.Start, sap.m.FlexAlignItems.Start,
                new sap.ui.layout.GridData({
                    span: "XL2 L2 M2"
                }));
            return actionButtonsFlexBox;
        },
        showAddFilterButton:function(filterConfig,maxFiltersAllowed){
            const filterSets = filterConfig.filterNode.children;
            const totalFilters = filterSets.reduce((accumulatedNumberOfFilters,filterSet)=>{
                return accumulatedNumberOfFilters + filterSet.children.length;
            },0);
            return totalFilters >= maxFiltersAllowed ? false : true;
        }


      });
    
}
);