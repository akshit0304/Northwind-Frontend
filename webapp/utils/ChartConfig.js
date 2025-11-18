sap.ui.define([],
    ()=>{
        "use strict"
        return {
    vizDonutchartConfig(){
        return {
                general:{
                    background:{
                        drawingEffect:"glossy"
                    }
                },
                 title:{
                        text:"customer Name",
                        visible:false
                    },
                plotArea: {
                    dataLabel: {
                        visible: true,
                        type: "percentage"
                    }
                },
                legendGroup:{
                    layout:{
                        position:"auto",
                         alignment: "center" 
                },
                linesOfWrap:3
            },
                legend: {
                    visible: true,
                    isScrollable:false,
                    scrollbar:{
                        
                    },
                    title:{
                        text:"customer Name",
                        visible:false
                    }

                },
                tooltip: {
                    visible: true,
                    // formatString:"hello akshit"

                },
                interaction:{
                    selectability:{
                        mode:"EXCLUSIVE",
                        legendSelection:false
                    },
                    hover:{
                        opacity:0.9,
                        stroke:"4px"
                    }
            }
            }
    },
     vizColumnchartConfig(){
        return {
                general:{
                    background:{
                        drawingEffect:"glossy"
                    }
                },
                 title:{
                        text:"customer Name",
                        visible:false
                    },
                plotArea: {
                    dataLabel: {
                        visible: true,
                        unitFormatType:"MetricUnits",
                        style:{
                            fontFamily:"Helvetica",
                            color:"#003a7d"
                            // plotArea.dataLabel.style.color
                        }
                    },
                // colorPalette:["#f1c232", "#EACF5E", "#F9AD79", "#D16A7C", "#8873A2", "#3A95B3", "#B6D949", "#FDD36C", "#F47958", "#A65084", "#0063B1", "#0DA841"]

                    
                },
                legendGroup:{
                    layout:{
                        position:"auto",
                         alignment: "center" 
                },
                linesOfWrap:3
            },
                legend: {
                    visible: false,
                    isScrollable:false,
                    scrollbar:{
                        
                    },
                    title:{
                        text:"customer Name",
                        visible:false
                    }

                },
                tooltip: {
                    visible: true,
                    // formatString:"hello akshit"

                },
                interaction:{
                    selectability:{
                        mode:"EXCLUSIVE",
                        legendSelection:false
                    },
                    hover:{
                        opacity:0.9,
                        stroke:"4px"
                    }
            },
            categoryAxis:{
                // color:"#9CC677",
                label:{
                angle:45,
                rotation:"auto"
            },
            title:{
                text:"shippers",
                visible:true
            }
        
        },
        valueAxis:{
            color:"#9CC677",
            title:{
                text:"no. of managed orders",
                visible:true
            }
        }
            }
    }
        }
    }
)