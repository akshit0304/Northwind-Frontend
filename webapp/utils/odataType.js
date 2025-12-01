sap.ui.define(["sap/ui/model/SimpleType","sap/ui/model/ParseException","sap/base/util/each","sap/ui/model/ValidateException","sap/ui/core/Lib","sap/ui/model/type/String"],(SimpleType,ParseException,each,ValidateException,Library,String)=>{
    const Z_STRINGTYPE =SimpleType.extend("bd.businessportal.utils.odataType",{
        constructor : function () {
			SimpleType.apply(this, arguments);
			this.sName = "String";
		}
    });

    Z_STRINGTYPE.prototype.parseValue =function(vValue, sSourceType){
        if(typeof vValue=="string" && /^[A-Za-z\s]+$/.test(vValue)){
            vValue =vValue.trim();
            return vValue;
        }
        else{
            throw new ParseException("invalid input type");
        }
    };
    Z_STRINGTYPE.prototype.formatValue =String.prototype.formatValue;

   Z_STRINGTYPE.prototype.validateValue =function(sValue){
     if (this.oConstraints) {
			var oBundle = Library.getResourceBundleFor("sap.ui.core"),
				aViolatedConstraints = [],
				aMessages = [];

			if (sValue === null) {
				sValue = "";
			}
			each(this.oConstraints, function (sName, vConstraint) {
				switch (sName) {
					case "onlyAlphabet":
						if (vConstraint ===true) {
                            if(!/^[A-Za-z\s]*$/.test(sValue)){
                                console.log("violet");
							aViolatedConstraints.push("onlyAlphabet");
							aMessages.push("only alphabet characters and spaces allowed");
                            }
						}
						break;
					default:
						console.log("Ignoring unknown constraint: '");
				}
			});
			if (aViolatedConstraints.length > 0) {
				throw new ValidateException(this.combineMessages(aMessages), aViolatedConstraints);
			}
		}
	};
   
    return Z_STRINGTYPE
})