sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "sap/m/MessageToast",
    "bd/businessportal/utils/OdataV4"
], (BaseController,Formatter,MessageToast,OdataV4) => {
    "use strict";

    return BaseController.extend("bd.businessportal.controller.CategoriesOverview", {
        formatter: Formatter,
        onInit: function () {
            const router =this.getOwnerComponent().getRouter();
            router.getRoute("categoryOverview").attachPatternMatched((oEvent)=>{
                const object_id =oEvent.getParameter("arguments").CID;
                const id =this.byId("category_overview_panel");
                id.bindElement(`MD>/Categories(${object_id})`);
            },this)
            // set event
            this.component = this.getOwnerComponent();
            this.main_page = this.byId("category_overview");
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("MD");
            this.product_table = this.byId("category_overview_table");
            // this.oNavContainer.setBusy();
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    // this.oNavContainer.setBusy();
                    // this._load_order_table();
                }.bind(this),
                // onBeforeShow: function () {
                //     setModel.configureModel.call(this, "Categories.json");
                //     let bind_path = this.model.getProperty("/idOfBindElement");
                //     const bind_elements_id = ['category_overview_panel','info_category'];
                //     for (const element of bind_elements_id) {
                //         this.byId(element)?.bindElement(bind_path);
                //     }
                //     this.component._buttonExpandLogic(1, 0);
                //     this.product_table.bindElement(bind_path);
                //     // i haven't use because supplier object has products detail
                //     // setModel.loadTable.call(this, "Products.json",'category_overview_table',{
                //     //     "modelName":"products",
                //     //     "labelID":"CategoryID",
                //     //     "labelParameter":null,
                //     //     "bindElementID":"info_category"
                //     // });
                // }.bind(this),
            });
            this.component.modelodataV4_instace._changeContextandId(this,"category_overview");

        },
        _V4Changed:function(oEvent){
            this.busyMechanism(1);
        },
        _V4Received:function(oEvent){
            this.busyMechanism(0);
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        pageOverview:function(oEvent){
            const object_id = oEvent.getSource().getBindingContext("MD").getProperty("ID");
            if(!object_id) {
                // this.oNavContainer.setBusy();   
                MessageToast.show("something went wrong \n ERROR!");
                throw new Error("Error id is undefined");
            }
            const router =this.component.getRouter();
            router.navTo("productOverview",{PID:object_id});
        },
        busyMechanism:function(flag=0){
            if(flag){
                this.byId("category_overview").setBusy(true);
                return;
            }
            this.byId("category_overview").setBusy();
        }
    });
});