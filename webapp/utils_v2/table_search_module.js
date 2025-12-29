sap.ui.define(['sap/ui/model/Filter'],
    function (Filter) {
        return {
            searchEngine: function (query, arr) {
                // 1. Validate input
                if (typeof query !== "string" || query.length === 0 || !Array.isArray(arr) || arr.length === 0) {
                    return [];
                }
                // 2. Single filter
                const filters = [];
                if (arr.length === 1) {
                    filters.push(this.makeFilterObj(arr[0], query));
                    return filters;
                }
                // 4. Multiple filters → array of filters

                for (let i = 0; i < arr.length; i++) {
                    filters.push(this.makeFilterObj(arr[i], query));
                }

                return [new Filter({
                    'path':"/Categories",
                    'operator':'Any',
                    "filters": filters,
                    and: false,
                    caseSensitive:false

                })];
            },
            searchParse: function (oEvent, arr) {
                // arr is array of object
                // object format
                // {key, expression}
                let query = oEvent.getParameter("value")?.trim();
                let result = [];
                result = this.searchEngine(query, arr);
                oEvent.getParameter('itemsBinding').filter(result);
                return 1;
            },
            makeFilterObj({key, expression},query) {
                return new Filter(key,expression,query);
            },
        }
    }
)