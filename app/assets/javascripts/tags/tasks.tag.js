riot.tag2('tasks', '<div if="{task_list}"> <h3> {task_list.name} </h3> <form onsubmit="{add}"> <input name="name" onkeyup="{input}" type="text"><br><textarea name="memo" onkeyup="{input}" rows="3"></textarea><button>add</button> </form> <ul> <li each="{task, i in task_list.tasks}"> <div if="{!task.is_editing}"> <label class="{done: task.done}"><input __checked="{task.done}" onclick="{toggle}" type="checkbox">{task.name} （{task.memo}）</input></label><button onclick="{toggle_editing}" type="button">edit</button><button onclick="{delete}" type="button">delete</button> </div> <form if="{task.is_editing}" onsubmit="{edit}"> <input name="name" type="text" value="{task.name}"><textarea name="memo" rows="3" value="{task.memo}"></textarea><button>ok</button><button onclick="{delete}" type="button">delete</button><button onclick="{toggle_editing}" type="button">cancel</button> </form> </li> </ul> </div>', 'tasks .done { text-decoration: line-through; }', '', function(opts) {
    this.task_list = opts.task_list;
    this.tasks = riot.collections.tasks;
    this.new_task = {};

    var self = this;

    this.input = function(e) {
      self.new_task[e.target.name] = e.target.value;
    }.bind(this)

    this.add = function(e) {
      var params = self.new_task;
      params.task_list_id = self.task_list.id;

      self.tasks.trigger('post', {task: params}, function(){
        self.trigger('changed');
      });
    }.bind(this)

    this.toggle = function(e) {
      var task = e.item.task
      task.done = !task.done

      self.tasks.trigger('patch', task.id, {task: task});
      return true
    }.bind(this)

    this.toggle_editing = function(e) {
      var task = e.item.task
      task.is_editing = !task.is_editing;
    }.bind(this)

    this.edit = function(e) {
      var task = e.item.task
      task.is_editing = false;

      var form = e.srcElement,
          params = _.reduce(form, function(params, elem){
            if ( elem.name ) {
              params[elem.name] = elem.value;
              task[elem.name] = elem.value;
            }
            return params
          }, {});

      self.tasks.trigger('patch', task.id, {task: params});
    }.bind(this)

    this.delete = function(e){
      var task = e.item.task;

      if ( confirm('削除しますか？') ) {
        self.tasks.trigger('delete', task.id, function(){
          self.trigger('changed');
        });
      }
    }.bind(this)

    self.on('changed', function(){
      if(self.task_list) {
        self.parent.task_lists.trigger('get_one', self.task_list.id, function(task_list){
          self.parent.selected_task_list = task_list;
          self.parent.update();
        });
      }
    });

    riot.event.on('change_selected_task_list', function(selected_task_list) {
      self.update({ task_list: selected_task_list });
    });
});
