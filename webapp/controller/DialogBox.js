sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("bd.businessportal.controller.DialogBox", {
        constructor:function(ref){
            this.that =ref;
            
        },
        dialogClose: function (oEvent) {
            let dialog =this.that.point;
            if(dialog && dialog.isOpen()){
                dialog.close();
                dialog.removeContent();
                // dialog.fireAfterClose(oEvent.getSource());
            }
        },
    });
});
