sap.ui.define(["sap/ui/model/SimpleType","sap/ui/model/ParseException","sap/base/util/each","sap/ui/model/ValidateException","sap/ui/core/Lib","sap/ui/model/type/String"],(SimpleType,ParseException,each,ValidateException,Library,String)=>{
    const Z_STRINGTYPE =SimpleType.extend("bd.businessportal.utils.odataType",{
        constructor : function () {
			SimpleType.apply(this, arguments);
			this.sName = "String";
		}
    });

    Z_STRINGTYPE.prototype.parseValue =function(vValue, sSourceType){
		if(!vValue){
			throw new ParseException("invalid input type to store the value in model");
		}
        if(typeof vValue=="string"){
            return vValue.trim();
        }
        return vValue;
	}
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
                                // console.log("violet");
							aViolatedConstraints.push("onlyAlphabet Allowed");
							aMessages.push("only alphabet characters and spaces allowed");
                            }
						}
						break;
					
					case 'alphanumericWithlength':
						let total_length =100;
						if(typeof vConstraint=='number' && vConstraint>0){total_length =vConstraint}
						else if(typeof vConstraint!='number' || vConstraint<1 || Boolean(vConstraint)===false){
							aViolatedConstraints.push("invalid length value.");
						}
						 if(!/^[A-Za-z\s0-9_/\\&^%$#@!\(\)-+=\n\s]*$/.test(sValue)){
							
							aMessages.push("enter only specified characters ([alphanumeric] _ / \\ & ^ % $ # @ !  ( ) - + = [newline and space])");
						 }
						 break;

					default:
						aViolatedConstraints.push("Un-known validation name");
						aMessages.push("un-recognized validation name");
				}
			});
			if (aViolatedConstraints.length > 0) {
				throw new ValidateException(this.combineMessages(aMessages), aViolatedConstraints);
			}
		}
	};
   
    return Z_STRINGTYPE
})