sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    "bd/businessportal/utils/setModel"
],(Controller,
    Formatter,
    Device,
    setModel
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Employees", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("employee_page");
            this.table =this.byId("table_employee");
            // this.root_element =sap.ui.getCore().byId("container-bd.businessportal---App");
            // this.component = sap.ui.core.Component.getOwnerComponentFor(this.root_element);
            this.component =this.getOwnerComponent();
             const expandFlag =this.component.expandFlag;
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                //   this.table.setWidth("100%");
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Employees.json");
                }.bind(this)
            });
        },
        searchSuggest:function(oEvent){
            this.byId("emp_search_field").suggest(true);
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        searchPressed:function(oEvent){
            let filterEnum =sap.ui.model.FilterOperator;
            let query =oEvent.getParameter("query")?.trim();
            const params =[];
           params.push({
                            "key":"FirstName",
                            "expression":filterEnum.Contains
            });
            params.push({
                            "key":"Title",
                            "expression":filterEnum.StartsWith
            });
            params.push({
                            "key":"LastName",
                            "expression":filterEnum.Contains
            });
            params.push({
                            "key":"EmployeeID",
                            "expression":filterEnum.EQ
            });

            const filter_ar =setModel.searchParse(oEvent,params);
            this.table.getBinding("items").filter(filter_ar);
            // suggetion item
            if(query || query!==""){
                let search_field =this.byId("emp_search_field");
                let suggestion_items =search_field.getSuggestionItems();
                let last_item_text =suggestion_items.at(0)?.getText();
                if(last_item_text===query){return;}
                if(suggestion_items.length>5){
                   
                    search_field.removeSuggestionItem(5);
                }
               search_field.insertSuggestionItem(new sap.m.SuggestionItem({"text":query}));
                
                // search_field.removeItems
                
            }
            return 1;

        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext().getPath();
            // console.log(oContext);
            // const id =oContext.getProperty("EmployeeID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("EmployeesOverview");
          },
    });
})