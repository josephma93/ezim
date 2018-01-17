angular.module('ezim.home')
    .component('paginationInfo', {
        bindings: {
            itemsPerPage: '<',
            totalItems: '<',
            currentPage: '<'
        },
        template: `Showing {{$ctrl.from}} to {{$ctrl.to}} from {{$ctrl.totalItems}} records`,
        controller: [
            function componentCtrl() {
                var that = this;
                
                that.from = 0;
                that.to = 0;
                
                function _updateValues(currentValues) {
                    var itemsPerPage = currentValues[0] || that.itemsPerPage,
                        totalItems = currentValues[1] || that.totalItems,
                        currentPage = currentValues[2] || that.currentPage,

                        startItem = itemsPerPage * (currentPage - 1) + 1,
                        endItem = startItem - 1 + itemsPerPage;

                    if (totalItems === 0) {
                        startItem = 0;
                    }
                    if (endItem > totalItems) {
                        endItem = totalItems;
                    }
                    
                    that.from = startItem;
                    that.to = endItem;
                }
                
                function $onChanges(changesObj) {
                    var currentValues = ['itemsPerPage', 'totalItems', 'currentPage'].reduce(function extractCurrentValue(accum, key) {
                        var changeObj = changesObj[key];
                        accum.push(changeObj ? changeObj.currentValue : null);
                        return accum;
                    }, []);
                    
                    _updateValues(currentValues);
                }
                
                
                that.$onChanges = $onChanges;
            }
        ]
    });