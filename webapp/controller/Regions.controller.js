sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    "bd/businessportal/utils/setModel",
    // "sap/ui/core/BusyIndicator"
],(Controller,
    JSONModel,
    Formatter,
    Device,
    setModel,
    // BusyIndicator
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Regions", {
        formatter:Formatter,
        onInit() {
            this.main_page =this.byId("region_page");
            this.table =this.byId("table_region");
            this.component =this.getOwnerComponent();
             const expandFlag =this.component.expandFlag;
            this.root_element =this.component.byId("App");
            this.oNavContainer =  this.root_element.byId("navContainer");
            this.model_data =this.component.getModel();
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    // BusyIndicator.hide();
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Regions.json");
                }.bind(this)
            });
            // set delimeter in icon tab bar
            const tabBar =this.byId("region_tabBar");
            setModel.configureModel2.call(this,"Regions.json").then(()=>{
            const model =this.component.getModel();
            // console.log(model.getProperty("/results/3/RegionDescription"));
            // console.log(model.getProperty("/results/"+0+"/Territories/results").length)
            for(let i=0;i<4;i++){
                const temp_object =model.getObject("/results/"+i);
                const tabFilter =new sap.m.IconTabFilter({
                text:temp_object.RegionDescription,
                icon:"sap-icon://world",
                iconColor:sap.ui.core.IconColor.Neutral,
                tooltip:"total territories",
                key:temp_object.RegionID,
                count:temp_object.Territories.results.length
            });
            tabFilter.bindElement("/results/"+i);
            const tabSeparator =new sap.m.IconTabSeparator({
                icon:"" });
                tabBar.addItem(tabFilter);
                tabBar.addItem(tabSeparator);

            }
            
        });
            // tabBar.addItem(tabSeparator);
        },
        regionExpand:function(oEvent){
            let selectedItem =oEvent.getParameter("item");
            // let binding_path ='/results/'+selectedItem.getKey();
            // console.log(selectedItem.getKey());
            if(!this.overview_fragment){
            this.overview_fragment =this.loadFragment({
                type:"XML",
                name:"bd.businessportal.view.RegionsOverview"
            }).then((actual_fragment)=>{ 
                selectedItem.addContent(actual_fragment);
                 this.overview_fragment = actual_fragment;
                //  this.overview_fragment.getBinding()
                    // _BindElement(this,binding_path);
                //  this.overview_fragment.bindElement(binding_path);
            })
            }
            else{
            selectedItem.addContent(this.overview_fragment);
                // _BindElement(this,binding_path);
            // this.overview_fragment.bindElement(binding_path);
            }
            // bind element
            // BindElement.call(this,binding_path);
            // this.this.byId("overviewFragment").bindElement(binding_path);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            this.component.second_binding=true;
            var oContext_data = oEvent.getSource().getBindingContext().getProperty("TerritoryID");
            // console.log(oContext);
            // const id =oContext.getProperty("RegionID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElementSecond",oContext_data);
            this.root_element.getController()._loadView("TerritoriesOverview");
          },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        }
    });
})