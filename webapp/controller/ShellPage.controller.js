sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    "sap/m/library",
	"sap/tnt/library",
    "sap/ui/core/mvc/XMLView"
    // 'sap/viz/ui5/format/ChartFormatter',
    // 'sap/viz/ui5/api/env/Format'
],(Controller,
    JSONModel,
    Formatter,
    Device,
    library,
    tntLibrary,
    XMLView
    // ChartFormatter,
    // Format,
        )=>{
    "use strict"
    const oData = {
        customers: [
          { customerName: "Customer A", orderAmount: 1200 },
          { customerName: "Customer B", orderAmount: 950 },
          { customerName: "Customer C", orderAmount: 875 },
          { customerName: "Customer D", orderAmount: 600 },
          { customerName: "Customer E", orderAmount: 450 }
        ]
      };
    return Controller.extend("bd.businessportal.controller.ShellPage", {
        formatter:Formatter,
        /**
         * set focus for given id of control 
         * @param {string} id - id of control
        */
        _setFocus:function(id){
            if(!id) return 0
            const control = this.byId(id);
            if(control){
                control.focus();
            }
            return 1;
        },
        _setNavigationList:function(id){
            const control =this.byId(id);
            // console.log(control.getItems());
            const first_list_item =control.getItems()[0];
            control.setSelectedItem(first_list_item);
            // console.log(this.getLocalId(control.getSelectedKey(control)));
        },
        onInit() {
            console.log("shell page is loaded");
            this.main_page =this.byId("shell_page");
            this.oNavContainer = this.byId("navContainer");
            this.component =this.getOwnerComponent();
            this.router =this.component.getRouter();
            // set dummy model for chart
            const oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel);
            // end dummy model
            // set media ---
            // === event bus ===
            // sap.ui.getCore().getEventBus().subscribe()
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                }
              },this);

            // event delegation
            this.getView().addEventDelegate({
                
                onAfterShow:function(){
                    this._setFocus("dashboard");
                    this._setNavigationList('list');
                }.bind(this)
            });
        },
        onExit(){
            console.log("dashboard exit");
        },
        _loadView:function(sViewName){
            if(!sViewName || typeof sViewName !='string') return "error";
            let oExistingPage = this.oNavContainer.getPages()
            .find(p => p.getViewName && p.getViewName().endsWith(sViewName));

            if (oExistingPage) {
                this.oNavContainer.to(oExistingPage);
                return;
            }

            XMLView.create({ viewName: "bd.businessportal.view." + sViewName }).then(oView => {
                // sap.ui.core.Component.(oView, oComponent);
                this.oNavContainer.addPage(oView);
                this.oNavContainer.to(oView);
                this.oNavContainer.setBusy();
            });
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        onItemSelect: function (oEvent) {
            this.oNavContainer.setBusy(true);
			const oItem = oEvent.getParameter("item");
            const oItemKey =oItem.getKey();
            // console.log(oItem.getKey());
			// this.byId("navContainer").to(this.getView().createId(oItem.getKey()));
            // important === to delete the content ===
            // const page =this.byId("dashboard_page");
            // const parent_page = page?.getParent();
            // parent_page?.removePage(page);
            // console.log(page);
            // === === ===
            this._loadView(oItemKey);

            
		},

    });
})