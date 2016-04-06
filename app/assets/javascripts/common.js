(function () {
  //------ riot拡張 ------------
  //riot.event 全riot独自タグ内でイベント感知できるように
  riot.event = riot.observable();

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

      collection.on('get', function (params) {
        var co = this;
        if (!params) params = co.params;
        reqwest({
          url: this.remote + '?' + params,
          method: 'get',
          success: function (res) {
            var models = res;
            co.models = models;
            co.trigger('updated');
          }
        });
      });

      collection.on('patch', function (id, params) {
        var co = this;
        if (!id || !params) return;
        reqwest({
          url: this.remote + '/update/' + id,
          method: 'post',
          data: params,
          success: function (res) {
            var models = res;
            co.models = models;
            collection.trigger('get'); //co使わない？
          }
        });
      });
      collection.trigger('get'); //あとでrouteと合わせてparamを連動するよう修正

      return collection;
    }

  //-------------------------------
  
  //モデル群
  riot.collections = {
    tasks: riot.createCollection({
      remote: '/tasks'
    }),
    task_lists: riot.createCollection({
      remote: '/task_lists'
    }),
    users: riot.createCollection({
      remote: '/users'
    })
  }

  //タグをマウント
  riot.mount('*');
})();