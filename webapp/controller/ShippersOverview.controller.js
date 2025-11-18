sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
], (BaseController, Formatter, setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.ShippersOverview", {
        formatter: Formatter,
        onInit: function () {
            this.main_page = this.byId("shipper_overview");
            // this.main_page.setBusy(true);
            this.component = this.getOwnerComponent();
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");
            this.oNavContainer.setBusy();

            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                    setModel.configureModel2.call(this, "Shippers.json").then(()=>{
                    let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id = ['sh_dynamicPageTitle', 'sh_product_general_info']; for (const element of bind_elements_id) {
                        for (const element of bind_elements_id) {
                            this.byId(element)?.bindElement(bind_path);
                        }
                        this.component._buttonExpandLogic(1, 0);
                        // i have seperately define the params and passed in labelParameter key in object because key name in shippers.json and orders.json are different.(shipperid & shipVia)
                        const labelParam =this.byId("sh_dynamicPageTitle").getBindingContext().getProperty("ShipperID");
                        setModel.loadTable.call(this, "Orders.json",'o_orders_table',{
                        "modelName":"sod",
                        "labelID":"ShipVia",
                        "labelParameter":labelParam,
                        "bindElementID":null
                    });
                    }
                });
                    
                }.bind(this),
            });


        },
        detailPress:function(oEvent){
              this.oNavContainer.setBusy(true);
            let id =oEvent.getSource().getBindingContext("sod").getProperty("OrderID");
             this.component.second_binding=true;
            // set id in nav model in idOfBindElementSecond
            this.model.setProperty("/idOfBindElementSecond",id);
            this.root_element.getController()._loadView("OrdersOverview");
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },

    });
});