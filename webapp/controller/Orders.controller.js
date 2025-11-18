sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/utils/GenericFilter",
    
],(Controller,
    JSONModel,
    Formatter,
    Device,
    setModel,
    GenericFilter
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Orders", {
        formatter:Formatter,
        onInit() {
            this.main_page =this.byId("order_page");
            this.table =this.byId("table_order");
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
                    setModel.configureModel.call(this,"Orders.json");
                }.bind(this)
            })
        },
         onAfterRendering:function(){
            GenericFilter.prototype.setLocalModel(this,{fileName:"Customers.json",modelName:"cust"}).then((flag) => {
                         if (flag == 207){ //console.log('already not exists');
                         }
                    else {//console.log("exists fast load");
                    }
                })
             GenericFilter.prototype.setLocalModel(this,{fileName:"Employees.json",modelName:"emp"}).then((flag) => {
                         if (flag == 207){ //console.log('already not exists');
                         }
                    else {//console.log("exists fast load");
                    }
                })
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            // console.log(oEvent);
            var oContext = oEvent.getSource().getBindingContext().getPath();
            // const id =oContext.getProperty("OrderID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("OrdersOverview");
        },
         filterSearch: function (oEvent) {
            const configuration = {
                configurationProperty: [
                    {
                        controlType: "SearchBox",
                        key: "",
                        expression: ""
                    },
                    {
                        controlType: "ComboBox",
                        key: "EmployeeID",
                        expression: "EQ",
                    },
                     {
                        controlType: "ComboBox",
                        key: "ShipName",
                        keyOrValue:1,
                        expression: "Contains",
                    }
                ]
            }
            // console.log(oEvent.getParameters("selectionSet"));
            if (!this.genericFilter) {
                var selection_set = oEvent.getParameters("selectionSet").selectionSet;
                this.genericFilter = new GenericFilter(this, this.table);
                this.genericFilter.SET_selectionSet(selection_set);
            }
            const gf = this.genericFilter;
            gf.configureFilter(configuration);
            gf.applyFilter();
           
        },
          filterClear: function (oEvent) {
            // console.log("clear pressed");
            if (!this.genericFilter) {
                this.genericFilter = new GenericFilter(this, this.table);
                const selection_set = oEvent.getParameters("selectionSet").selectionSet;
                this.genericFilter.SET_selectionSet(selection_set);
            }
            const gf = this.genericFilter;
            gf.resetFilter();
        },
        searchSuggest:function(oEvent){
            this.byId("o_search_field").suggest(true);
        },
        searchPressed:function(oEvent){
            let filterEnum =sap.ui.model.FilterOperator;
            let query =oEvent.getParameter("query")?.trim();
            const params =[];
            params.push({
                            "key":"OrderID",
                            "expression":filterEnum.EQ
            });
            params.push({
                            "key":"Customer/ContactName",
                            "expression":filterEnum.Contains
            });

            const filter_ar =setModel.searchParse(oEvent,params);
            this.table.getBinding("items").filter(filter_ar);
            // suggetion item
            if(query || query!==""){
                let search_field =this.byId("c_search_field");
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
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },

    

    });
})