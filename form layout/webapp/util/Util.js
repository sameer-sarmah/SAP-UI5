const EventToJsDataTypeMap ={
    STRING : "string",
    INTEGER: "integer", 
    BOOLEAN: "boolean"
};
sap.ui.define([
], function () {
	"use strict";
    return {
        typecast:function(targetDatatype,object){
            if(EventToJsDataTypeMap.STRING === targetDatatype){
                return object.toString();
            } else if(EventToJsDataTypeMap.INTEGER === targetDatatype){
                return parseInt(object);
            } else if(EventToJsDataTypeMap.BOOLEAN === targetDatatype){
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
        } 
    };
});