sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/ChartConfig",
    "sap/ui/Device",
    'sap/ui/core/BusyIndicator'
], (Controller,
    JSONModel,
    Formatter,
    ChartConfig,
    Device,
    BusyIndicator
) => {
    "use strict"

    function _setGridItemSize(id) {
        let oGrid = this.byId(id);
        let aItems = oGrid?.getItems();

        // find tallest height
        let maxHeight = 0;
        aItems.forEach(item => {
            let domRef = item.getDomRef();
            if (domRef) {
                maxHeight = Math.max(maxHeight, domRef.offsetHeight);
            }
        });

        // set all items to max height
        aItems.forEach(item => {
            let domRef = item.getDomRef();
            if (domRef) {
                domRef.style.height = maxHeight + "px";
            }
        });
    }
    function _numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // const oData = {
    //     customers: [
    //         { customerName: "Customer A", orderAmount: 1200 },
    //         { customerName: "Customer B", orderAmount: 950 },
    //         { customerName: "Customer C", orderAmount: 875 },
    //         { customerName: "Customer D", orderAmount: 600 },
    //         { customerName: "Customer E", orderAmount: 450 }
    //     ]
    // };
    return Controller.extend("bd.businessportal.controller.Dashboard", {
        formatter: Formatter,
        onInit: function () {
            console.log('Dashboard page is loaded');
            // this.main_page =this.byId("");
            // console.log(this.component);
            this.component = this.getOwnerComponent();
            const expandFlag = this.component.expandFlag;
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.root_element.byId("navContainer");
            this.main_page = this.byId("dashboard_page");

            // temp function ---
            // const oModel = new sap.ui.model.json.JSONModel(oData);
            // this.getView().setModel(oModel);
            // set media ---
            Device.media.attachHandler((oEvent) => {
                if (oEvent.name == 'Phone' || oEvent.name == 'Tablet') {
                    // console.log(table_ref.getWidth());
                }
            }, this);

            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow: function () {
                    // before show
                    this.component._buttonExpandLogic(1, expandFlag);

                }.bind(this)
            });
            // donut properties
            var oVizDonutFrame = this.getView().byId("donutChart");
            oVizDonutFrame.setVizProperties(ChartConfig.vizDonutchartConfig());

            // "valueAxis": sap.viz.ui5.format.ChartFormatter.DefaultPattern.SHORTFLOAT,
            // "tooltip": sap.viz.ui5.format.ChartFormatter.DefaultPattern.STANDARDFLOAT
            // Attach Popover
            var oPopover = new sap.viz.ui5.controls.Popover({});
            oPopover.setFormatString({
                "OrderAmount":"## €"
            });
            oPopover.connect(oVizDonutFrame.getVizUid());

            // column chart ---
            var oVizColumnFrame = this.getView().byId("shipper_column_chart");
            oVizColumnFrame.setVizProperties(ChartConfig.vizColumnchartConfig());
            oVizColumnFrame.setVizScales([{
                // color: {
                    feed:'color',
                    palette:['#003a7d','#ff0000','#993333']
                // }
            }])
             oPopover.connect(oVizColumnFrame.getVizUid());
        },
        onBeforeRendering:function(){
            this.getView().addStyleClass(this.component._sContentDensityClass);
        },
        onAfterRendering: function () {
            BusyIndicator.hide();
            // setTimeout(timeoutFunction.bind(this), 5000);
            // this.customersTotalSpend();
            function timeoutFunction() {
                // console.log("function called");
                this.countSpecificParameterValue("kpi_stat_list", { "that": this, "setNumber_id": null }, 1);
            };
            // set grid-item size
            // _setGridItemSize.bind(this,"main_grid");

        },
        onExit() {
            console.log("dashboard exit");
        },
        navButtonPressed:function(oEvent){
            this.root_element.getController().backButton(oEvent);
        },
        /**
         * 
         * @param {string} list_id - list id in which items placed (kpi data)
         * @param {object} params - addition data (set_number id is not implemented.)
         * @param {Number} index - index of item in list
         */
        countSpecificParameterValue: async function (list_id, params, index = 0) {
            try {

                var { that, setNumber_id } = params;
                const list_control = that.byId(list_id);
                const list_items = list_control.getItems();
                if (index < list_items.length) {
                    var list_item = list_items[index];
                    list_item.setBusy(true);
                    // if card xml change then change this also.(fetching number for statistics)
                    let list_item_control = setNumber_id ? setNumber_id : list_item.getContent()[0].getItems()[1].getItems()[0];

                    let data = await this.make_request(that, "/Order_Subtotals", "Subtotal");
                    data = _numberWithCommas(data);
                    list_item_control.setNumber(data);
                    // console.log(data);
                    list_item.setBusy();

                }
                else {
                    throw new Error("passed index has invalid index");
                }

            } catch (error) {
                that.byId(setNumber_id).setNumber("Error");
                list_item.setBusy();
            }
        },
        oDataReadCall: function (that, path, params = {}) {
            return new Promise((resolve, reject) => {
                that.component.getModel("MD").read(path, {
                    urlParameters: params,
                    success: function (oData) {
                        resolve(oData);
                    },
                    error: function (err) {
                        console.log(err);
                        reject(0);
                    }
                });
            });
        },
        make_request: async function (that, path, propKey, params = {}) {
            let request_pointer;

            // odata read function end
            // counter function start
            function count() {
                let temp_count = 0;
                for (const d of results) {
                    temp_count += parseInt(d[propKey]);
                }
                return temp_count;
            }
            // counter function ends
            // parse skip variable
            function parseSkipVariable(link, params) {
                const match = link.match(/[?&]\$skiptoken=([^&#]+)/i);
                if (match) {
                    params["$skiptoken"] = parseInt(match[1]);
                }
                return params;
            }
            // parse skip variable end
            var data, link;
            var counter = 0;
            let results;
            data = await this.oDataReadCall(that, path, params);
            if (!data) { return 0; }
            results = data['results'];
            link = data['__next'];
            if (results[0][propKey]) {
                counter = count();
            }
            else {
                return "propKey is not present in json response";
            }
            // while condition for repeat request
            let count_flag = 0;
            while (link && count_flag < 5 && !that.component.abord_request_flag) {
                params = parseSkipVariable(link, params);
                data = await this.oDataReadCall(that, path, params);
                if (!data) { return 0; }
                results = data['results'];
                link = data['__next'];
                counter += count();
                count_flag += 1;
            }
            that.component.abord_request_flag = 0;
            // console.log(counter);
            return counter;
        },
        customersTotalSpend: async function () {
            const json_customer = [];
            let subTotal_ar = await this.oDataReadCall(this, "/Order_Subtotals", { "$top": 500 });
            if (!subTotal_ar) return { "code": 458, "data": "can't fetch the orders_subtotal" }
            subTotal_ar = subTotal_ar["results"];
            // return 1;
            this.oDataReadCall(this, "/Customers", { "$expand": "Orders", "$top": "100" }).then((oData) => {
                const data = oData["results"];
                // console.log(data[0]["Orders"]["results"][0]);
                for (const ele of data) {
                    let temp = {};
                    const order_ar = [];
                    for (const order of ele["Orders"]["results"]) {
                        order_ar.push(order['OrderID']);
                    }

                    temp['detail'] = {
                        'CustomerName': ele["CompanyName"],
                        'CustomerID': ele["CustomerID"]
                    };
                    temp["orders"] = {
                        "TotalOrders": order_ar.length,
                        "IDs": order_ar,
                        "subTotal": null
                    }
                    // count subtotal
                    let accumulateSubOrder = function (accum, data) {
                        if (data["OrderID"] in order_ar) {
                            accum += data["Subtotal"];
                        }
                        return accum;
                    }
                    const temp_sub_order = subTotal_ar.reduce(accumulateSubOrder, 0);
                    temp["orders"]["subTotal"] = temp_sub_order;
                    // console.log(temp_sub_order);
                    // break;
                    json_customer.push(temp);
                }
                // for loop completed
                // let model =new JSONModel({"results":json_customer});
                // this.component.setModel(model,"topCustomers");
            })
        }
    });
})