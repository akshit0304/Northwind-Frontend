sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
], (BaseController, Formatter, setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.TerritoriesOverview", {
        formatter: Formatter,
        onInit: function () {

            this.main_page = this.byId("territory_overview");
            // this.main_page.setBusy(true);
            this.component = this.getOwnerComponent();
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();

            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                    setModel.configureModel2.call(this, "Territories.json").then(()=>{
                    let bind_path;
                    if(this.component.second_binding){
                        this.component.second_binding =false;
                        const id =this.model.getProperty("/idOfBindElementSecond");
                        let index = setModel.idToIndex(this.component,"TerritoryID",id);
                        index =index!=-1?index:0;
                        // find index using the id if not exist then set is index zero
                        bind_path="/results/"+index;
                        // console.log(bind_path);
                    }
                    else{
                        bind_path = this.model.getProperty("/idOfBindElement");
                        // console.log(bind_path);

                    }
                    const bind_elements_id = ['t_dynamicPageTitle','territory_overview','head_panel'];
                    for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                    }
                    let id =this.byId("info_head_person").getBindingContext().getProperty("EmployeeID");
                    id?this.byId("head_panel").setVisible(true) : this.byId("head_panel").setVisible(false);
                });
                }.bind(this),
            });
        },
        detailPress:function(oEvent){
            let id = oEvent.getParameter("id").split('--');
            // console.log(typeof id);
            if(id.at(-1)=="more"){
                let id =this.byId("info_head_person").getBindingContext().getProperty("EmployeeID");
                 this.oNavContainer.setBusy(true);
                this.component.second_binding=true;
                // set id in nav model in idOfBindElementSecond
                this.model.setProperty("/idOfBindElementSecond",id);
                this.root_element.getController()._loadView("EmployeesOverview");
            } 
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },


    });
});