sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/utils_v2/oDataRequestComp",
    "bd/businessportal/utils_v2/formValidation",

], (Controller,
    Formatter,
    MessageToast,
    JSONModel,
    oDataRequestComp,
    formValidation
) => {
    "use strict"

    // ==================
    return Controller.extend("bd.businessportal.controller.Categories", {
        formatter: Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.component = this.getOwnerComponent();
            this.main_page = this.byId("category_page");
            this.table = this.byId("table_category");
            const expandFlag = this.component.expandFlag;
            // this.oNavContainer = this.component.byId("App--navContainer");
            // this.root_element = this.component.byId("App");
            // this.oNavContainer = this.root_element.byId('navContainer');
            this.odataModel =this.component.getModel("MD");
            this.local_form_jsonModel =new JSONModel();
            this.payloadData_keys =['CategoryName','Description'];
            // will set default data in json model with property key which is taken from payloadData_keys.
            oDataRequestComp.prototype.resetJsonModel(this.local_form_jsonModel,this.payloadData_keys);
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
            // console.log("category page after rendering");
            // json model for form data
            // this.local_data =new JSONModel({"categoryName":null,"categoryDescription":null},true);
            this.getView().setModel(this.local_form_jsonModel,"form_local");
            // this.table.attachUpdateFinished({},()=>{
            //     // console.log("refresh event");
            //     if(this.createdCntrContext){
            //         console.log("yes");
            //         this._setFocus('table_category',this.createdCntrContext);
            //         this.createdCntrContext=null;
            //     }
                // this._setFocus(this.table,this.createdCntrContext);
            // })
            // json model end
            if (!this.add_category_frag) {
                this.add_category_frag = this.loadFragment({
                    name: "bd.businessportal.view.Dialog_category"
                });

                this.add_category_frag.then((oDialog)=>{
                    this.byId("dialog_category_close").attachPress({},(oEvent)=>{
                        oDialog.close();
                         oDataRequestComp.prototype.resetJsonModel(this.local_form_jsonModel,this.payloadData_keys);

                    })
                })
            }
        },
        // onBeforeRendering:function(){
        //     // createDynamicBreadcrumb.call(this);
        //     const list =this.rc.getBreadcrumbAr();
        //     Breadcrumb.createDynamicBreadcrumb(this,"c_breadcrumb",list);
        // },
        // navButtonPressed: function (oEvent) {
        //     this.root_element.getController().backButton(oEvent);
        // },
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
            this.endPoint="/Categories";
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
            // console.log("submit button pressed");
            try {
            const form_cntr_content =this.byId("category_form").getContent();
            const form_cntr_content_validation =formValidation.prototype.static_method("None",form_cntr_content,2,['sap.m.Input']);
            // let validation_obj ={
            //     total_needed_flag :2,
            //     validataion_flag:0
            // };
            // form_cntr_content.forEach((cntr)=>{
            //     if(cntr.getMetadata()["_sClassName"]=="sap.m.Input" && cntr.getValueState()=="None"){
            //            validation_obj['validataion_flag']++;
            //     }
            // });
            if(form_cntr_content_validation===true){
                console.log("all i/p validated");
                const payloadData =oDataRequestComp.prototype.makePayloadFromJsonModel(this.local_form_jsonModel,this.payloadData_keys);
                const oDataRequestComp_instance =oDataRequestComp.prototype.static_class(this,this.payloadData_keys,
                                                                                        {
                                                                                           modelReference: this.odataModel,
                                                                                           groupId:'categoryGroup'
                                                                                        },
                                                                                        payloadData,
                                                                                        {//also specify id or control which has items as binding(list binding)
                                                                                            endpoint:this.endPoint
                                                                                        }    
                                                                                    );
                oDataRequestComp_instance.submitPromise.then(()=>{
                    this.byId('dialog_category_close').firePress({});
                    // this.odataModel.refresh();
                    this.createdCntrContext =oDataRequestComp_instance.oContext;
                    setTimeout(this._setFocus.bind(this,'table_category',oDataRequestComp_instance.oContext),2000);
                    // this._setFocus('table_category',oDataRequestComp_instance.oContext);
                    // this.byId("table_category").getBinding("items").refresh();
                    // debugger;
                })
                // json object data
                // const form_local =this.getView().getModel("form_local");
                // let form_local_data =form_local.getJSON();
                // // make odata v4 create request ----
                // if(!this.component.getModel("MD").hasPendingChanges()){
                //     // debugger;
                //     //    const temp =this.component.getModel("MD").createBindingContext('/',"MD");
                //         const oList = this.component.getModel("MD").bindList("/Categories")
                //     // debugger;
                //     console.log(form_local_data);
                //     // debugger;
                //     oList.create({
                //         CategoryName: form_local.getProperty("/categoryName"),
                //         Description:form_local.getProperty("/categoryDescription")
                //     });
                //     this.component.getModel("MD").submitBatch("$auto").then((a)=>{
                //         console.log(a);
                //         form_local.setData({"categoryName":null,"categoryDescription":null});
                //         this.byId("table_category").getBinding("items").refresh();
                //         // this.byId("table_category").
                //         this.byId('dialog_category_close').firePress({});
                //     });
                // }
            }
            
             } catch (error) {
                console.log(error);
                MessageToast.show(error.cause.message);  
            }
            finally{
                oDataRequestComp.prototype.resetJsonModel(this.local_form_jsonModel,this.payloadData_keys);
            }
        },
        _setFocus:function(tableId,oContext,mName='MD'){
            this.odataModel.refresh();
            this.byId(tableId)?.getItems().some(function (oItem) {
                if (oItem.getBindingContext(mName).getPath() == oContext.getPath()) {
                    oItem.focus();
                    // oItem.setSelected(true);
                    return true;
                }
            });
        },
        _resetDeleteFunc:function(){
                    const cntr =this.byId("btn_del_category");
                    this.table?.setMode('None');
                    cntr.setType(sap.m.ButtonType.Default);
                    cntr.setTooltip("In-active state");
                    this.main_page.setShowFooter(false);
                    this.byId("deleteItems_category").setEnabled(false);
                    this.table.detachSelectionChange(this.listSelectionChange,this);
                    delete this._listItem;
        },
        del_category: function(oEvent){
            // open dialog when delete button pressed.
            const cntr =oEvent.getSource();
            const listModeOptions =sap.m.ListMode
            const listMode =this.table?.getMode();
            this.byId('selectall_category')?.setText('select all');
            switch (listMode) {
                case listModeOptions.MultiSelect:
                    this.table?.setMode(listModeOptions.None);
                    cntr.setType(sap.m.ButtonType.Default);
                    cntr.setTooltip("In-active state");
                    this.main_page.setShowFooter(false);
                    this.byId("deleteItems_category").setEnabled(false);
                    this.table.detachSelectionChange(this.listSelectionChange,this);
                    delete this._listItem;
                    break;
                case listModeOptions.None:
                    this.table?.setMode(listModeOptions.MultiSelect);
                    cntr.setType(sap.m.ButtonType.Emphasized);
                    cntr.setTooltip("Active state");
                    this.main_page.setShowFooter(true);
                    this.byId("deleteItems_category").setEnabled(false);
                    this.table.attachSelectionChange({},this.listSelectionChange,this);
                    this._listItem=[];
                    // show message strip on the bottom of the screen.
                    break;
                default:
                    this.table?.setMode(listModeOptions.None);
                    delete this._listItem;
                    break;
            }
        },
        listSelectionChange:function(oEvent){
            let cntr =oEvent.getParameter('listItem');
            let idx;
            if(oEvent.getParameter('selected')){
                this._listItem.push(cntr);
                this.byId("deleteItems_category").setEnabled(true);
            }else{
                idx =this._listItem.findIndex((oItem)=>oItem==cntr);
                this._listItem.splice(idx,1);
                this.byId('selectall_category')?.setText('select all');
                // enable/disable button
                if(!this._listItem.length){
                    this.byId("deleteItems_category").setEnabled(false);
                }
            }

            // debugger;
            // this._listItem =oEvent.getParameter('listItems');
            if(oEvent.getParameter('selectAll')){
                this._listItem =['all'];
                this.byId('selectall_category')?.setText("de-select all");
            }
        },
        _footerCombinedButtons:function(oEvent){
            // debugger;
            let _cancel =function(){

                    let cntr =this.byId('btn_del_category');
                    this.table?.setMode(sap.m.ListMode.None);
                    cntr.setType(sap.m.ButtonType.Default);
                    cntr.setTooltip("In-active state");
                    this.main_page.setShowFooter(false);
                    this.byId("deleteItems_category").setEnabled(false);
                    this.byId('selectall_category')?.setText(null);
                    delete this._listItem;
                // enable delete button logic
            };

            let _delete =function(){
                try {
                let groupIdName ='categoryGroup';
                let request_promise_list =oDataRequestComp.prototype.applyDelete(this,this._listItem,groupIdName);
                // debugger;
                if(request_promise_list===430){
                    MessageToast.show("NO ITEM TO DELETE");
                    return 1;
                }
                this.odataModel.submitBatch(groupIdName).then((data)=>{
                    this.odataModel.refresh();
                    MessageToast.show("DELETE OPERATION SUCCESSFULL");
                });
                // Promise.all(request_promise_list).then((values) => {
                //             console.log(values); // [3, 42, "foo"]
                //             }).catch((error) => {
                //             console.error(error); // If any promise rejects, this will run
                //             })

                } catch (error) {
                    console.log(error);
                    return 0;
                }
                finally{
                    // this._listItem =[];
                    this._resetDeleteFunc();

                }
            };

            let _selectAll =function(){
                if(buttonKind=='selectall'){
                    this.table.selectAll(true);
                    this._listItem =['all'];
                }
                else{
                    this.table.removeSelections(true,true);
                    this._listItem=[];
                }
                return 1;
            };

            let buttonKind =oEvent.getSource().getText();
            buttonKind =buttonKind.toLowerCase().replace(/[\t\s]+/,'');

            switch (buttonKind) {
                case 'cancel':
                    _cancel.call(this);
                    break;
                case 'delete':
                    _delete.call(this);
                    break;
                case 'selectall':
                    _selectAll.call(this);
                    break;
                case 'de-selectall':
                    _selectAll.call(this);
                    break;
                default:
                    _cancel.call(this);
                    break;
            }
        },
        edit_category: function(oEvent){
            if (!this.edit_category_frag) {
                // this.add_category_frag?.destroy();
                this.edit_category_frag = this.loadFragment({
                    name: "bd.businessportal.view.Dialog_category_edit"
                });
                this.edit_category_frag.then((oDialog)=>{
                    oDialog.attachCancel({},(oEvent)=>{
                        // debugger;
                        oDataRequestComp.prototype.resetJsonModel(this.local_form_jsonModel,this.payloadData_keys);
                    },this);
                    // oDialog.open();
                });
            }
            this.edit_category_frag.then((oDialog)=>{
                oDialog.open();
            })
        },
        edit_button_press: function(oEvent){
            const endpoint ='/Categories/';
            const oContextItem = this.local_form_jsonModel;
            const oContextData ={
                'ID':oContextItem.getProperty('/ID'),
                'CategoryName':oContextItem.getProperty('/CategoryName'),
                'Description':oContextItem.getProperty('/Description')
            };
            // this.odataModel.bindContext(endpoint + oContextData['ID']);
            // make put request ...
            try {
            const form_cntr_content =this.byId("dialog_edit_category2").getContent();
            const form_cntr_content_validation =formValidation.prototype.static_method("None",form_cntr_content,3,['sap.m.Input']);
            if(form_cntr_content_validation===true){
            const req =new XMLHttpRequest();
            req.open('PUT','https://port8080-workspaces-ws-ycocl.us10.trial.applicationstudio.cloud.sap/odata/v4/masterdata/'+'Categories');
            // req.setRequestHeader('Conter')
            req.setRequestHeader('Content-Type','application/json;charset=UTF-8;IEEE754Compatible=true');
            req.setRequestHeader('Accept','application/json;odata.metadata=minimal;IEEE754Compatible=true');
            req.send(JSON.stringify(oContextData));
            req.ontimeout =(oEvent)=>{
                MessageToast.show("PUT Request Timeout");
                this.edit_category_frag_2.fireClose();
            };
            req.onreadystatechange = (oEvent) => {
            // In local files, status is 0 upon success in Mozilla Firefox
            if (req.readyState === XMLHttpRequest.DONE) {
                const status = req.status;
                if (status === 200) {
                MessageToast.show("successfully updated ");
                this.odataModel.refresh();
                // this.edit_category_frag_2.fireClose();
                } else {
                    MessageToast.show("failed updation ");
                }
                this.edit_category_frag_2.close();
            }
            };   
        }               
        } catch (error) {
                MessageToast.show(error.message.replace(/.*:/,'').trim());
                return 0;
            }
            // reset local_form_jsonModel  json model.
            // oDataRequestComp.prototype.resetJsonModel(this.local_form_jsonModel,this.payloadData_keys);
        },
        edit_category_event: function(oEvent){
            const oContextItem =oEvent.getParameter('selectedItem').getBindingContext('MD');
            // const propertyList =['ID','CategoryName','Description'];
            const oContextData ={
                'ID':oContextItem.getProperty('ID'),
                'CategoryName':oContextItem.getProperty('CategoryName'),
                'Description':oContextItem.getProperty('Description')
            };
            this.local_form_jsonModel.setData(oContextData);
            if(!this.edit_category_frag_2){
                const parentId =this.getView().getId();
                this.edit_category_frag_2 =new sap.m.Dialog(parentId+'--dialog_edit_category',{
                    afterClose:function(oEvent){
                        oDataRequestComp.prototype.resetJsonModel(this.local_form_jsonModel,this.payloadData_keys);

                    }.bind(this),
                    contentWidth:'600px',
                    horizontalScrolling:false,
                    title:'Edit Category',
                    titleAlignment:sap.m.TitleAlignment.Start,
                    beginButton:new sap.m.Button(
                        {
                            type:sap.m.ButtonType.Critical,
                            text:'Cancel',
                            press:function(oEvent){
                                oDataRequestComp.prototype.resetJsonModel(this.local_form_jsonModel,this.payloadData_keys);
                                this.edit_category_frag_2.close();
                            }.bind(this)
                        }),
                    endButton:new sap.m.Button(
                        {
                            type:sap.m.ButtonType.Success,
                            text:'Edit',
                            press:this.edit_button_press.bind(this),
                        }),
                    content:[
                        new sap.ui.layout.form.SimpleForm(parentId+'--dialog_edit_category2',{
                            layout:sap.ui.layout.form.SimpleFormLayout.ColumnLayout,
                            columnsXL:1,
                            columnsL:1,
                            editable:true,
                            content:[
                                new sap.m.Label({
                                    displayOnly:true,
                                    text:'ID',
                                    labelFor:parentId+'--edit_form_id',
                                    vAlign:	sap.ui.core.VerticalAlign.Middle,
                                    showColon:true,
                                    wrapping:false
                                }),
                                new sap.m.Input(parentId+'--edit_form_id',{
                                    type:sap.m.InputType.Text,
                                    editable:false,
                                    value:'{form_local>/ID}',
                                    autocomplete:false

                                }),
                                // 2
                                new sap.m.Label({
                                    displayOnly:true,
                                    text:'Name',
                                    labelFor:parentId+'--edit_form_name',
                                    vAlign:	sap.ui.core.VerticalAlign.Middle,
                                    showColon:true,
                                    wrapping:false
                                }),
                                new sap.m.Input(parentId+'--edit_form_name',{
                                    type:sap.m.InputType.Text,
                                    editable:true,
                                    value:"{path:'form_local>/CategoryName',type:'bd.businessportal.utils.odataType',constraints:{onlyAlphabet:true}}",
                                    autocomplete:false
                                }),
                                // 3
                                new sap.m.Label({
                                    displayOnly:true,
                                    text:'Description',
                                    labelFor:parentId+'--edit_form_desc',
                                    vAlign:	sap.ui.core.VerticalAlign.Middle,
                                    showColon:true,
                                    wrapping:false
                                }),
                                new sap.m.Input(parentId+'--edit_form_desc',{
                                    type:sap.m.InputType.Text,
                                    value:"{path:'form_local>/Description',type:'bd.businessportal.utils.odataType',constraints:{alphanumericWithlength:200}}",
                                    autocomplete:false
                                }),
                            ]
                        }).addStyleClass('sapUiResponsivePadding--content')
                    ]
                });
                // debugger;
                this.getView().addDependent(this.edit_category_frag_2);
            }
            this.edit_category_frag_2.open();   

        }   
        
    });
})