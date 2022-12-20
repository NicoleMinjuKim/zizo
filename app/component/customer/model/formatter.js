sap.ui.define([], function () {
    "use strict";
    return {
        statusText: function (sStatus) {
            switch (sStatus) {
                case "true":
                    return "O"
                case "false":
                    return "X";
                default:
                    return sStatus;
            }
        }
    };
});