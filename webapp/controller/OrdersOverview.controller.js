sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel",

  ], (BaseController,JSONModel,Formatter,setModel) => {

    "use strict";
    // function checkProductId(id,index){
    //     // this.byId("dynamicPageTitle").setBusy(true);
    //     this.main_page.setBusy(true);
    //     return new Promise((resolve)=>{
    //         this.component.getModel("MD").read("/Orders",{
    //             urlParameters:{
    //                 "$expand":"Customer,Order_Details,Employee,Shipper",
    //                 "$top":10,
    //                 "$skip":0
    //             },
    //             filters: [
    //                 new sap.ui.model.Filter("OrderID", "EQ", id),
    //             ],
    //             success:function(oData){
    //                 const dataProduct_jsonModel =new JSONModel();
    //                 dataProduct_jsonModel.setData({"results":oData["results"]});
    //                 // console.log(dataProduct_jsonModel.getJson());
    //                 this.getView().setModel(dataProduct_jsonModel);
    //                 resolve(0);
    //             }.bind(this),
    //             error:function (msg) {
    //                 console.log("error in requests");
    //                 console.log(msg);
    //                 resolve(null);
    //             }
    //         });
    // })
    // }
  
    return BaseController.extend("bd.businessportal.controller.OrdersOverview", {
        formatter:Formatter,
        onInit:function() {
            
            this.main_page =this.byId("order_overview");
            // this.main_page.setBusy(true);
            // console.log("overview page initialized");
            this.component = this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");
            this.oNavContainer.setBusy();
             
            
                this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                    // this.byId("order_overview").focus();
                }.bind(this),

                onBeforeShow: function () {
                        setModel.configureModel2.call(this,"Orders.json").then(()=>{
                        // start
                    let bind_path;
                    if(this.component.second_binding){
                        this.component.second_binding =false;
                        const id =this.model.getProperty("/idOfBindElementSecond");
                        let index = setModel.idToIndex(this.component,"OrderID",id);
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
                        // end
                        // let bind_path = this.model.getProperty("/idOfBindElement");
                        const bind_elements_id =['shipments','info_order',"o_customer","o_employee","order_dynamicPageTitle","o_overview_info"];       
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                    //    setModel.loadTable.call(this, "OrderDetails.json",'order_detail_table',{
                    //        "modelName":"od",
                    //        "labelID":"OrderID",
                    //        "labelParameter":null,
                    //        "bindElementID":"shipments"
                    //     });
                    this.component._buttonExpandLogic(1, 0);
                })
                }.bind(this),
            });
           
        
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
    });
  });