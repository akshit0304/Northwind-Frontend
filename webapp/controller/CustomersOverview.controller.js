sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
  ], (BaseController,Formatter,setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.CustomersOverview", {
        formatter:Formatter,

        onInit:function() {
            
            this.main_page =this.byId("customer_overview");
            this.component =this.getOwnerComponent();
            this.model = this.component.getModel("nav");
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
           this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();
            
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                    setModel.configureModel2.call(this,"Customers.json").then(()=>{
                            // start
                    let bind_path;
                    if(this.component.second_binding){
                        this.component.second_binding =false;
                        const id =this.model.getProperty("/idOfBindElementSecond");
                        let index = setModel.idToIndex(this.component,"CustomerID",id);
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
                        const bind_elements_id =['c_dynamicPageTitle','info_customer','c_product_general_info','placed_orders_subsection'];
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                });
                    this.component._buttonExpandLogic(1, 0);
                }.bind(this),
            });
        },
        detailPress:function(oEvent){
            this.oNavContainer.setBusy(true);
            var id = oEvent.getSource().getBindingContext().getProperty("Orders/OrderID");
            // console.log(this.component);
            this.component.second_binding=true;
            // set id in nav model in idOfBindElementSecond
            this.model.setProperty("/idOfBindElementSecond",id);
            this.root_element.getController()._loadView("OrdersOverview");
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        }
        

    });
  });