sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
  ], (BaseController,JSONModel,Formatter,setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.EmployeesOverview", {
        formatter:Formatter,

        onInit:function() {
            
            this.main_page =this.byId("employee_overview");
            this.component =this.getOwnerComponent();
            this.model = this.component.getModel("nav");
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
        //    this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();
            
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                    setModel.configureModel2.call(this,"Employees.json").then(()=>{
                            // start
                    let bind_path;
                    if(this.component.second_binding){
                        this.component.second_binding =false;
                        const id =this.model.getProperty("/idOfBindElementSecond");
                        let index = setModel.idToIndex(this.component,"EmployeeID",id);
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
                    const bind_elements_id =['e_dynamicPageTitle','e_form','info_employee','e_product_general_info',"o_e_orders"];
                    for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                    }
                    this.byId("employee_subsection").setTitle("About " +this.byId("e_dynamicPageTitle").getBindingContext().getProperty("FirstName"));
                    // orders table
                    setModel.loadTable.call(this,
                        "Orders.json",
                        "o_e_orders",
                        {
                            "modelName":"od",
                            "labelID":"EmployeeID",
                            "labelParameter":null,
                            "bindElementID":"info_employee"
                        }
                    )
                });
                    this.component._buttonExpandLogic(1, 0);
                }.bind(this),
            });
        },
         navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
         detailPress:function(oEvent){
            this.oNavContainer.setBusy(true);
            var id = oEvent.getSource().getBindingContext('od').getProperty("EmployeeID");
            // console.log(this.component);
            this.component.second_binding=true;
            // set id in nav model in idOfBindElementSecond
            this.model.setProperty("/idOfBindElementSecond",id);
             this.root_element.getController()._loadView("OrdersOverview");
        }
        

    });
  });