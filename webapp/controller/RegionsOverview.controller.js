sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
  ], (BaseController,JSONModel,Formatter,setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.RegionsOverview", {
        formatter:Formatter,
        onInit:function() {
            
            this.main_page =this.byId("region_overview");
            // this.main_page.setBusy(true);
            this.component = this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();
            
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                setModel.configureModel.call(this,"Regions.json");
                let bind_path = this.model.getProperty("/idOfBindElement");
                const bind_elements_id =['r_dynamicPageTitle','info_employee','r_product_general_info',"region_overview"];
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                    this.component._buttonExpandLogic(1, 0);
                }.bind(this),
            });
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        

    });
  });