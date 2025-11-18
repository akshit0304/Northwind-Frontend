sap.ui.define([],
    () => {
        "use strict"
        return {
            // methods inside the object
            parseManager(empData) {
                // empData is array of employees (results parmeter of response)
                try {
                    let a = new Promise((resolve) => {
                        // let len =empData.length;
                        let manager_ar = [];
                        let map = new Map();
                        let counter = 0;
                        for (const emp of empData) {
                            map.set(emp.EmployeeID, counter)
                            if (emp.ReportsTo != null && !manager_ar.find((value) => { return emp.ReportsTo == value })) manager_ar.push(emp.ReportsTo)
                            counter += 1;
                        }
                        // get managers from the manager_ar id
                        const managers = [];
                        // const keys =map.keys()

                        for (const key of manager_ar) {
                            managers.push(
                                empData[map.get(key)]
                            )
                        }


                        resolve(managers);
                    })
                    return a;
                } catch (error) {
                    throw new Error(error);
                }
            },
            countData: function (keyName, data) {
                let flag = 0;
                if (!Array.isArray(data)) return null;
                for (const obj of data) {
                    if (!flag) {
                        flag=1;
                        if (!keyName) return null;
                        let _keys = Object.keys(obj);
                        var found = _keys.find((element) => {
                            if (element.toLowerCase() == keyName || element == keyName) {
                                return element
                            }
                            return null;
                        });
                    }
                    if (found) {
                        obj[found] = obj[found]['results'].length;
                    }
                }
                return data
            }
        }
    }
)
