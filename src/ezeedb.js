/*
	EzeeDb 0.0.1
	Updated: July 17, 2016

	http://ezeedb.com

	Copyright (c) 2009-2015, ProDev Apps.
*/

(function(){

	function EzeeDb(accountId) {
		this.data = null;
		this.accountId = accountId;
	}

	window.EzeeDb = EzeeDb;

	EzeeDb.prototype.fetchAll = function(resourceName) {
		if (!resourceName) {
			throw 'Please provide resource name';
		} else {
			return fetchResource({resource: resourceName, account_id: this.accountId});
		}
	}

	EzeeDb.prototype.findBy = function(resourceName, findBy) {
		if (!resourceName) {
			throw 'Please provide resource name';
		} else {
			return fetchResource({resource: resourceName, account_id: this.accountId, find_by: JSON.stringify(findBy)});
		}
	}

	EzeeDb.prototype.save = function(resourceName, data) {
		if (!resourceName) {
			throw 'Please provide resource name';
		} else {
			return saveData({resource: resourceName, account_id: this.accountId, data: JSON.stringify(data)});
		}
	}

	function fetchAllData(data) {
		return ajax('http://localhost:3000/data/fetch', data, 'GET');
	}

	function findBy(data) {
		return ajax('http://localhost:3000/data/fetch', data, 'GET');
	}

	function fetchResource(data) {
		if (!data.findBy) {
			return fetchAllData(data);
		} else {
			return findBy(data);
		}
	}

	function saveData(data) {
		return ajax('http://localhost:3000/data', data, 'POST');
	}

	function objToQueryParams(obj, prefix) {
		if (!obj) {
			return '';
		}
		var str = [];
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push(typeof v == "object" ? objToQueryParams(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	}

	function ajax(url, data, method, successCallback, errorCallback) {
		try {
			method = method || 'GET';
			data = objToQueryParams(data);
			url += (method == 'GET') ? ('?' + data) : '';
			var p = new Promise(function(resolve, reject) {
				var x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
				x.open(method, url, 1);
				x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				x.onreadystatechange = function () {
					if (x.readyState > 3) {
						if (x.status == 200 && successCallback) {
							successCallback(x.responseText, x);
						} else if (errorCallback) {
							errorCallback(x.responseText, x);
						}
						resolve(JSON.parse(x.responseText));
					}
				};
				x.send(data);
			});
			return p;
		} catch (e) {
			window.console && console.log(e);
		}
	};

})();