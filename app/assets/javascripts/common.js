(function () {
  //------ riot拡張 ------------
  //riot.event 全riot独自タグ内でイベント感知できるように
  riot.event = riot.observable();
  
  //オフラインか否か（localStrage使うか否か）
  riot.isOffline = true;
  
  //オフライン時に使用するindexedDB
  riot.offlineDB = null;

  //riot.getData タグからdata-○○属性を取得
  riot.getData = function (dom, name) {
    if (!document.createElement('div').dataset) {
      return dom.getAttribute('data-' + name);
    }
    return dom.dataset[name];
  }

  //riot.createCollection リモートからデータをAjaxで取得して、モデル群を保持
  riot.createCollection = function (opts) {
      var collection = riot.observable(),
        opts = opts || {};

      collection.remote = opts.remote;
      collection.has_many = opts.has_many;
      collection.params = '';
      collection.isReady = function () {
        return (this.models && this.models.length > 0);
      }
      _.extend(collection, opts.methods);

      collection.on('get', function (callback) {
        var co = this;

        riot.sendRequest({
          remote: this.remote,
          params: co.params,
          method: 'get',
          has_many: co.has_many,
          success: function (res) {
            var models = res;
            co.models = models;
            _.each(co.models, function(model, i) {
              model['row_order_position'] = i;
            });
            if (typeof callback === 'function') callback(models);
            co.trigger('updated');
          }
        });
      });

      collection.on('get_one', function (id, callback) {
        var co = this;
        if (typeof id !== 'number') return;

        riot.sendRequest({
          id: id,
          remote: this.remote,
          method: 'get',
          has_many: co.has_many,
          success: function (res) {
            var model = res,
                index = _.findIndex(co.models, ['id', id]);
            model['row_order_position'] = index;
            co.models[index] = model;
            if (typeof callback === 'function') callback(model);
            co.trigger('updated');
          }
        });
      });

      collection.on('post', function (params, callback) {
        var co = this;
        if (!params) return;

        riot.sendRequest({
          remote: this.remote,
          method: 'post',
          data: params,
          success: function (res) {
            if (typeof callback === 'function') callback(res);
            co.trigger('get');
          }
        });
      });

      collection.on('patch', function (id, params, callback) {
        var co = this;
        if (typeof id !== 'number' || !params) return;

        riot.sendRequest({
          id: id,
          remote: this.remote,
          method: 'put',
          data: params,
          success: function (res) {
            if (typeof callback === 'function') callback(res);
            co.trigger('get');
          }
        });
      });

      collection.on('delete', function (id, callback) {
        var co = this;
        if (typeof id !== 'number') return;

        riot.sendRequest({
          id: id,
          remote: this.remote,
          method: 'delete',
          success: function (res) {
            if (typeof callback === 'function') callback(res);
            co.trigger('get');
          }
        });
      });
      collection.trigger('get'); //あとでrouteと合わせてparamを連動するよう修正

      return collection;
    }

  //-------------------------------

  riot.sendRequest = function(config){
    var config = _.extend({}, config),
        id_param = config.id ? '/'+config.id : '',
        params = config.params ? '?'+config.params : '';

    if (riot.isOffline) {
      // TODO: カオスなので別ファイルに分ける。
      console.log('Using Offline Mode.');
      console.log(config);

      var targetTbs = config.has_many ? [config.remote].concat(config.has_many) : [config.remote],
          tr = riot.offlineDB.transaction(targetTbs, "readwrite"),
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
                    result[child_name] = child_groups[result.id];
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

    } else {
      reqwest({
        url: config.remote + id_param + params,
        method: config.method,
        data: config.data,
        success: config.success,
        error: function (err) {
          console.log(err);
          console.log('If you want to use Offline Mode, you must change "riot.isOffline" to "true".');
        }
      });
    }
  }

  //-------------------------------

  var MyTodoApp = {

    init: function() { //---------
      if (riot.isOffline) {
        // Init indexedDB
        var tbList = ['/tasks', '/task_lists', '/users']; // TODO: もっといい方法があれば……
        var req = window.indexedDB.open('riot_db', 1);

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
          riot.offlineDB = (e.target) ? e.target.result : e.result;

          MyTodoApp.initCollections();
          //タグをマウント
          riot.mount('*');
        };

      } else {
        MyTodoApp.initCollections();
        //タグをマウント
        riot.mount('*');
      }
    },

    initCollections: function() { //---
      //モデル群
      riot.collections = {
        tasks: riot.createCollection({
          remote: '/tasks'
        }),
        task_lists: riot.createCollection({
          remote: '/task_lists',
          has_many: ['/tasks'],
          methods: {
            length_unfinished: function(id){
              var task_list = _.find(this.models, ['id', id]),
                  unfinisheds = _.filter(task_list.tasks, function(task) {
                    return !task.done;
                  });
              return unfinisheds.length;
            }
          }
        }),
        users: riot.createCollection({
          remote: '/users'
        })
      }
    }
  };

  MyTodoApp.init();

})();