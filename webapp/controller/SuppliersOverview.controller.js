sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
    
  ], (BaseController,Formatter,setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.SuppliersOverview", {
        formatter:Formatter,

        onInit:function() {
            this.main_page =this.byId("supplier_overview");
            this.component = this.getOwnerComponent();
           this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.req_flag = 0;
            this.oNavContainer.setBusy();
            this.model = this.component.getModel("nav");
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                    
                }.bind(this),

                onBeforeShow: function () {
                     setModel.configureModel.call(this,"Suppliers.json");
                        let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id =['o_info_supplier','supplier_overview_panel'];  
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                    this.component._buttonExpandLogic(1, 0);
                    setModel.loadTable.call(this,
                        "Products.json",
                        "o_products_detail_table",
                        {
                            "modelName":"pd",
                            "labelID":"SupplierID",
                            "labelParameter":null,
                            "bindElementID":"o_info_supplier"
                        }
                    )
                }.bind(this),
            });
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        detailPress:function(oEvent){
            this.oNavContainer.setBusy(true);
            var id = oEvent.getSource().getBindingContext('pd').getProperty("ProductID");
            // console.log(this.component);
            this.component.second_binding=true;
            // set id in nav model in idOfBindElementSecond
            this.model.setProperty("/idOfBindElementSecond",id);
             this.root_element.getController()._loadView("ProductsOverview");

        }
        

    });
  });