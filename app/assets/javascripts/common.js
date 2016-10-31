(function () {
  //------ riot拡張 ------------
  //riot.event 全riot独自タグ内でイベント感知できるように
  riot.event = riot.observable();
  
  //オフラインか否か（localStrage使うか否か）
  riot.isOffline = false;

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

      collection.on('get_one', function (id, callback) {
        var co = this;
        if (typeof id !== 'number') return;

        riot.sendRequest({
          id: id,
          remote: this.remote,
          method: 'get',
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
      console.log('Using Offline Mode.');
      console.log(config);

      var item_str = localStorage[config.remote];
      if (!item_str) {
        localStorage.setItem(config.remote, JSON.stringify('[]'));
        item_str = localStorage[config.remote];
      }

      var item = JSON.parse(item_str);
      console.log(item);
      
      //TODO: ここでwhenでmethodごとに処理を実行。
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
  
  //モデル群
  riot.collections = {
    tasks: riot.createCollection({
      remote: '/tasks'
    }),
    task_lists: riot.createCollection({
      remote: '/task_lists',
      methods: {
        length_unfinished: function(id){
          var task_list = _.find(this.models, ['id', id]),
              unfinisheds = _.filter(task_list.tasks, {
                'done': false
              });
          return unfinisheds.length;
        }
      }
    }),
    users: riot.createCollection({
      remote: '/users'
    })
  }

  //タグをマウント
  riot.mount('*');
})();