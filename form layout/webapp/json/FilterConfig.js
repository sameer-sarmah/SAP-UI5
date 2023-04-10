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
const filterConfigurations = [
	{
		"topicEventType": {
			"topic": "sap.hr.odm.task",
			"eventType": "sap.hr.odm.task.decorated"
		},
		"integrationName": "{{integrationName}}",
		"filterNode": {
			"operation": "and",
			"children": [
				{
					"operation": "and",
					"children": [
						{
							"fieldOperand": "age",
							"operation": "gt",
							"valueOperand": 50
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
		},
		"destinationCode": "SCP_TASK_CENTER"
	},
	{
		"topicEventType": {
			"topic": "sap.hr.timesheet",
			"eventType": "sap.hr.timesheet.vacation"
		},
		"integrationName": "{{integrationName}}",
		"filterNode": {
			"operation": "and",
			"children": [
				{
					"operation": "and",
					"children": [
						{
							"fieldOperand": "country",
							"operation": "eq",
							"valueOperand": "India"
						}
					]
				},
				{
					"operation": "and",
					"children": [
						{
							"fieldOperand": "department/name",
							"operation": "eq",
							"valueOperand": "Sales"
						}
					]
				}
			]
		},
		"destinationCode": "SCP_TASK_CENTER"
	}];
sap.ui.define([
], function () {
	"use strict";
    return filterConfigurations;
});