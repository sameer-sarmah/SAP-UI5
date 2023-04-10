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
                "supportedValues" : ["Male","Female"]
            },
            {
                "name": "lob",
                "dataType": "string_set"
            }
        ]
    },
    {
        "eventType": "sap.hr.timesheet.vacation",
        "topic": "sap.hr.timesheet",
        "sourceArea": "MODULE_ECT",
        "filterParameters": [{
                "name": "department/name",
                "dataType": "string"
            }, {
                "name": "age",
                "dataType": "integer"
            },{
                "name": "country",
                "dataType": "string"
            },
            {
                "name": "lob",
                "dataType": "string_set"
            }
        ]
    }
];

sap.ui.define([
], function () {
	"use strict";
    return eventMetadata;
});