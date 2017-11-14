angular.module('ezim.home')
    .controller(
        'inventoryGridController', [
            '$uibModal',
            '$uibModalInstance',
            'BarcodeScannerService',
            'inventoryDatasource',
            function inventoryGridCtrl($uibModal, $uibModalInstance, BarcodeScannerSvc, inventoryDatasource) {

                var that = this,
                    alerts = [];

                this.transactionInProgress = false;
                this.alerts = alerts;
                this.searchCriteria = "";
                this.sortExpression = '+name';
                this.inventory = [];
                this.itemsPerPageOpts = [10, 25, 50];
                this.itemsPerPage = this.itemsPerPageOpts[0];
                this.pagination = {
                    currentPage: 1,
                    totalItems: 0,
                    maxSize: 5
                };

                this.onSearchCriteriaChange = onSearchCriteriaChange;
                this.changeSortCriteria = changeSortCriteria;
                this.addMerchandise = addMerchandise;
                this.editMerchandise = editMerchandise;
                this.deleteMerchandise = deleteMerchandise;
                this.onItemsPerPageChange = onItemsPerPageChange;
                this.onPageNumberChange = onPageNumberChange;

                function _fetchData() {
                    var searchCriteria = that.searchCriteria,
                        itemsPerPage = that.itemsPerPage,
                        sortExpression = that.sortExpression,
                        numResultsToSkip = 0,
                        sort = {};

                    numResultsToSkip = itemsPerPage * (that.pagination.currentPage - 1)
                    sort[sortExpression.slice(1)] = sortExpression[0] === '+' ? 1 : -1;

                    that.transactionInProgress = true;
                    inventoryDatasource.query({
                            'l': itemsPerPage,
                            'sk': numResultsToSkip,
                            'q': {
                                'name': {
                                    '$regex': searchCriteria,
                                    '$options': 'i'
                                }
                            },
                            's': sort
                        })
                        .then(function successCb(response) {
                            var inventory = response.data;
                            that.inventory = inventory;
                        }, function errorCb(reason) {
                            alerts.push({
                                type: 'danger',
                                msg: 'A problem occurred loading your inventory, please try again.'
                            });
                        }).finally(function finallyCb() {
                            that.transactionInProgress = false;
                        });
                }

                function _updateRecordCount() {
                    var searchCriteria = that.searchCriteria,
                        requestParams = {
                            c: true
                        };

                    if (searchCriteria) {
                        requestParams.q = {
                            'name': {
                                '$regex': searchCriteria,
                                '$options': 'i'
                            }
                        };
                    }

                    inventoryDatasource.count(requestParams)
                        .then(function successCb(response) {
                            that.pagination.totalItems = response.data;
                        });
                }

                function addMerchandise() {
                    $uibModalInstance.close({
                        action: 'new'
                    });
                }

                function editMerchandise(merchandise) {
                    $uibModalInstance.close({
                        action: 'edit',
                        item: merchandise
                    });
                }

                function deleteMerchandise(merchandise, index) {
                    
                    function successCb() {
						that.transactionInProgress = true;
						inventoryDatasource.remove(merchandise._id.$oid)
                            .then(function successCb(result) {
                                alerts.push({
                                    type: 'success',
                                    msg: 'Item has been successfully deleted.'
                                });
                                that.pagination.currentPage = 1;
                                _fetchData();
                                _updateRecordCount();
                            }, function errorCb(result) {
                                alerts.push({
                                    type: 'danger',
                                    msg: 'A problem occurred deleting your item, please try again.'
                                });
                                that.transactionInProgress = false;
                            });
					}

                    $uibModal.open({
                        'templateUrl': 'js/home/views/confirmDelete.tpl.html',
                        'size': 'sm'
                    }).result.then(successCb);
                }

                function onSearchCriteriaChange() {
                    that.pagination.currentPage = 1;
                    _fetchData();
                    _updateRecordCount();
                }

                function changeSortCriteria(newSortColumn) {
                    var sortExpression = that.sortExpression,
                        currentColumn = sortExpression.slice(1),
                        newSortExpression;
                    
                    if (currentColumn === newSortColumn) {
                        newSortExpression = sortExpression[0] === '+' ? '-': '+';
                        newSortExpression += currentColumn;
                    } else {
                        newSortExpression = sortExpression[0];
                        newSortExpression += newSortColumn;
                    }
                    
                    that.sortExpression = newSortExpression;
                    _fetchData();
                }

                function onItemsPerPageChange() {
                    that.pagination.currentPage = 1;
                    _fetchData();
                }

                function onPageNumberChange() {
                    _fetchData();
                }

                (function loadInventory() {
                    _fetchData();
                    _updateRecordCount();
                })()
            }
        ]
    );
