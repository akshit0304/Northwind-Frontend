sap.ui.define(['sap/m/MessageToast'],(MessageToast)=>{

    return {
        constructor(that,modelRef,loaderPageId){
           console.log("constructor loaded"); 
           this.that =that;
           this.modelRef =modelRef;
           this.loaderPageId = loaderPageId;
           this.attachEvent();
           return this;

        },
        busyMechanism:function(flag=0){
            if(flag){
                this.that.byId(this.loaderPageId)?.setBusy(true);
                return;
            }
            this.that.byId(this.loaderPageId)?.setBusy();
        },
         _V4Changed:function(oEvent){
            if(this.modelRef.hasPendingChanges()){
                // debugger;
            }
            this.busyMechanism(1);
        },
        _V4Received:function(oEvent){
            if(Boolean(oEvent.mParameters.error) !=false && oEvent.mParameters.error.status!==200){
                MessageToast.show(oEvent.mParameters.error.message);
            }
            this.busyMechanism(0);
        },
        /**
         * - Abstract class 
         */
        _V4failed:function(oEvent){
           return null;
        },
        _checkRequestPending:function(){
            return this.modelRef.hasPendingChanges();
        },
        _changeContextandId: function(that,id){
            this.loaderPageId =id;
            this.that =that;
        },
        // static class
        attachEvent:function(){
            if(this.modelRef.mEventRegistry['dataReceived']==undefined){
                    this.modelRef.attachDataReceived({},this._V4Received.bind(this));
            }
            if(this.modelRef.mEventRegistry['dataRequested']==undefined){
                    this.modelRef.attachDataRequested({},this._V4Changed.bind(this));
            }    
        }
    }
})