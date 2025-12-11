sap.ui.define([
    'sap/ui/base/Object',
    'sap/ui/core/message/Message'
],
    function(baseObject,Message){
        'use strict'
        // const Message_ =Message(msgConfig);
        // deffered
        
        const custValidation =baseObject.extend("bd.businessportal.utils_v2.formValidation",{
            /**
             * 
             * @param {number} statusFlagValEq - status value against which  valueStatus of each input is compared in condition.
             * @param {Array} inptCntrList - list of input controls
             * @param {number} totalInpt - total input controls in form which have to validate
             */
            constructor:function(statusFlagValEq,inptCntrList,totalInpt){
                baseObject.apply(this,arguments);
                this.statusFlagValEq =statusFlagValEq;
                this.inptCntrList =inptCntrList;
                this.totalInpt =totalInpt;               
            },

            _parseInputCntr: function(cntrClassList){
                let inputCntrs =this.inptCntrList.filter((cntr)=>cntrClassList.includes(cntr.getMetadata()["_sClassName"]));
                return inputCntrs;
            },

            checkValueStatus:function(parsedInputList){
                try { 
                    // get lenParsedInputList from calling this._parseInputCntr() method.
                    const lenParsedInputList =parsedInputList.length;
                    if(lenParsedInputList !==this.totalInpt){
                        throw new Error("specify length is not match with list of input controls");    
                    }
                    const statusFlagValEq =this.statusFlagValEq;
                    parsedInputList.forEach((cntr,idx)=>{
                        if(cntr.getValueState()!==statusFlagValEq){
                            throw new Error(`valueState of input at index ${idx+1} is invalid.`);  
                        }
                    });
                    return true;
                } catch (error) {
                    throw new Error(error);
                    
                }
            },
                        /**
             * 
             * @param {string} statusFlagValEq - status value against which  valueStatus of each input is compared in condition.
             * @param {Array} inptCntrList - list of input controls
             * @param {number} totalInpt - total input controls in form which have to validate
             * @param {Array} cntrClassList - list of input control class (eg: sap.m.Input)
             */
             static_method: function(statusFlagValEq,inptCntrList,totalInpt,cntrClassList){
                try { 
                    const obj =new custValidation(statusFlagValEq,inptCntrList,totalInpt);
                    const parsedList =obj._parseInputCntr(cntrClassList);
                    if(obj.checkValueStatus(parsedList)===true){
                        return true;
                    }
                } catch (error) {
                    throw new Error(error.message,{ cause: error });
                    
                }    
            }
        });
        return custValidation;
        // new exception class ---

    }
)