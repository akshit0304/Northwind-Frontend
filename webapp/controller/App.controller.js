sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/mvc/XMLView",
  "bd/businessportal/model/Formatter",
  'sap/ui/core/Fragment',
  'bd/businessportal/controller/DialogBox',
  'sap/ui/core/BusyIndicator',
  'sap/ui/Device'

], (BaseController,
  XMLView,
  Formatter,
  Fragment,
  DialogBox,
  BusyIndicator,
  Device

) => {
  "use strict";
  // breadcrumb logic
  // const idToLink ={
  //     "Dashboard":0,
  //     "Categories":1,
  //     "CategoriesOverview":2,
  //     "Products":3,
  //     "ProductsOverview":4
  // };
  // const adjecency_list =[[0],[1,2],[2,4],[3,4],[4]];
  // const breadcrumbAr =[];
  // let last_view_code =null;
  return BaseController.extend("bd.businessportal.controller.App", {
    formatter: Formatter,
    // getIdToLink:function(link){
    //   return idToLink[link];
    // },
    // getAdjecencyListData:function(index){
    //   return adjecency_list[index];
    // },
    // setBreadcrumbAr:function(object){
    //   breadcrumbAr.push(object);
    // },
    // getBreadcrumbAr:function(index){
    //   if(index<0){
    //     return breadcrumbAr.at(index);
    //   }
    //   else if(!index){
    //     return breadcrumbAr;
    //   }
    //   return breadcrumbAr[index];
    // },
    onInit() {
      // BusyIndicator.show(0);
      // console.log("app controller is initialized");
      // initial setup
      this.main_page = this.byId("shell_page");
      this.oNavContainer = this.byId("navContainer");
      this.component = this.getOwnerComponent();
      this.router = this.component.getRouter();
      this.HISTORY =[];
      this.CURRENT_ITEM ="Dashboard"
      this.getView().addEventDelegate({
        onAfterShow: function () {
          this._setFocus("hamburgerMenu");
          // this._setNavigationList('list');
        }.bind(this),
        onBeforeShow:function(){
          // this.component._buttonExpandLogic(1, 1);
        }.bind(this)
      });
      // // device model change
      // if(Device.support.touch){
      //    this.component._buttonExpandLogic(1,0);
      // }
    },
    _loadView: function (sViewName) {
      if(this.oNavContainer.getCurrentPage().getViewName().split('.').at(-1)==sViewName){
        this.component.getModel().refresh();
        BusyIndicator.hide();
        return 0;
      }
      // abort request flag for aggregated order details
      if(sViewName!="Dashboard"){
        this.component.abort_request_flag =1;
      }
      else{
      this.component.abort_request_flag =0;}

      // this.oNavContainer.getCurrentPage()
      var history_tag_flag =sViewName.search(/Overview/);
      var history_tag;
      if(history_tag_flag!=-1) {history_tag =sViewName.replace("Overview","");}
      else { history_tag =sViewName; }
      if(history_tag=="Territories"){
        // do this because region and territories are in same section.
        history_tag ="Regions"
      }
      const last_tag =this.CURRENT_ITEM;
      this.CURRENT_ITEM =history_tag;
      this.HISTORY.push(last_tag);
      this._setNavigationList("sideNavigation",history_tag);
      // console.log(this.CURRENT_ITEM);
      // console.log(this.HISTORY);
      // navigation logic end
      if (!sViewName || typeof sViewName != 'string') return "error";
      let oExistingPage = this.oNavContainer.getPages()
        .find(p => p.getViewName && p.getViewName().endsWith(sViewName));

      if (oExistingPage) {
        BusyIndicator.hide();
        this.oNavContainer.to(oExistingPage);
        return;
      }
      this.component.runAsOwner(
        function () {
          XMLView.create({
            viewName: "bd.businessportal.view." + sViewName,
            id:this.getView().createId(sViewName.trim())
          }).then(oView => {
            this.oNavContainer.addPage(oView);
            this.oNavContainer.to(oView);
            BusyIndicator.hide();
          });
        }.bind(this)
      )

    },
    _setNavigationList: function (id,keyName=null) {
      const control = this.byId(id);
      if(!keyName) {
          // keyName ="Dashboard";
          control.setSelectedKey(keyName);
          return 1;
        }
      // console.log(control.getItems());
      // const list_items = control.getItems();
      // let select_item =list_items[0];
      // if(flag){
        
      //   // else{
      //   //   //   select_item =list_items.find(function (item) {
      //   //   //     return item.getKey() == keyName;
      //   //   // });
      //   // }
      // }
      control.setSelectedKey(keyName);
      return 1;
      
      // console.log(this.getLocalId(control.getSelectedKey(control)));
    },
    _setFocus: function (id) {
      if (!id) return 0
      const control = this.byId(id);
      if (control) {
        // console.log('control control fullfilled');
        control.focus();
      }
      return 1;
    },
    _getNavModelData:function(path){
      if (typeof path==="string" && path.indexOf('/')==0){
        const model =this.component.getModel("nav");
        return model.getProperty(path);
      }
      return null;
    },
    _setNavModelData:function(path,data){
      if (typeof path==="string" && path.indexOf('/')==0){
        const model =this.component.getModel("nav");
        return model.setProperty(path,data);
      }
      return null;
    },
    onItemSelect: function (oEvent) {
      const oItem = oEvent.getParameter("item");
      // const lastKey =this._getNavModelData("/current_item");
      // const lastKey =this.CURRENT_ITEM;
      const oItemKey = oItem.getKey();
      BusyIndicator.show(200);
      // setting breadcrumb ----
      // const breadcrumb_obj ={
      //   "name":oItem.getText(),
      //   "level":0,
      //   "bindingData":null,
      //   "id":oItemKey,
      //   "code":idToLink[oItemKey]
      // };
      // breadcrumbAr.push(breadcrumb_obj);
      // this.last_view_code =idToLink[oItemKey];
      this._loadView(oItemKey);

          // this._setNavModelData("/current_item",oItemKey);
     
    },
    hamburgerMenu: function (oEvent) {
      // console.log("menu button pressed");
      this.component._buttonExpandLogic();
    },
    backButton: function (oEvent) {
      if(this.HISTORY.length==1) {this.CURRENT_ITEM="Dashboard";}
      let back_item =this.HISTORY.pop();
      this._setNavigationList("sideNavigation",back_item);
      // console.log(this.HISTORY);
      // if(!back_item){this._setNavModelData("/last_item","Dashboard"); return 1;}
      // this._setNavModelData("/current_item",back_item);
      // this.CURRENT_ITEM =back_item;
      this.oNavContainer.back(); 
      // this._setNavModelData("/last_item",back_item);
      
    },
    dialogPress: function (oEvent) {
      BusyIndicator.show(100);
      // create popover
      if (!this.dialog) {
        this.dialog = Fragment.load({
          name: "bd.businessportal.view.DialogBox",
          controller: new DialogBox(this)
        }).then((Odialog) => {
          // add content using javascript
          let getItemKey =oEvent.getSource().getKey();
          if (getItemKey=="Legal"){
            // add content in dialog
            Odialog.addContent(
              new sap.m.VBox({
                items:[
                  new sap.m.TextArea({
                    value:"Company legal notes generally cover the formation, regulation, and dissolution of companies, with a focus on corporate governance, shareholder rights, and legal compliance. Key aspects include the Memorandum of Association (MOA) and Articles of Association (AOA), corporate personality, director duties, and financial structure. The Companies Act, 2013, is the primary legislation governing companies in India.",
                    editable:false,
                    growing:true,
                    width:"100%",
                    height:"250px"

                  })
                ]
              }).addStyleClass("sapUiResponsiveMargin")
            )
            sap.ui.getCore().byId("dialog_title").setText(getItemKey);
          }
          this.getView().addDependent(Odialog);
          return Odialog;
        });
      }
      this.dialog.then((point) => {
        BusyIndicator.hide();
        this.point=point;
        point.open();
      })
    },
    
  });
});