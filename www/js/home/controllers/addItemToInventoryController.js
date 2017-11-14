angular.module('ezim.home')
    .controller(
        'addItemToInventoryController',
        [
            'BarcodeScannerService',
            'inventoryDatasource',
            'itemToEdit',
            function findInventoryItemCtrl(BarcodeScannerSvc, inventoryDatasource, itemToEdit) {

                var that = this,
                    EDIT_MODE = angular.isObject(itemToEdit),
                    alerts = [],
                    itemToProcess = {
                        code: '',
                        name: '',
                        cost: '',
                        quantity: ''
                    };

                if (EDIT_MODE) {
                    angular.extend(itemToProcess, itemToEdit);
                }

                this.alerts = alerts;
                this.transactionInProgress = false;
                this.itemToProcess = itemToProcess;
                this.EDIT_MODE = EDIT_MODE;

                this.scanBarcode = scanBarcode;
                this.registerItem = registerItem;
                this.updateItem = updateItem;
                
                function scanBarcode() {
                    BarcodeScannerSvc.scan()
                        .then(function weGotACode(result) {
                            if (result.cancelledfalse) {
                                return;
                            }
                            
                            itemToProcess.code = result.text;
                        });
                }
                
                function registerItem() {
                    that.transactionInProgress = true;

                    inventoryDatasource.save(itemToProcess, {'q': {'code': itemToProcess.code}})
                        .then(
                            function happyPath() {
                                alerts.push({
                                    type: 'success',
                                    msg: 'Item quantity has been successfully updated.'
                                });
                                angular.extend(itemToProcess, {
                                    code: '',
                                    name: '',
                                    cost: '',
                                    quantity: ''
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
                
                function updateItem() {
                    that.transactionInProgress = true;

                    inventoryDatasource.update(itemToProcess, {'q': {'code': itemToProcess.code}})
                        .then(
                            function happyPath() {
                                alerts.push({
                                    type: 'success',
                                    msg: 'Item has been successfully updated.'
                                });
                            },
                            function sadPath() {
                                alerts.push({
                                    type: 'danger',
                                    msg: 'A problem occurred updating your item, please try again.'
                                });
                            }
                        )
                        .finally(
				            function finallyCb() {
				                that.transactionInProgress = false;
				            }
			            );
                }
            }
        ]
    );