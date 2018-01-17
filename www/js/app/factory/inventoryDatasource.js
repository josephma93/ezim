angular.module('ezim.home')
	.service('inventoryDatasource', [
		'$q',
		'$filter',
		'$http',
		'fileApi',
		function inventoryDatasource($q, $filter, $http, fileApi) {
			
			var filterFn = $filter('filter'),
				orderByFn = $filter('orderBy'),
				limitToFn = $filter('limitTo');
			
			function _initOrParseDbFile() {
				return fileApi.readDbFile()
					.then(
						function successCb(dbFile) {
							var result;

							try {
								result = JSON.parse(dbFile);
							} catch (e) {
								if (dbFile === '') {
									result = {
										inventory: []
									};
								} else {
									return $q.reject({
										code: 'INVALID_DB_FORMAT',
										message: 'A problem with the database file format was found'
									});
								}
							}
							
							return result;
						},
						$q.reject.bind($q)
					);
			}
			
			function query(params) {
				var query = params.q,
					count = params.c,
					sortOrder = params.s,
					skip = params.sk,
					limit = params.l;
			
				return _initOrParseDbFile()
					.then(
						function successCb(DB) {
							var inventory = DB.inventory,
								result = inventory;
							
							if (angular.isDefined(query)) {
								result = filterFn(inventory, query);
							}
							
							if (angular.isDefined(sortOrder)) {
								result = orderByFn(result, sortOrder);
							}
							
							if (angular.isDefined(skip) && angular.isDefined(limit)) {
								result = limitToFn(result, limit, skip);
							}
							
							if (angular.isDefined(count)) {
								result = result.length;
							}
							
							return result;
						},
						$q.reject.bind($q)
					);
			}
			
			function get(params) {

				return query(params)
					.then(
						function successCb(records) {
							return records[0] || null;
						},
						$q.reject.bind($q)
					);
			}

			function save(data, params) {
				var query = params.q;
				
				return _initOrParseDbFile()
					.then(
						function successCb(DB) {
							var inventory = DB.inventory,
								records = filterFn(inventory, query);
							
							if (records.length > 0) {
								return $q.reject({
									code: 'INDEX_VIOLATED',
									message: 'Unique index restriction violated, a duplicated index is not allowed.'
								});
							}
							
							inventory.push(data);
							
							return fileApi.writeDbFile(DB);
						},
						$q.reject.bind($q)
					);
			}

			function update(data, params) {
				var query = params.q;
				
				return _initOrParseDbFile()
					.then(
						function successCb(DB) {
							var inventory = DB.inventory,
								records = filterFn(inventory, query, true);
							
							if (records.length === 0) {
								return $q.reject({
									code: 'ENTRY_NOT_FOUND',
									message: 'No items can be updated with the given query.'
								});
							} else {
								if (filterFn(inventory, { code: data.code }, true).length > 0) {
									return $q.reject({
										code: 'INDEX_VIOLATED',
										message: 'Unique index restriction violated, a duplicated index is not allowed.'
									});
								}
								records.forEach(function updateDbEntries(dbEntry) {
									Object.assign(dbEntry, data);
								});
							}
							
							return fileApi.writeDbFile(DB);
						},
						$q.reject.bind($q)
					);
			}

			function remove(documentId) {

				return _initOrParseDbFile()
					.then(
						function successCb(DB) {
							var inventory = DB.inventory,
								matchIndex;
							
							matchIndex = inventory.findIndex(function findEntryIndex(dbEntry) {
								return documentId === dbEntry.code;
							});
							
							if (matchIndex > -1) {
								inventory.splice(matchIndex, 1);
							}
							
							return fileApi.writeDbFile(DB);
						},
						$q.reject.bind($q)
					);
			}

			function count(params) {
				var query = params.q;
				
				return _initOrParseDbFile()
					.then(
						function successCb(DB) {
							var inventory = DB.inventory,
								records = filterFn(inventory, query);

							return records.length;
						},
						$q.reject.bind($q)
					);
			}

			this.query = query;
			this.get = get;
			this.save = save;
			this.update = update;
			this.remove = remove;
			this.count = count;
		}
	]);