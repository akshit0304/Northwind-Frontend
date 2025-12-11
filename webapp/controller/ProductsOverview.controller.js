sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "sap/m/MessageToast"
], (BaseController, Formatter,MessageToast) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.ProductsOverview", {
        formatter: Formatter,
        onInit: function () {
            // set event
            const router =this.getOwnerComponent().getRouter();
            router.getRoute("productOverview").attachPatternMatched((oEvent)=>{
                const object_id =oEvent.getParameter("arguments").PID;
                // const id =this.byId("dynamicPageTitle");
                // id.bindElement(`MD>/Products(${object_id})`);
                // bindArray
                ["dynamicPageTitle","product_general_info","info_product","info_supplier","orders"].forEach((val)=>{
                    this.byId(val)?.bindElement(`MD>/Products(${object_id})`)
                });
                // set custom data in order table
                this.order_table.data("pID",object_id);
                // this._makeOrderRequest();
            },this)
            this.component = this.getOwnerComponent();
            this.main_page = this.byId("product_overview");
            this.root_element = this.component.byId("App");
            this.order_table = this.byId("order_table");
            this.model =this.component.getModel("MD");
            this.component.modelodataV4_instace._changeContextandId(this,"product_overview");
            this.getView().addEventDelegate({
                // onBeforeShow: function () {
                //     setModel.configureModel2.call(this, "Products.json").then(()=>{
                //     let bind_path;
                //     if(this.component.second_binding){
                //         this.component.second_binding =false;
                //         const id =this.model.getProperty("/idOfBindElementSecond");
                //         let index = setModel.idToIndex(this.component,"ProductID",id);
                //         index =index!=-1?index:0;
                //         // find index using the id if not exist then set is index zero
                //         bind_path="/results/"+index;
                //         // console.log(bind_path);
                //     }
                //     else{
                //         bind_path = this.model.getProperty("/idOfBindElement");
                //         // console.log(bind_path);
                //     }
                //     // condition end
                //     const bind_elements_id = ['dynamicPageTitle', 'product_general_info', 'info_product', 'info_supplier'];
                //     for (const element of bind_elements_id) {
                //         this.byId(element)?.bindElement(bind_path);
                //     }
                    
                //     setModel.loadTable.call(this, "OrderDetails.json",'order_table',{
                //         "modelName":"orders",
                //         "labelID":"ProductID",
                //         "labelParameter":null,
                //         "bindElementID":"info_product"
                //     });
                //     })
                //     this.component._buttonExpandLogic(1, 0);
                // }.bind(this),  
            });
        },
        onAfterRendering:function(){
            
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
            router.navTo("orderOverview",{OID:object_id});
        },
        _makeOrderRequest: function(){
            const pID =this.order_table?.data("pID");
            debugger;
            this.order_table.bindItems(`MD>/Orders`,);
            
        }
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