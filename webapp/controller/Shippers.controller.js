sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    "bd/businessportal/utils/setModel",
],(Controller,
    Formatter,
    Device,
    setModel
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Shippers", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("shipper_page");
            this.component =this.getOwnerComponent();
             const expandFlag =this.component.expandFlag;
            this.table =this.byId("table_shipper");
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            // set media ---
            // Device.media.attachHandler((oEvent)=>{
            //     if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
            //       // console.log(table_ref.getWidth());
            //     }
            //   },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Shippers.json");
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
            // const id =oContext.getProperty("ShipperID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("ShippersOverview");
            // this.router.navTo("p_overview",{
            //   query:{
            //     "id":encodeURIComponent(id),
            //     "index":parseInt(index)
            //   }
            // })
          },
    });
})