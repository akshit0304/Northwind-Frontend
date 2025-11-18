sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    function _setTileState(state){
        try {
            if(state=="Loaded" || state=="Loading") this.nav_tile?.setState(state);
            else throw new Error("state value is invalid");
        } catch (error) {
            throw new Error(error.stack);
        }
    }

    return Controller.extend("bd.businessportal.controller.View1", {
        onInit() {
            this.component =this.getOwnerComponent();
            this.router =this.component.getRouter();
            this.page =this.byId("role_page");

            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.nav_tile?.setState(null);
                }.bind(this)
            });

        },
        tilePressed:function(oEvent){
            this.nav_tile =oEvent.getSource();
            _setTileState.call(this,"Loading");
            this.router.navTo("o_manager",{});
            
        }
    });
});