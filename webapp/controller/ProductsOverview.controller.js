sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/utils/Breadcrumb",
    "bd/businessportal/model/Formatter"
], (BaseController, JSONModel, setModel,Breadcrumb, Formatter) => {
    "use strict";
    // function checkProductId(fileName,key,value) {
    //     this.main_page.setBusy(true);
    //     const that =this;
    //     return new Promise((resolve)=>{
    //             let V =setModel.fetchObject(fileName,
    //                         {"key":key,"value":value},
    //                         that);
    //             resolve(V);
    //     })
    //     // return new Promise((resolve) => {
    //     //     const model =this.component.getModel();

    //     //     this.component.getModel("MD").read("/Products", {
    //     //         urlParameters: {
    //     //             "$expand": "Category,Supplier"
    //     //         },
    //     //         filters: [
    //     //             new sap.ui.model.Filter("ProductID", "EQ", id),
    //     //         ],
    //     //         success: function (oData) {
    //     //             const dataProduct_jsonModel = new JSONModel();
    //     //             dataProduct_jsonModel.setData({ "results": oData["results"] });
    //     //             this.getView().setModel(dataProduct_jsonModel);
    //     //             resolve(0)

    //     //         }.bind(this),
    //     //         error: function (msg) {
    //     //             console.log("error in requests");
    //     //             console.log(msg);
    //     //             resolve(null)
    //     //         }.bind(this)
    //     //     });
    //     // })
    // }

    return BaseController.extend("bd.businessportal.controller.ProductsOverview", {
        formatter: Formatter,
        onInit: function () {
            // set event
            this.component = this.getOwnerComponent();
            this.main_page = this.byId("product_overview");
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");
            // this.order_table = this.byId("order_table");

            this.oNavContainer.setBusy();

            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                    // this._load_order_table();
                }.bind(this),

                onBeforeShow: function () {
                    setModel.configureModel2.call(this, "Products.json").then(()=>{
                    let bind_path;
                    if(this.component.second_binding){
                        this.component.second_binding =false;
                        const id =this.model.getProperty("/idOfBindElementSecond");
                        let index = setModel.idToIndex(this.component,"ProductID",id);
                        index =index!=-1?index:0;
                        // find index using the id if not exist then set is index zero
                        bind_path="/results/"+index;
                        // console.log(bind_path);
                    }
                    else{
                        bind_path = this.model.getProperty("/idOfBindElement");
                        // console.log(bind_path);
                    }
                    // condition end
                    const bind_elements_id = ['dynamicPageTitle', 'product_general_info', 'info_product', 'info_supplier'];
                    for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                    }
                    
                    setModel.loadTable.call(this, "OrderDetails.json",'order_table',{
                        "modelName":"orders",
                        "labelID":"ProductID",
                        "labelParameter":null,
                        "bindElementID":"info_product"
                    });
                    })
                    this.component._buttonExpandLogic(1, 0);
                }.bind(this),
                
            });
        },
        // onBeforeRendering:function(){
        //     console.log("Product rendered");
        //     const list =this.root_element.getController().getBreadcrumbAr();
        //     Breadcrumb.createDynamicBreadcrumb(this,"po_breadcrumb",list);
        // },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        // _load_order_table: function () {
        //     // load data in json model
        //     this.order_table.setBusy(true);
        //     let orderModel = new JSONModel();
        //     orderModel.loadData("../Odata/OrderDetails.json").then(() => {
        //         this.getView().setModel(orderModel, "orders");
        //         let oBinding = this.order_table.getBinding("items");
        //         let bind_path = this.model.getProperty("/idOfBindElement");
        //         let product_id =this.component.getModel().getProperty(bind_path+"/ProductID");
        //         console.log(product_id);

        //         let aFilters = [];
        //         let oFilter = new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.EQ, product_id);
        //         aFilters.push(oFilter);

        //         // Apply filter to binding
        //         oBinding.filter(aFilters);
        //         this.order_table.setBusy();
        //     });
        // }
    });
});