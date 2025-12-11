sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/utils/Breadcrumb",
    "sap/ui/Device",
    // "sap/ui/core/BusyIndicator",
    "sap/ui/model/Filter",
    "bd/businessportal/utils/GenericFilter",

], (Controller,
    JSONModel,
    Formatter,
    setModel,
    Breadcrumb,
    Device,
    // BusyIndicator,
    Filter,
    GenericFilter
) => {
    "use strict"
    function _filterModule(that, obj) {
        let filter_bar = that.byId(obj['filterBarId']);
        // console.log(filter_bar.isDialogOpen());
    }

    function setLocalModel(that, { modelName, fileName }) {
        return new Promise((resolve) => {
            const own_models = that.getView().getOwnModels();
            const model_keys = Object.keys(own_models);
            let view = that.getView();
            if (modelName in model_keys) {
                view.getModel(modelName).refresh();
                resolve(208)
            }
            else {
                let model = new JSONModel();
                model.loadData(sap.ui.require.toUrl("bd/businessportal/Odata/" + fileName)).then((info) => {
                    view.setModel(model, modelName);
                    resolve(207);
                })
            }
        });
    }

    return Controller.extend("bd.businessportal.controller.Products", {
        formatter: Formatter,
        onInit() {
            // console.log("product initialized");
            this.component = this.getOwnerComponent();
            const expandFlag = this.component.expandFlag;
            this.main_page = this.byId("product_page");
            this.root_element = this.component.byId("App");
            this.table = this.byId("table_product");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.oFilter = [];
            Device.media.attachHandler((oEvent) => {
                if (oEvent.name == 'Phone' || oEvent.name == 'Tablet') {
                }
            }, this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            this.getView().addEventDelegate({
                onBeforeShow: function (obj) {
                    // BusyIndicator.hide();
                    this.component._buttonExpandLogic(1, expandFlag);
                    // setModel.configureModel.call(this, "Products.json");
                    // // console.log(obj.data);
                    // this.oNavContainer.setBusy();
                }.bind(this)
            })

            // setLocalModel(this, {
            //     fileName: "Suppliers.json",
            //     modelName: "supl"
            // }).then((flag) => {
            //     if (flag == 207) console.log('already not exists');
            //     else console.log("exists fast load");
            // })
             // odataV4 instace parameter set
             this.component.modelodataV4_instace._changeContextandId(this,"product_page");
            //  model for drodown lists
            // create new model.
            const MD_filter_model =new sap.ui.model.odata.v4.ODataModel({
                    annotationURI:[],
                    autoExpandSelect:true,
                    earlyRequests:false,
                    groupId:'$auto',
                    sharedRequests:true,
                    operationMode:sap.ui.model.odata.OperationMode.Server,
                    serviceUrl:'/odata/v4/masterdata/',
                    groupProperties: {
                        'MD_filter':{"submit":sap.ui.model.odata.v4.SubmitMode.API}
                    }
            });
            this.getView().setModel(MD_filter_model,"MD_filter");

        },
        onAfterRendering(){
            console.log("on after rendering");
            const filter_model =this.getView().getModel("MD_filter");
            filter_model.submitBatch("MD_filter");

        },
        // navButtonPressed:function(oEvent){
        //     this.root_element.getController().backButton(oEvent);
        // },
        // onBeforeRendering:function(){
        //     console.log("Product rendered");
        //     const list =this.root_element.getController().getBreadcrumbAr();
        //     Breadcrumb.createDynamicBreadcrumb(this,"p_breadcrumb",list);
        // },
        overViewPage: function (oEvent) {
            // console.log("nav pressed");
            var object_id = oEvent.getSource().getBindingContext("MD").getProperty("ID")
            if(!object_id) {  
                throw new Error("Error id is undefined");
            }
            const router =this.component.getRouter();
            router.navTo("productOverview",{PID:object_id});
        },
        filterSearch: function (oEvent) {
            const configuration = {
                configurationProperty: [
                    {
                        controlType: "ComboBox",
                        key: "ProductID",
                        expression: "EQ"
                    },
                    {
                        controlType: "ComboBox",
                        key: "SupplierID",
                        expression: "EQ",
                    },
                     {
                        controlType: "ComboBox",
                        key: "Discontinued",
                        expression: "EQ",
                        boolean:true
                    },
                     {
                        controlType: "Input",
                        key: "UnitPrice",
                        expression: null,
                        boolean:false
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
        //   filterClear:function(oEvent){
        //     console.log("clear event triggered");
        //     this.oFilter=[];
        //     let selection_set =oEvent.getParameters("selectionSet");
        //     selection_set.selectionSet.forEach((control) => {
        //         switch (getControName(control)) {
        //             case "ComboBox":
        //                 control.setSelectedKey();
        //                 break;

        //             default:

        //                 break;
        //         }
        //     });
        //     let oBinding = this.table.getBinding("items");
        //     oBinding.filter([]);

        //   },
        //   selectionChange:function(oEvent){
        //     let oBinding = this.table.getBinding("items");
        //     oBinding.filter([]);
        //     // console.log(oEvent.getParameter("selectedItem"));
        //     let key =oEvent.getSource().getSelectedItem()?.getKey();
        //     console.log(oEvent);
        //     // -------------------
        //     let aFilters = [];
        //     if(!key || key==""){oBinding.filter([]);return 1;}
        //     let oFilter = new Filter("SupplierID", sap.ui.model.FilterOperator.EQ, key);
        //     aFilters.push(oFilter);
        //     oBinding.filter(aFilters);
        //     return 1;

        //   },
        selectionChange:function(oEvent){
            debugger;
        },
        filterClear: function (oEvent) {
            // console.log("clear pressed");
            if (!this.genericFilter) {
                this.genericFilter = new GenericFilter(this, this.table);
            }
            const gf = this.genericFilter;
            if (!gf.GET_selectionSet()) {
                const selection_set = oEvent.getParameters("selectionSet").selectionSet;
                gf.SET_selectionSet(selection_set);
            }
            gf.resetFilter();
            // gf.r_ComboBox(this.byId("number_input"));
            // gf.r_ComboBox(this.byId("number_input2"));
            // gf.r_ComboBox(this.byId("select_input"));

            // gf.clean(); //clean already applied in resetFilter function.

        },
        valueHelpRequest:function(oEvent){
            if (!this.PriceDialog) {
                    this.PriceDialog = new sap.m.Dialog(this.getView().getId()+"--dialog",{
                        icon: "sap-icon://filter",
                        state: sap.ui.core.ValueState.Information,
                        title: "",
                        content: [
                            new sap.m.HBox({
                                gap: '1rem',
                                items: [
                                            new sap.m.Select(this.getView().getId()+"--select_input",{
                                                selectedKey:"EQ",
                                                change:function(oEvent){
                                                    let selected_control =oEvent.getParameter("selectedItem");
                                                    let key =selected_control.getKey();
                                                    if(key==="BT" || key==="NB"){
                                                        this.byId("number_input2").setVisible(true);
                                                    }
                                                    else{
                                                        this.byId("number_input2").setVisible(false);
                                                    }
                                                    return 1;
                                                }.bind(this),
                                                items:[
                                                    new sap.ui.core.ListItem({
                                                        key:"EQ",
                                                        text:"=",
                                                    }),
                                                    new sap.ui.core.ListItem({
                                                        key:"GT",
                                                        text:">",
                                                    }),
                                                    new sap.ui.core.ListItem({
                                                        key:"LT",
                                                        text:"<",
                                                    }),
                                                    new sap.ui.core.ListItem({
                                                        key:"GE",
                                                        text:">=",
                                                    }),
                                                    new sap.ui.core.ListItem({
                                                        key:"LE",
                                                        text:"<=",
                                                    }),
                                                    new sap.ui.core.ListItem({
                                                        key:"BT",
                                                        text:"BETWEEN",
                                                    }),
                                                    new sap.ui.core.ListItem({
                                                        key:"NB",
                                                        text:"NOT BETWEEN",
                                                    })
                                                ],

                                            }),
                                            new sap.m.Input(this.getView().getId()+"--number_input",{
                                                showValueHelp:false,
                                                showSuggestion:false,
                                                showClearIcon:true,
                                                type:sap.m.InputType.Number,
                                                placeholder:"price",
                                                name:"price_value1",
                                                value:""

                                            }),
                                            new sap.m.Input(this.getView().getId()+"--number_input2",{
                                                showValueHelp:false,
                                                showSuggestion:false,
                                                showClearIcon:true,
                                                type:sap.m.InputType.Number,
                                                placeholder:"price2",
                                                name:"price_value2",
                                                value:"",
                                                visible:false

                                            })
                                        ]
                                    })
                                ],
                            // })

                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.PriceDialog.close();
                                // this.byId("number_input2").setVisible(false);
                                // okay button logic
                                let select_input =this.byId("select_input");
                                let number_input =this.byId("number_input");
                                let number_input2 =this.byId("number_input2");
                                let select_input_value =select_input.getSelectedKey();
                                let number_input_value =number_input.getValue()?number_input.getValue():"";
                                let number_input_value2 =number_input2.getValue()?number_input2.getValue():"";
                                this.byId("f_product_price").setValue(`${select_input_value} ${number_input_value} ${number_input_value2}`);
                                number_input.setValue();
                                number_input2.setValue();
                                select_input.setSelectedKey();
                                number_input2.setVisible(false);
                                }.bind(this)
                            }),

                        endButton: new sap.m.Button({
                            text: "Close",
                            press: function () {
                                this.PriceDialog.close();
                                this.byId("select_input").setSelectedKey();
                                this.byId("number_input").setValue();
                                let temp =this.byId("number_input2").setValue();
                                temp.setVisible(false);
                                // this.byId("number_input2").setVisible(false);
                            }.bind(this)
                        })

                    })
                    this.PriceDialog.addStyleClass("sapUiContentPadding sapUiResponsiveMargin");
                    this.getView().addDependent(this.PriceDialog);
        }
        // dialog code end
        this.PriceDialog.open();

    }
    });
})


/* {
    [
{
    controlType:"ComboBox",
    key:"SupplierID" ,
    expression:"EQ",
    value:2
}
    ]
    }
*/

// let fObj =gf.makeFilterObj("ProductID","EQ",2);
// gf.addFilter(fObj);
// gf.applyFilter();