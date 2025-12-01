sap.ui.define(['sap/m/MessageToast'],(MessageToast)=>{

    return {
        constructor(that,modelRef,loaderPageId){
           console.log("constructor loaded"); 
           this.that =that;
           this.modelRef =modelRef;
           this.loaderPageId = loaderPageId;
           this.attachEvent();

        },
        busyMechanism:function(flag=0){
            if(flag){
                this.that.byId(this.loaderPageId).setBusy(true);
                return;
            }
            this.that.byId(this.loaderPageId).setBusy();
        },
         _V4Changed:function(oEvent){
            this.busyMechanism(1);
        },
        _V4Received:function(oEvent){
            this.busyMechanism(0);
        },
        _checkRequestPending:function(){
            return this.modelRef.hasPendingChanges();

        },
        // static class
        attachEvent:function(){
            if(!this._checkRequestPending()){
            this.modelRef.attachDataReceived({},this._V4Received.bind(this));
            this.modelRef.attachDataRequested({},this._V4Changed.bind(this));
            }
            else{
               
                if(!window.navigator.onLine){
                    MessageToast.show("connection check...");
                }
                else{
                     MessageToast.show("connection is live \n but couldn't resolve the request");
                }

            }
        }
    }
})