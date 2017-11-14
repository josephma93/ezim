angular.module('ezim.home')
	.controller(
		'homeController',
		[
			'$uibModal',
			function homeCtrl($uibModal) {
				
				function findInventoryItem() {
					
					$uibModal.open({
						'controller': 'findInventoryItemController as FindCtrl',
						'templateUrl': 'js/home/views/findInventoryItem.tpl.html',
						'windowClass': 'find-item-modal'
					});
				}
				
				function addItemToInventory(itemToEdit) {
					
					$uibModal.open({
						'controller': 'addItemToInventoryController as AddCtrl',
						'templateUrl': 'js/home/views/addItemToInventory.tpl.html',
						'windowClass': 'add-item-modal',
						resolve: {
							itemToEdit: function resolver() {
								return itemToEdit || null;
							}
						}
					});
				}
				
				function addInventoryGrid() {
					var modalInstance,
						modalResult;
					
					modalInstance = $uibModal.open({
						'controller': 'inventoryGridController as GridCtrl',
						'templateUrl': 'js/home/views/inventoryGrid.tpl.html',
						'windowClass': 'items-grid-modal',
						'size': 'lg'
					});
					
					modalInstance.result.then(function successCb(result) {
						modalResult = result;
					});
					modalInstance.closed.then(function closedCb() {
						if (angular.isUndefined(modalResult)) {
							return;
						}
						
						var action = modalResult.action;
						if (action === 'edit') {
							addItemToInventory(modalResult.item);
						} else if (action === 'new') {
							addItemToInventory();
						}
					});
				}
				
				this.findInventoryItem = findInventoryItem;
				this.addItemToInventory = addItemToInventory;
				this.addInventoryGrid = addInventoryGrid;
			}
		]
	)