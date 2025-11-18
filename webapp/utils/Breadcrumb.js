sap.ui.define([],
    ()=>{
        "use strict"
        return {
        createBreadcrumb(list){
        // const  list =this.rc.getBreadcrumbAr();
        const breadcrumb_data =[];
        let index =-1;
        let object =list.at(index);
        let object_level =object["level"];
        let object_name =object["name"];
        breadcrumb_data.push(object_name);
        while (object_level>0) {
            index--;
            object =list.at(index);
            object_level =object["level"];
            object_name =object["name"];
            breadcrumb_data.push(object_name);
        }
        return breadcrumb_data.reverse();   
    },
    // dynamically insert the link
    createDynamicBreadcrumb(that,id,list){
        const link_data =this.createBreadcrumb(list);
        let breadcrumb =that.byId(id);
        if(!breadcrumb) {return 0;}
        let link_object;
        for (const link of link_data) {
            link_object =new sap.m.Link({
                text:link,
                enabled:false
            });
            breadcrumb.addLink(link_object);
        }
        breadcrumb.setCurrentLocation(link_object);

    }
        }
    }
)