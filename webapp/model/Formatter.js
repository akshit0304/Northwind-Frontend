sap.ui.define(["sap/ui/core/format/NumberFormat"],
    function (NumberFormat){
        return {
            currency:function(cur){
                // cinst =currency instance
                let cinst =NumberFormat.getCurrencyInstance();
                return cinst.format(cur,"EUR")
            },
            parseDate:function(date){
                if (typeof date=="string"){
                    date =new Date(date);
                }
                if(!date) return ''
                const map_month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                let month =map_month[date.getMonth()];
                let year =date.getFullYear();
                let date_ = date.getDate()
                return date_+" "+month+", "+year;
            },
            _checkType:function(label=false){
                if (typeof label=="boolean"){
                    return true;
                }
                return false;
            },
            pContinued_:function(label){
                if (typeof label=="boolean"){
                    return !label?"sap-icon://sys-enter-2":"sap-icon://cancel"
                } 
            },
            pContinued_state:function(label){
                if (typeof label=="boolean"){
                    return !label?"Success":"Warning"
                } 
            },
            pContinued_text:function(label){
                if (typeof label=="boolean"){
                    return !label?"In Stock":"Out Of Stock"
                }
            },
            employeeStatus:function(num){
                // console.log(num);
                return num?"Success":"Warning"
            },
            emptyDataHandle:function(data){
                // console.log(data);
                return data!=null?data:"-"
            },
            object_state:function(num){
                console.log(typeof num);
                return num?"None":"Warning"
            },
            abbreviateNumber:function(value) {
                var newValue = value;
                if (value >= 1000) {
                    var suffixes = ["", "K", "M", "B","T"];
                    var suffixNum = Math.floor( (""+value).length/3 );
                    var shortValue = '';
                    for (var precision = 2; precision >= 1; precision--) {
                        shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                        var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                        if (dotLessShortValue.length <= 2) { break; }
                    }
                    if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
                    newValue = shortValue+suffixes[suffixNum];
                }
                return newValue;
            }
            }
        }
    );