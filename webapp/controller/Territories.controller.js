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
    return Controller.extend("bd.businessportal.controller.Territories", {
        formatter:Formatter,
        onInit() {
            this.main_page =this.byId("territory_page");
            this.table =this.byId("table_territory");
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
            // event bus
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Territories.json");
                }.bind(this)
            });      
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext().getPath();
            // console.log(oContext);
            // const id =oContext.getProperty("TerritoryID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("TerritoriesOverview");
          },
        //   filter code
        filterSearch: function (oEvent) {
            const configuration = {
                configurationProperty: [
                    {
                        controlType: "SearchBox",
                        key: "",
                        expression: "EQ"
                    },
                    {
                        controlType: "ComboBox",
                        key: "Region/RegionID",
                        expression: "EQ",
                    },

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
            // else if(codes['code']==1){
            //     console.log('product is present');
            // }
            // else{
            //     console.log('supplier is present');
            // }


        },
        filterClear: function (oEvent) {
            if (!this.genericFilter) {
                this.genericFilter = new GenericFilter(this, this.table);
            }
            const gf = this.genericFilter;
            if (!gf.GET_selectionSet()) {
                const selection_set = oEvent.getParameters("selectionSet").selectionSet;
                gf.SET_selectionSet(selection_set);
            }
            gf.resetFilter();
        },
        searchSuggest:function(oEvent){
            this.byId("t_search_field").suggest(true);
        },
        searchPressed:function(oEvent){
            // utility function 
            // let utility =function(key,expression,value){
            //     if(key &&expression && value){
            //         return {
            //             "key":key,
            //             "value":value,
            //             "expression":expression
            //         }
            //     }
            //     return;
            // };
            let filterEnum =sap.ui.model.FilterOperator;
            let query =oEvent.getParameter("query")?.trim();
            const params =[];
            params.push({
                            "key":"TerritoryDescription",
                            "expression":filterEnum.Contains
            })

            const filter_ar =setModel.searchParse(oEvent,params);
            this.table.getBinding("items").filter(filter_ar);
            // suggetion item
            if(query || query!==""){
                let search_field =this.byId("t_search_field");
                let suggestion_items =search_field.getSuggestionItems();
                let last_item_text =suggestion_items.at(0)?.getText();
                if(last_item_text===query){return;}

                // suggestion_items =suggestion_items.reverse();
                if(suggestion_items.length>5){
                    // suggestion_items.shift();
                    // suggestion_items.push(new sap.m.SuggestionItem({"text":query}));
                    // suggestion_items =suggestion_items.reverse();
                    search_field.removeSuggestionItem(5);
                }
               search_field.insertSuggestionItem(new sap.m.SuggestionItem({"text":query}));
                
                // search_field.removeItems
                
            }
            return 1;


        }

    });
})