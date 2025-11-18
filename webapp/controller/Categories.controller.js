sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/General",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/utils/Breadcrumb",
    
],(Controller,
    Formatter,
    General,
    JSONModel,
    setModel,
    Breadcrumb
)=>{
    "use strict"
    // function createBreadcrumb(){
    //     const  list =this.rc.getBreadcrumbAr();
    //     const breadcrumb_data =[];
    //     let index =-1;
    //     let object =list.at(index);
    //     let object_level =object["level"];
    //     let object_name =object["name"];
    //     breadcrumb_data.push(object_name);
    //     while (object_level>0) {
    //         index--;
    //         object =list.at(index);
    //         object_level =object["level"];
    //         object_name =object["name"];
    //         breadcrumb_data.push(object_name);
    //     }
    //     return breadcrumb_data.reverse();   
    // }
    // dynamically insert the link
    // function createDynamicBreadcrumb(){
    //     const link_data =createBreadcrumb.call(this);
    //     let breadcrumb =this.byId("c_breadcrumb");
    //     let link_object;
    //     for (const link of link_data) {
    //         link_object =new sap.m.Link({
    //             text:link
    //         });
    //         breadcrumb.addLink(link_object);
    //     }
    //     breadcrumb.setCurrentLocation(link_object);

    // }
    return Controller.extend("bd.businessportal.controller.Categories", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("category_page");
            this.table =this.byId("table_category");
            this.component =this.getOwnerComponent();
            const expandFlag =this.component.expandFlag;
            this.oNavContainer = this.component.byId("App--navContainer");
            this.root_element =this.component.byId("App");
            // this.rc =this.root_element.getController();
            // this.root_element =sap.ui.getCore().byId("container-bd.businessportal---App");
            // this.component = sap.ui.core.Component.getOwnerComponentFor(this.root_element);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Categories.json");
                    
                }.bind(this)
            })
             // fetch data from 0-data/v2
        },
        onAfterRendering(){
            console.log("category page after rendering");
             let oModel = this.component.getModel("MD");
            //  const oBinding = oModel.bindList("/Categories");
        // console.log(oBinding.requestContexts(0, 10));
            // oBinding.requestContexts(0, 10).then((data)=>{
            //     console.log(data.map(oContext => oContext.getObject()))});
        },
        // onBeforeRendering:function(){
        //     // createDynamicBreadcrumb.call(this);
        //     const list =this.rc.getBreadcrumbAr();
        //     Breadcrumb.createDynamicBreadcrumb(this,"c_breadcrumb",list);
        // },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            // console.log(oEvent.getParameter("listItem"));
            var oContext = oEvent.getParameter("listItem").getBindingContext().getPath();
            // console.log(oContext);
            if(!oContext) {
                this.oNavContainer.setBusy();   
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
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("CategoriesOverview");
          },
    });
})