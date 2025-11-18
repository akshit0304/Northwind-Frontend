sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/utils/GenericFilter"
    
    
],(Controller,
    Formatter,
    Device,
    setModel,
    GenericFilter
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Suppliers", {
        formatter:Formatter,
        onInit() {
            this.main_page =this.byId("supplier_page");
            this.table =this.byId("table_supplier");
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
            //   sap.ui.getCore().getEventBus().subscribe("product_loading", "myEvent",this.loaderOff,this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Suppliers.json");
                }.bind(this),
                onAfterShow:function(){
                    this.oNavContainer.setBusy();
                }.bind(this)
            });

        },
        onAfterRendering:function(){
            GenericFilter.prototype.setLocalModel(this,{fileName:"Countries.json",modelName:"country"}).then((flag) => {
                    //      if (flag == 207){ console.log('already not exists');}
                    // else {console.log("exists fast load");}
                })
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
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
                        key: "SupplierID",
                        expression: "EQ",
                    },
                    {
                        controlType: "ComboBox",
                        key: "Country",
                        expression: "Contains",
                        keyOrValue:1
                    },
                     {
                        controlType: "ComboBox",
                        key: "City",
                        expression: "Contains",
                        keyOrValue:1
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
            this.byId("supl_search_field").suggest(true);
        },
        searchPressed:function(oEvent){
            let filterEnum =sap.ui.model.FilterOperator;
            let query =oEvent.getParameter("query")?.trim();
            const params =[];
            params.push({
                    "key":"CompanyName",
                    "expression":filterEnum.Contains
            });
            params.push({
                    "key":"ContactName",
                    "expression":filterEnum.Contains
            });
            params.push({
                    "key":"SupplierID",
                    "expression":filterEnum.EQ
            });

            const filter_ar =setModel.searchParse(oEvent,params);
            this.table.getBinding("items").filter(filter_ar);
            // suggetion item
            if(query || query!==""){
                let search_field =this.byId("supl_search_field");
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
            // const id =oContext.getProperty("SupplierID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("SuppliersOverview");
          },
    

    });
})