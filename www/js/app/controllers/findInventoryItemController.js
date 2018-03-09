angular.module('ezim.home')
    .controller(
        'findInventoryItemController',
        [
            'BarcodeScannerService',
            'inventoryDatasource',
            '$http',
            function findInventoryItemCtrl(BarcodeScannerSvc, inventoryDatasource, $http) {

                var that = this,
                    alerts = [],
                    itemFound = {
                        code: '',
                        name: '',
                        cost: '',
                        quantity: ''
                    };

                this.itemFound = itemFound;
                this.transactionInProgress = true;
                this.alerts = alerts;

                this.hasValidItem = hasValidItem;
                this.hasntValidItem = hasntValidItem;
                this.cantRegisterSale = cantRegisterSale;
                this.scanItemAgain = scanItemAgain;
                this.registerSale = registerSale;
                
                function hasValidItem() {
                    var itemFound = that.itemFound;
                    return itemFound && angular.isObject(itemFound._id);
                }
                
                function hasntValidItem() {
                    return !hasValidItem();
                }
                
                function cantRegisterSale() {
                    return itemFound.quantity < 1;
                }
                
                function scanItemAgain() {
                    that.transactionInProgress = true;

                    BarcodeScannerSvc.scan()
    					.then(
    					    function happy(result) {
    					        
    					        if (result.cancelled) {
    					            return alerts.push({
                                        type: 'warning',
                                        msg: 'Barcode scanning process canceled.'
                                    });
    					        }
    					    
        					    return inventoryDatasource.get({'q': {'code': result.text}})
        					        .then(
        					            function successCb(item) {

            					            if (item === null) {
            					                Object.assign(itemFound, {
                                                    code: '',
                                                    name: '',
                                                    cost: '',
                                                    quantity: ''
                                                });
                                                alerts.push({
                                                    type: 'danger',
                                                    msg: 'No items were found for the given barcode, please try again.'
                                                });
                                                return;
            					            }
            					            
            					            Object.assign(itemFound, item);
            					        },
            					        function errorCb(reason) {
            					            alerts.push({
                                                type: 'danger',
                                                msg: 'A problem occurred finding the item, please try again.'
                                            });
            					        }
        					        );
    					    },
        					function sad() {
        						alerts.push({
                                    type: 'danger',
                                    msg: 'A problem occurred reading the barcode, please try again.'
                                });
        					}
    					)
    					.finally(
				            function finallyCb() {
				                that.transactionInProgress = false;
				            }
			            );
                }
                
                function registerSale() {
                    that.transactionInProgress = true;

                    itemFound.quantity -= 1;

                    inventoryDatasource.update(itemFound, {'q': {'code': itemFound.code}})
                        .then(
                            function happyPath() {
                                alerts.push({
                                    type: 'success',
                                    msg: 'Item quantity has been successfully updated.'
                                });
                            },
                            function sadPath() {
                                alerts.push({
                                    type: 'danger',
                                    msg: 'A problem occurred updating the item, please try again.'
                                });
                            }
                        )
                        .finally(
				            function finallyCb() {
				                that.transactionInProgress = false;
				            }
			            );
                }
                
                // Scan item and get its data from datasource
                scanItemAgain();
            }
        ]
    );