sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/core/message/Message'
],
    function(baseObject,Message){
        'use strict'
        // const Message_ =Message(msgConfig);
        // deffered
        
        const makeRequest =baseObject.extend("bd.businessportal.utils_v2.oDataRequestComp",{
            /**
             * @param {Object} modelDetailObj - { 
             *                             - modelName:xyz 
             *                             - modelReference: context|null
             *                             - modelScope:"view"|"component"|null(if modelReference is not null!)
             *                             - groupId: name(type string)
             *                             -     }
             */
            constructor:function(that,payloadDataKeys,modelDetailObj){
                baseObject.apply(this,arguments);
                this.that  =that;
                this.payloadDataKeys =payloadDataKeys;
                // validateDate method set this.payloadData parameter.
                this.payloadData =null;
                this.modelDetailObj =modelDetailObj;
                this.groupId = modelDetailObj.groupId;
            },
            /**
             * - the function should not depend upon constructor parameters.
             */
            applyDelete:function(that,oItemList,groupIdName=null){
                try {
                    if(that.odataModel.hasPendingChanges()){
                        that.odataModel.resetChanges(groupIdName); }
                    if(Array.isArray(oItemList) && oItemList.length){
                        // const itemListLength =oItemList.length;
                        if(oItemList[0]=='all'){
                            oItemList =that.table.getItems();
                        }
                        const item_delete_promise_list =oItemList.map(oItem => oItem.getBindingContext('MD').delete(groupIdName));
                        return item_delete_promise_list;
                    }
                    return 430 //status code 430 for empty list items in oItemList parameter , which means there is no item selected to delete.(use to control the submit-batch method in callee function.)
                } catch (error) {
                    throw new Error("in oDataRequestComp; got error in delete method "); 
                }
            },

            _checkModelReferenceExist: function(){
                if(!this.modelDetailObj.modelReference){
                    return this._getModel();
                }
                return this.modelDetailObj.modelReference;
            },

            applySubmitBatch:function(modelReference){
                if(!modelReference){modelReference = this._checkModelReferenceExist()}
                return modelReference.submitBatch(this.groupId);
                
            },

            setObjectOnBindingElement:function(cntr,endPoint){
                if(!endPoint.startsWith("/")){throw new TypeError("invalid endpoint name");}
                const modelreference =this.modelDetailObj.modelReference;
                this.applyResetOnModel(modelreference);
                if(!cntr){
                    return modelreference.bindList(endPoint,null,[],[],{
                        '$$groupId': this.groupId
                    });
                }
                let ele =this._getControl(cntr);
                return ele.bindList(endPoint,null,[],[],{
                    '$$groupId': this.groupId
                });

            },

            applyCreateOnModel:function(modelBind){
                if(!modelBind){
                    throw new Error("pass modelBind parameter ! you can get it by calling setObjectOnBindingElement method in the class by passing endpoint");
                    
                }
                // check whether payloadData is dumb or not
                let flag=false
                let data =this.payloadData;
                for (const key in data) {
                    if(data[key]!=null || data[key]!=undefined || data[key]!=Number.POSITIVE_INFINITY){
                        flag=true;
                        break;
                    }
                }
                if(flag){
                    return modelBind.create(this.payloadData);
                    
                }
                    return false;
            },

            applyResetOnModel: function(modelReference){
                 if(!modelReference){modelReference = this._checkModelReferenceExist()}
                modelReference.resetChanges(this.groupId);
                return 1;
            },

            validateData: function(payloadData){
                try {
                    if(typeof payloadData=="object" && Array.isArray(this.payloadDataKeys)){
                        // keys of payload inseted by user
                        const payloadData_key = Object.keys(payloadData);
                        const key_check =this.payloadDataKeys.every((payloadKey)=>payloadData_key.includes(payloadKey));
                        if(key_check && payloadData_key.length===this.payloadDataKeys.length){
                            this.payloadData =payloadData;
                            return true;
                        }
                        return false;
                    }
                    throw new TypeError("in oDataRequestComp; payloadData type must be object");
                } catch (error) {
                    return error;
                }
                },

            _getControl:function(cntrData,baseClassName){
                try {
                    if(typeof cntrData=='string'){
                        return this._getControlById(cntrData);
                    }
                    if(typeof cntrData=='object'){
                        if(!(baseClassName && cntrData.isA(baseClassName))){
                            throw new ReferenceError("in oDataRequestComp;given baseClassName parameter is not a parent of given control.");    
                        }
                        return cntrData;
                    }
                    throw new Error("in oDataRequestComp;couln't get control with given parameter cntrData");
                } catch (error) {
                    console.error(error);
                    return 0;        
                }
            },

            _getControlById:function(idName){
                return this.that.byId(idName);
            },

            _getModel: function(){
                try {
                    const modelObj = this.modelDetailObj;
                    if(typeof modelObj.modelReference =='object'&& modelObj.modelReference){
                        return modelObj.modelReference;
                    }
                    else if(modelObj.modelName && modelObj.modelScope){
                        let model;
                        switch (modelObj.modelScope.toLocaleLowerCase()) {
                            case "view":
                                model =this.that.getView().getModel(modelObj.modelName);
                                modelObj.modelReference =model;
                                return model;
                            case "component":
                                model =this.that.getOwnerComponent().getModel(modelObj.modelName);
                                modelObj.modelReference =model;
                                return model;
                            default:
                                throw new Error("model scope is invalid");
                        }
                    }
                } catch (error) {
                    return error
                }
            },

            makePayloadFromJsonModel: function(jModel,payloadData_keys){
                if(typeof jModel=='object' && jModel.isA('sap.ui.model.json.JSONModel')){
                    const payloadData = {}
                    for (const pName of payloadData_keys) {
                        payloadData[pName] =jModel.getProperty("/"+pName);
                    }
                    return payloadData;
                }
                return "invalid model"
            },
            resetJsonModel:function(jModel,payloadData_keys){
                if(typeof jModel=='object' && jModel.isA('sap.ui.model.json.JSONModel')){
                    const obj={}
                    for (const pName of payloadData_keys) {
                        obj[pName]=null;
                    }
                    jModel.setData(obj);
                    return 1;
                }
                return "invalid model"

            },

            static_class: function(that,payloadDataKeys,modelDetailObj,payloadData,bindobj){
                try { 
                    const obj =new makeRequest(that,payloadDataKeys,modelDetailObj);
                    obj.validateData(payloadData);
                    // bind obj parameter is type of object which take 'endpoint' and 'cntr' that shows list.
                    const modelbind =obj.setObjectOnBindingElement(null,bindobj.endpoint);
                    const dataCreatedOrNot =obj.applyCreateOnModel(modelbind);
                    if(dataCreatedOrNot){
                        // here isRequestdone is promise
                        let isRequestdone =obj.applySubmitBatch();
                        if(!isRequestdone){
                            obj.applyResetOnModel();
                            obj.applyCreateOnModel(modelbind);
                            isRequestdone =obj.applySubmitBatch();
                            if(!isRequestdone){
                                return "looks like connection issue"
                            }
                        }
                        return {'submitPromise':isRequestdone,
                            'oContext':dataCreatedOrNot
                        };
                    }
                    throw new Error("issue in applyCreateOnModel method");
                } catch (error) {
                    throw new Error(error.message,{cause:e});
                    
                }    
            }
        });
        return makeRequest;
    }
)