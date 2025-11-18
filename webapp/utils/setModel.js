sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
],
    (Filter,
        JSONModel
    ) => {
        "use strict"
        return {
            configureModel: function (fileName) {
                const component = this.component;
                const table = this.table;
                const fileSplit = fileName.split(".");
                if (fileSplit[0] == component.loaded_model) return 1;
                if (fileSplit.pop() == "json" && Array.isArray(fileSplit)) {
                    table?.setBusy(true);
                    const model = component.getModel();
                    // model.loadData("../Odata/"+fileName).then((info)=>{
                    model.loadData(sap.ui.require.toUrl("bd/businessportal/Odata/" + fileName)).then((info) => {

                        component.setModel(model);
                        component.loaded_model = fileSplit.pop();
                        table?.setBusy();
                        return 1;
                    });

                }
                else {
                    throw new Error("file format is not json type");

                }
            },
            configureModel2: function (fileName) {
                const component = this.component;
                const table = this.table;
                let busyControl = table ? table : this.oNavContainer;
                return new Promise((resolve) => {
                    const fileSplit = fileName.split(".");
                    if (fileSplit[0] == component.loaded_model) { resolve(1); }
                    if (fileSplit.pop() == "json" && Array.isArray(fileSplit)) {
                        busyControl?.setBusy(true);
                        const model = component.getModel();
                        // model.loadData("../Odata/"+fileName).then((info)=>{
                        model.loadData(sap.ui.require.toUrl("bd/businessportal/Odata/" + fileName)).then((info) => {

                            component.setModel(model);
                            component.loaded_model = fileSplit.pop();
                            busyControl?.setBusy();
                            resolve(1);
                        });
                    }
                    else {
                        throw new Error("file format is not json type");

                    }
                    // resolve(0);
                })
            },
            /**
             * always use _load_table with call because the method uses internal object variables.
             * @param {string} fileName - json file
             * @param {string} tableID - id associated with table
             * @param {object} param2 - contains information about the model name linked to view and filter key and value {modelName,labelID,labelParameter,bindElementID}
             * @returns 
             */
            loadTable: function (fileName, tableID, { modelName, labelID, labelParameter, bindElementID }) {
                try {
                    const table = this.byId(tableID);
                    let id = this.byId(bindElementID)?.getBindingContext().getProperty(labelID);
                    labelParameter = labelParameter ? labelParameter : id;

                    if (this.getView().getModel(modelName)) {
                        // let aFilters = [];
                        // table.setVisible(false);
                        let oFilter = new sap.ui.model.Filter(labelID, sap.ui.model.FilterOperator.EQ, labelParameter);
                        this.aFilters.push(oFilter);
                        table.getBinding("items").filter(this.aFilters);
                        this.aFilters.pop();
                        // table?.setBusy();
                        // table.setVisible();
                        return 1;
                    }
                    // this.product_table.setBusy(true);
                    table?.setBusy(true);
                    let Model = new JSONModel();
                    // Model.loadData("../Odata/"+fileName).then(() => {
                    Model.loadData(sap.ui.require.toUrl("bd/businessportal/Odata/" + fileName)).then((info) => {
                        this.getView().setModel(Model, modelName);
                        let oBinding = table.getBinding("items");
                        // let bind_path = this.model?.getProperty("/idOfBindElement");

                        // let id =this.byId("info_category").getModel().getProperty(bind_path+`/${labelID}`);
                        // labelParameter =labelParameter?labelParameter:id;


                        if (!this.aFilters) {
                            this.aFilters = [];
                        }
                        let oFilter = new sap.ui.model.Filter(labelID, sap.ui.model.FilterOperator.EQ, labelParameter);
                        this.aFilters.push(oFilter);

                        // Apply filter to binding
                        oBinding.filter(this.aFilters);
                        this.aFilters.pop();
                        table.setBusy();

                    });
                    return 1;
                } catch (error) {
                    this.byId(tableID).setBusy();
                    throw new Error(error);

                }
            },
            idToIndex: function (component, key, value) {
                // busycontainer?.setBusy(true);
                let model_data = component.getModel().getJSON();
                model_data = JSON.parse(model_data);
                let main_results = model_data['results'];

                let index = main_results.findIndex((val) => val[key] == value);
                // busycontainer?.setBusy();
                return index;

            },
            /**
             * 
             * @param {*} fileName 
             * @param {object} IdInfo -type of object contains keyname and keyvalue {key:productsID,value:2}
             * @param {*} that 
             */
            fetchObject: function (fileName, IdInfo, that, flag = 1) {
                const fileSplit = fileName.split(".");
                let { key, value } = IdInfo;
                let component = that.component;
                const model = component.getModel();

                if (flag && component.loaded_model != fileSplit[0]) {
                    // need to load the model
                    this.configureModel.call(that, fileName);
                }
                // get the object
                const aProducts = model.getProperty("/results");

                const aFiltered = aProducts.forEach((item, index) => {
                    return item[key] == value ? index : 0;
                });

                return aFiltered;
            },
            makeFilterObj({key, expression},query) {
                let filterEnum =sap.ui.model.FilterOperator;
                let Filter =sap.ui.model.Filter;
                return new Filter(key,expression, query);
            },
            searchEngine: function(query, arr) {
            // 1. Validate input
            if (typeof query !== "string" || query.length === 0 ||!Array.isArray(arr) || arr.length === 0) {
                return []; }
            // 2. Single filter
            const filters = [];
            if (arr.length === 1) {
                filters.push(this.makeFilterObj(arr[0],query));
                return filters;
            }
            // 4. Multiple filters → array of filters
            
            for (let i = 0; i < arr.length; i++) {
                filters.push(this.makeFilterObj(arr[i],query));
            }

            return [new sap.ui.model.Filter({
            "filters": filters,
            and: false
            })];
        },
        searchParse:function(oEvent,arr){
            // arr is array of object
            // object format
            // {key, expression}
            let query =oEvent.getParameter("query")?.trim();
            let result=[]
            if(oEvent.getParameter("searchButtonPressed")==true || !oEvent.getParameter("searchButtonPressed")){
                result =this.searchEngine(query,arr);
            }
            return result;
        }
    }
    });