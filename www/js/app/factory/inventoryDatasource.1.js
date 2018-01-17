angular.module('ezim.home')
	.service('inventoryDatasource', [
		'$q',
		'$http',
		function inventoryDatasource($q, $http) {
			
			var INVENTORY_COLLECTION = 'https://api.mlab.com/api/1/databases/ezim_db/collections/inventory';

			function _addDefaultParams (params) {
				if (angular.isObject(params) === false) {
					params = {};
				}

				return angular.extend(params, {
					'apiKey': 'OXivsLCwLVUPGNuIN_sJCcDrzEo07u93'
				});
			}

			function get(params) {

				var requestParams = _addDefaultParams(angular.extend({
					'fo': true
				}, params));

				return $http.get(INVENTORY_COLLECTION, {
					params: requestParams
				});
			}

			function query(params) {
				return $http.get(INVENTORY_COLLECTION, {
					params: _addDefaultParams(params)
				});
			}

			function save(data, params) {
			    return $http.post(
				    INVENTORY_COLLECTION,
				    data,
				    {
				        params: _addDefaultParams(params)
				    }
			    );
			}

			function update(data, params) {
			    return $http.put(
				    INVENTORY_COLLECTION,
				    {
					    '$set': data
				    },
				    {
				        params: _addDefaultParams(params)
				    }
			    );
			}

			function remove(documentId) {
				return $http.delete(INVENTORY_COLLECTION + '/' + documentId, {
					params: _addDefaultParams()
				});
			}

			function count(params) {
				return $http.get(INVENTORY_COLLECTION, {
					params: _addDefaultParams(params)
				});
			}

			this.get = get;
			this.query = query;
			this.save = save;
			this.update = update;
			this.remove = remove;
			this.count = count;
		}
	]);