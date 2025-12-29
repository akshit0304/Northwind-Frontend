sap.ui.define(['sap/ui/base/Object','sap/m/MessageToast'],
    function(baseObject,MessageToast){
        return baseObject.extend('bd.businessportal.utils_v2.edit_module', {
            constructor: function (url,requestMethod) {
                baseObject.apply(this, arguments);
                this.url =url;
                this.requestMethod =requestMethod;
            },
            _testMethod : function(methodName){
                if(['PUT','PATCH'].indexOf(methodName)==-1){
                    return false;
                }
                return true;
            },
            _makeedit_request:function(endPoint,payload,state_change_func,callerRef){
            try {
            if(!(/^\/[a-zA-Z0-9_-]+/.test(endPoint)) && this._testMethod(this.requestMethod)){
                throw new Error("Invalid endpoint, endpoint starts with / or you have entered method besides of PUT or PATCH");
                
            }
            const req =new XMLHttpRequest();
            req.open(this.requestMethod,this.url+endPoint);
            // req.setRequestHeader('Conter')
            req.setRequestHeader('Content-Type','application/json;charset=UTF-8;IEEE754Compatible=true');
            req.setRequestHeader('Accept','application/json;odata.metadata=minimal;IEEE754Compatible=true');
            req.send(JSON.stringify(payload));
            req.ontimeout =(oEvent)=>{
                state_change_func.call(callerRef,500);
                // MessageToast.show("PUT Request Timeout");
                // fragmentRef?.fireClose();
            };
            req.onreadystatechange = (oEvent) => {
                // In local files, status is 0 upon success in Mozilla Firefox
                if (req.readyState === XMLHttpRequest.DONE) {
                    const status = req.status;
                    if (status === 200) {
                        state_change_func.call(callerRef,200);
                    // MessageToast.show("successfully updated ");
                    // this.odataModel.refresh();
                    // this.edit_category_frag_2.fireClose();
                    } else {
                        state_change_func.call(callerRef,400);
                        // MessageToast.show("failed updation ");
                    }
                }    
            }; 
            } catch (error) {
                throw new Error(error);   
            } 
            },
            urlList:function(endpoint){
                const url_obj ={
                    'categories':'https://port8080-workspaces-ws-ycocl.us10.trial.applicationstudio.cloud.sap/odata/v4/masterdata'
                };
                let url =url_obj[endpoint]??'pass the endpoint###$$$$';
                this.url =url;
                return url
            }       
        });
})