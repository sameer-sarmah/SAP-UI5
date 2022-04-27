sap.ui.define("sap/ui/demo/model/MenuModule",["sap/ui/base/Object"], function (Object) {
    "use strict";

    return Object.extend("sap.ui.demo.model.MenuModule", {

        getMenus: function () {
            return [
                {
                    "id": "XM_PROCESS_TYPE_INTEGRATION_CENTER",
                    "routeName" : "integrationCenter"
                },
                {
                    "id": "XM_PROCESS_TYPE_SCHEDULED_JOB",
                    "routeName" : "scheduledJobs"
                },
                {
                    "id": "XM_PROCESS_TYPE_MIDDLEWARE_INTEGRATIONS",
                    "routeName" : "middlewareIntegrations"
                },
                {
                    "id": "XM_PROCESS_TYPE_PREDELIVERED_INTEGRATIONS",
                    "routeName" : "PREDELIVERED_INTEGRATIONS"
                }
            
            ];
        }
    });

}
);