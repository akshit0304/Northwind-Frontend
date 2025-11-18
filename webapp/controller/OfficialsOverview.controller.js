sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel",
  ], (BaseController,Formatter,setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.OfficialsOverview", {
        formatter:Formatter,

        onInit:function() {
            
            this.main_page =this.byId("manager_overview");
            this.component =this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();
           
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                        setModel.configureModel2.call(this,"Officials.json").then(()=>{
                        let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id =['m_dynamicPageTitle','m_form','info_manager','manager_general_info',"table_info_label","table_info_label_t",'o_territories',"o_team"];
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                    this.byId("officials_subsection").setTitle("About "+this.byId("m_dynamicPageTitle").getBindingContext().getProperty("FirstName"));
                    const labelParam =this.byId("m_dynamicPageTitle").getBindingContext().getProperty("EmployeeID");

                    // bind teams data
                    setModel.loadTable.call(this,
                        "Employees.json",
                        "o_team",
                        {   "modelName":"ed",
                            "labelID":"ReportsTo",
                            "labelParameter":labelParam,
                            "bindElementID":null
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
            var id = oEvent.getSource().getBindingContext('ed').getProperty("EmployeeID");
            // console.log(this.component);
            this.component.second_binding=true;
            // set id in nav model in idOfBindElementSecond
            this.model.setProperty("/idOfBindElementSecond",id);
             this.root_element.getController()._loadView("EmployeesOverview");
        }
        

    });
  });