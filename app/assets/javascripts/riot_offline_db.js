(function () {
  riot.offlineDB = (function(){
    var offlineDB = function(){
      return this;
    };

    var methods = {
      init: function(tbList, callback){
        // Init indexedDB
        var self = this,
            req = window.indexedDB.open('riot_db', 1);

        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          e.target.transaction.onerror = function(err) { console.log("indexedDB Error", err); };

          _.each(tbList, function(tb) {
            if (!db.objectStoreNames.contains(tb)) {
              var store = db.createObjectStore(tb, {keyPath:'id', autoIncrement: true});
              console.log("indexedDB Create Table", store);
            }
          });
        };

        // 接続成功後の処理
        req.onsuccess = function(e) {
          self.db = (e.target) ? e.target.result : e.result;
          callback && callback();
        };
      },

      request: function(config){
        var targetTbs = config.has_many ? [config.remote].concat(config.has_many) : [config.remote],
            tr = this.db.transaction(targetTbs, "readwrite"),
            store = tr.objectStore(config.remote),
            name = config.remote.replace(/^\/(.*)s$/, '$1');

        switch (config.method) {
          case 'get':
            if(!config.id) {
              var req = store.getAll();
              req.onsuccess = function(){
                if(config.has_many) {
                  var child = config.has_many[0], // TODO: has_manyの一つ目しかfetchしてないので、すべて網羅するようにする。
                      child_name = child.replace(/^\//, ''),
                      child_store = tr.objectStore(child),
                      child_req = child_store.getAll();

                  child_req.onsuccess = function(){
                    var child_groups = _.groupBy(child_req.result, name+'_id');
                    _.each(req.result, function(result) {
                      result[child_name] = child_groups[result.id] || [];
                    });
                    config.success(req.result);
                  }
                  child_req.onerror = function(){
                    console.log("Get Child Request Failed");
                  }

                } else {
                  config.success(req.result);
                }
              }
              req.onerror = function(){
                console.log("Get Request Failed");
              }
            } else {
              var req = store.get(config.id);
              req.onsuccess = function(){
                if(config.has_many) {
                  var child = config.has_many[0],
                      child_name = child.replace(/^\//, ''),
                      child_store = tr.objectStore(child),
                      child_req = child_store.getAll();

                  child_req.onsuccess = function(){
                    var child_groups = _.groupBy(child_req.result, name+'_id');
                    req.result[child_name] = child_groups[req.result.id];
                    config.success(req.result);
                  }
                  child_req.onerror = function(){
                    console.log("Get Child Request Failed");
                  }

                } else {
                  config.success(req.result);
                }
              }
              req.onerror = function(){
                console.log("Get Request Failed");
              }
            }
            break;
          case 'post':
            var req = store.add(config.data[name]);
            req.onsuccess = function(){
              config.success(req.result);
            }
            req.onerror = function(){
              console.log("Post Request Failed");
            }
            break;
          case 'put':
            var data = _.extend({}, config.data[name], {id: config.id}),
                get_req = store.get(config.id);

            get_req.onsuccess = function(){
              data = _.extend(get_req.result, data);
              var req = store.put(data);

              req.onsuccess = function(){
                config.success(req.result);
              }
              req.onerror = function(){
                console.log("Put Request Failed");
              }
            }
            get_req.onerror = function(){
              console.log("Get Request for Put Failed");
            }
            break;
          case 'delete':
            var req = store.delete(config.id);
            req.onsuccess = function(){
              config.success(req.result);
            }
            req.onerror = function(){
              console.log("Delete Request Failed");
            }
            break;
        }

        tr.oncomplete = function(){console.log("Transaction Success")}
        tr.onerror = function(){console.log("Transaction Failed")}
      }
    }

    _.extend(offlineDB.prototype, methods);
    return new offlineDB();
  })();
})();