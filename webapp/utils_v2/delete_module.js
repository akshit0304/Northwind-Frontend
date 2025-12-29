sap.ui.define(['sap/ui/base/Object',"bd/businessportal/utils_v2/oDataRequestComp","sap/m/MessageToast"],
    function (baseObject,oDataRequestComp,MessageToast) {
        return baseObject.extend('bd.businessportal.utils_v2.delete_module', {
            constructor: function ({ trash_btn, footer_control, main_page, table_control }) {
                baseObject.apply(this, arguments);
                //    this._listItem =[];
                this.trash_btn = trash_btn;
                this.footer_control = footer_control;
                this.main_page = main_page,
                    this.table = table_control;
                //    this.controller_ref =controller_ref;

            },
            _checkObject: function (object_ref) {
                if (typeof object_ref != 'object') {
                    throw new Error("type is not object, please provide proper argument type");
                }
            },
            _resetControlState: function (trash_btn) {
                const cntr = this.trash_btn ?? trash_btn;
                this.table?.setMode('None');
                cntr.setType(sap.m.ButtonType.Default);
                cntr.setTooltip("In-active state");
                this.main_page.setShowFooter(false);
                this.footer_control.btn_delete.setEnabled(false);
                // this.table.detachSelectionChange({},this.controller_ref._listSelectionChange, this.controller_ref);
                delete this._listItem;
            },
            setTrashbtnState: function (controller_ref, trash_btn) {
                try {
                    this.controller_ref = controller_ref;
                    // this.trash_btn =trash_btn;
                    const listModeOptions = sap.m.ListMode;
                    const listMode = this.table?.getMode();
                    this.footer_control.btn_select?.setText('select all');

                    switch (listMode) {
                        case listModeOptions.MultiSelect:
                            this._resetControlState(trash_btn);
                            break;
                        case listModeOptions.None:
                            this.table?.setMode(listModeOptions.MultiSelect);
                            trash_btn.setType(sap.m.ButtonType.Emphasized);
                            trash_btn.setTooltip("Active state");
                            this.main_page.setShowFooter(true);
                            this.footer_control.btn_delete.setEnabled(false);
                            // this.table.attachSelectionChange({},this.controller_ref._listSelectionChange, this.controller_ref);
                            this._listItem = [];
                            // show message strip on the bottom of the screen.
                            break;
                        default:
                            this._resetControlState(trash_btn);
                            break;
                    }
                } catch (error) {
                    //⚠️ error message  
                }
                finally {
                    // 🏁 finalally block...
                    delete this.controller_ref;
                    // return 1;
                }
            },
            _listSelectionChange: function (oEvent) {
                try {
                    let cntr =oEvent.getParameter('listItem');
                    let idx;

                    if (oEvent.getParameter('selected')) {
                        this._listItem.push(cntr);
                        this.footer_control.btn_delete.setEnabled(true);
                    } else {
                        idx = this._listItem.findIndex((oItem) => oItem == cntr);
                        this._listItem.splice(idx, 1);
                         this.footer_control.btn_select?.setText('select all');
                        // enable/disable button
                        if (!this._listItem.length) {
                            this.footer_control.btn_delete.setEnabled(false);
                        }
                    }
                    if (oEvent.getParameter('selectAll')) {
                        this._listItem = ['all'];
                        this.footer_control.btn_select?.setText("de-select all");
                    }
                    // end logic ---
                } catch (error) {
                    //⚠️ error message
                }
            },
            _cancel :function(){

                this._resetControlState();
                this.footer_control.btn_select?.setText(null);
                // enable delete button logic
            },
            _delete :function(reference,groupIdName){
                try {
                let request_promise_list =oDataRequestComp.prototype.applyDelete(reference,this._listItem,groupIdName);
                // debugger;
                if(request_promise_list===430){
                    MessageToast.show("NO ITEM TO DELETE");
                    return 1;
                }
                // 249 mean you can call the submit-batch method
                return 249
                } catch (error) {
                    // console.log(error);
                    return 0;
                }
                finally{
                    debugger;
                    this._resetControlState();

                }
            },
            _selectAll :function(buttonKind){
                if(buttonKind=='selectall'){
                    this.table.selectAll(true);
                    this._listItem =['all'];
                }
                else{
                    this.table.removeSelections(true,true);
                    this._listItem=[];
                }
                return 1;
            }
            // 🔗  
        });
    }
)