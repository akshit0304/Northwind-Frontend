sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/General",
    "sap/ui/model/json/JSONModel"

], (Controller,
    Formatter,
    General,
    JSONModel
) => {
    "use strict"
    return Controller.extend("bd.businessportal.controller.Categories", {
        formatter: Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page = this.byId("category_page");
            this.table = this.byId("table_category");
            this.component = this.getOwnerComponent();
            const expandFlag = this.component.expandFlag;
            // this.oNavContainer = this.component.byId("App--navContainer");
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.root_element.byId('navContainer');
            // this.rc =this.root_element.getController();
            // this.root_element =sap.ui.getCore().byId("container-bd.businessportal---App");
            // this.component = sap.ui.core.Component.getOwnerComponentFor(this.root_element);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            this.getView().addEventDelegate({
                onBeforeShow: function () {
                    this.component._buttonExpandLogic(1, expandFlag);
                }.bind(this)
            })
            // odataV4 instace parameter set
            this.component.modelodataV4_instace._changeContextandId(this, "category_page");

        },
        onAfterRendering() {
            console.log("category page after rendering");
            // json model for form data
            this.local_data =new JSONModel({"categoryName":null,"categoryDescription":null},true);
            this.getView().setModel(this.local_data,"form_local");
            // json model end
            if (!this.add_category_frag) {
                this.add_category_frag = this.loadFragment({
                    name: "bd.businessportal.view.Dialog_category"
                });

                this.add_category_frag.then((oDialog)=>{
                    this.byId("dialog_category_close").attachPress({},(oEvent)=>{
                        oDialog.close();
                    })
                })
            }
        },
        // onBeforeRendering:function(){
        //     // createDynamicBreadcrumb.call(this);
        //     const list =this.rc.getBreadcrumbAr();
        //     Breadcrumb.createDynamicBreadcrumb(this,"c_breadcrumb",list);
        // },
        navButtonPressed: function (oEvent) {
            this.root_element.getController().backButton(oEvent);
        },
        overViewPage: function (oEvent) {
            // console.log("nav pressed");
            var object_id = oEvent.getParameter('listItem').getBindingContext("MD").getProperty("ID");
            if (!object_id) {
                throw new Error("Error id is undefined");
            }
            // console.log(oContext);
            // const id =oContext.getProperty("OrderID");
            // breadcrumb ---
            // let current_view =this.getView().getViewName().match(/\.\w+\w$/g)[0].slice(1);
            // let navigate_view_code =this.rc.getIdToLink("CategoriesOverview");
            // if(this.rc.getAdjecencyListData(this.rc.last_view_code).includes(navigate_view_code)){
            //     let last_level =this.rc.getBreadcrumbAr(-1)['level'];
            //     const breadcrumb_obj ={
            //                 "name":"CategoriesOverview",
            //                 "level":last_level+1,
            //                 "bindingData":oContext,
            //                 "id":"CategoriesOverview",
            //                 "code":navigate_view_code
            //     };
            //     this.rc.setBreadcrumbAr(breadcrumb_obj);
            // }
            // const model =this.component.getModel("nav");
            // model.setProperty("/idOfBindElement",oContext);
            // this.root_element.getController()._loadView("CategoriesOverview");
            const router = this.component.getRouter();
            router.navTo("categoryOverview", { CID: object_id });
        },
        add_category: function (oEvent) {
            console.log("button pressed");
            if (!this.add_category_frag) {
                this.add_category_frag = this.loadFragment({
                    name: "bd.businessportal.view.Dialog_category"
                });  
                // if state end
            }
            this.add_category_frag.then((oDialog) => {
                    oDialog.open();
                })
            
        },
        submit_category: function(oEvent){
            console.log("submit button pressed");
            
            const form_cntr_content =this.byId("category_form").getContent();
            let validation_obj ={
                total_needed_flag :2,
                validataion_flag:0
            };
            form_cntr_content.forEach((cntr)=>{
                if(cntr.getMetadata()["_sClassName"]=="sap.m.Input" && cntr.getValueState()=="None"){
                       validation_obj['validataion_flag']++;
                }
            });
            if(validation_obj['total_needed_flag']==validation_obj['validataion_flag']){
                console.log("all i/p validated");
                // json object data
                const form_local =this.getView().getModel("form_local");
                let form_local_data =form_local.getJSON();
                // make odata v4 create request ----
                if(!this.component.getModel("MD").hasPendingChanges()){
                    // debugger;
                    //    const temp =this.component.getModel("MD").createBindingContext('/',"MD");
                        const oList = this.component.getModel("MD").bindList("/Categories")
                    // debugger;
                    console.log(form_local_data);
                    // debugger;
                    oList.create({
                        CategoryName: form_local.getProperty("/categoryName"),
                        Description:form_local.getProperty("/categoryDescription")
                    });
                    this.component.getModel("MD").submitBatch("$auto").then((a)=>{
                        console.log(a);
                        form_local.setData({"categoryName":null,"categoryDescription":null});
                        this.byId("table_category").getBinding("items").refresh();
                        // this.byId("table_category").
                        this.byId('dialog_category_close').firePress({});
                    });
                }
            }
        }
        // dialog_create_close: function(oEvent){
        //     oEvent
        // }
    });
})