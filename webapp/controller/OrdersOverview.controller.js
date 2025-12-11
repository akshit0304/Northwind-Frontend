sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/utils/OdataV4"

], (BaseController, Formatter, setModel,OdataV4) => {

    "use strict";
    return BaseController.extend("bd.businessportal.controller.OrdersOverview", {
        formatter: Formatter,
        onInit: function () {
            const router = this.getOwnerComponent().getRouter();
            router.getRoute("orderOverview").attachPatternMatched((oEvent) => {
                const object_id = oEvent.getParameter("arguments").OID;
                ['shipments', 'info_order', "o_customer", "o_employee", "order_dynamicPageTitle", "o_overview_info"].forEach((val) => {
                    this.byId(val)?.bindElement(`MD>/Orders(${object_id})`)
                });
                debugger;
            }, this)
            // router event ===
            this.main_page = this.byId("order_overview");
            // this.main_page.setBusy(true);
            // console.log("overview page initialized");
            this.component = this.getOwnerComponent();
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("MD");
            const ins_odatav4 =OdataV4.constructor(this,this.model,this.main_page);
            // this.getView().addEventDelegate({
            //     onAfterShow: function () {
            //         this.oNavContainer.setBusy();
            //         // this.byId("order_overview").focus();
            //     }.bind(this),

            //     onBeforeShow: function () {
            //         setModel.configureModel2.call(this, "Orders.json").then(() => {
            //             // start
            //             let bind_path;
            //             if (this.component.second_binding) {
            //                 this.component.second_binding = false;
            //                 const id = this.model.getProperty("/idOfBindElementSecond");
            //                 let index = setModel.idToIndex(this.component, "OrderID", id);
            //                 index = index != -1 ? index : 0;
            //                 // find index using the id if not exist then set is index zero
            //                 bind_path = "/results/" + index;
            //                 // console.log(bind_path);
            //             }
            //             else {
            //                 bind_path = this.model.getProperty("/idOfBindElement");
            //                 // console.log(bind_path);
            //             }
            //             // condition end
            //             // end
            //             // let bind_path = this.model.getProperty("/idOfBindElement");
            //             const bind_elements_id = ['shipments', 'info_order', "o_customer", "o_employee", "order_dynamicPageTitle", "o_overview_info"];
            //             for (const element of bind_elements_id) {
            //                 this.byId(element)?.bindElement(bind_path);
            //             }
            //             //    setModel.loadTable.call(this, "OrderDetails.json",'order_detail_table',{
            //             //        "modelName":"od",
            //             //        "labelID":"OrderID",
            //             //        "labelParameter":null,
            //             //        "bindElementID":"shipments"
            //             //     });
            //             this.component._buttonExpandLogic(1, 0);
            //         })
            //     }.bind(this),
            // });
        },
        navButtonPressed: function (oEvent) {
            this.root_element.getController().backButton(oEvent);
        },
    });
});