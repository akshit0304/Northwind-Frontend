sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/model/Formatter"
], (BaseController, JSONModel, setModel, Formatter) => {
    "use strict";

    return BaseController.extend("bd.businessportal.controller.CategoriesOverview", {
        formatter: Formatter,
        onInit: function () {
            // set event
            this.component = this.getOwnerComponent();
            this.main_page = this.byId("category_overview");
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");
            this.product_table = this.byId("category_overview_table");
            this.oNavContainer.setBusy();

            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                    
                    // this._load_order_table();
                }.bind(this),

                onBeforeShow: function () {
                    setModel.configureModel.call(this, "Categories.json");
                    let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id = ['category_overview_panel','info_category'];
                    for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                    }
                    this.component._buttonExpandLogic(1, 0);
                    this.product_table.bindElement(bind_path);
                    // i haven't use because supplier object has products detail
                    // setModel.loadTable.call(this, "Products.json",'category_overview_table',{
                    //     "modelName":"products",
                    //     "labelID":"CategoryID",
                    //     "labelParameter":null,
                    //     "bindElementID":"info_category"
                    // });
                }.bind(this),
            });

        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        detailPress:function(oEvent){
            this.oNavContainer.setBusy(true);
            var product_id = oEvent.getSource().getBindingContext().getProperty("ProductID");
            // console.log(this.component);
            this.component.second_binding=true;
            // set id in nav model in idOfBindElementSecond
            this.model.setProperty("/idOfBindElementSecond",product_id);
             this.root_element.getController()._loadView("ProductsOverview");
        }
        // _load_table: function () {
        //     // load data in json model
        //     this.product_table.setBusy(true);
        //     let Model = new JSONModel();
        //     Model.loadData("../Odata/Products.json").then(() => {
        //         this.getView().setModel(Model, "products");
        //         let oBinding = this.order_table.getBinding("items");
        //         let bind_path = this.model.getProperty("/idOfBindElement");
        //         let category_id =this.component.getModel().getProperty(bind_path+"/ProductID");
        //         console.log(category_id);

        //         let aFilters = [];
        //         let oFilter = new sap.ui.model.Filter("CategoryID", sap.ui.model.FilterOperator.EQ, category_id);
        //         aFilters.push(oFilter);

        //         // Apply filter to binding
        //         oBinding.filter(aFilters);
        //         this.order_table.setBusy();
        //     });
        // }
    });
});