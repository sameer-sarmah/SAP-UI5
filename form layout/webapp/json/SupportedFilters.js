const supportedFilters = [{
    "integrationName": "sap.sf.plt.task_foundation.sap_task_center_integration.push_tasks.push_tasks.v3",
    "eventType": "sap.hr.odm.task.decorated",
    "topic": "sap.hr.odm.task",
    "destinationCode":"SCP_TASK_CENTER"
}];
sap.ui.define([
], function () {
	"use strict";
    return supportedFilters;
});