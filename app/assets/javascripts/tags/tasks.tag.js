riot.tag2('tasks', '<div if="{task_list}"> <h3 class="tasks__title"> <i class="fa fa-list"></i> {task_list.name} </h3> <form class="tasks__add-form" onsubmit="{add}"> <input class="input" name="name" type="text" value="{new_task.name}"><textarea class="input m-t-10" if="{detail_is_shown}" name="memo" rows="3">{new_task.memo}</textarea> <div class="tasks__add-form__btns"> <button class="btn" onclick="{toggle_detail_shown}" type="button"><i class="fa fa-chevron-circle-down" if="{!detail_is_shown}"></i><i class="fa fa-chevron-circle-up" if="{detail_is_shown}"></i> Detail</button><button class="btn"><i class="fa fa-plus"></i> Add</button> </div> </form> <button class="btn u-mgb-10" onclick="{toggle_done_shown}" type="button"><i class="fa fa-eye"></i> Show done</button> <ul class="tasks__lists"> <li class="tasks__list" each="{task in task_list.tasks}" show="{!task.done || done_is_shown}"> <div if="{!task.is_editing}"> <div class="tasks__list__label {done: task.done}"> <input __checked="{task.done}" class="tasks__list__checkbox" onclick="{toggle}" type="checkbox">{task.name}<span class="task__list__memo" show="{task.memo}">- {task.memo}</span></input> </div> <div class="tasks__list__btns"> <button class="btn" onclick="{toggle_editing}" type="button"><i class="fa fa-pencil"></i></button><button class="btn" onclick="{delete}" type="button"><i class="fa fa-trash"></i></button> </div> </div> <form class="tasks__list__edit-form" if="{task.is_editing}" onsubmit="{edit}"> <input class="input" name="name" type="text" value="{task.name}"><textarea class="input" name="memo" rows="10" value="{task.memo}"></textarea> <div class="tasks__list__edit-form__btns"> <button class="btn"><i class="fa fa-check"></i> Edit</button><button class="btn" onclick="{delete}" type="button"><i class="fa fa-trash"></i> Delete</button><button class="btn" onclick="{toggle_editing}" type="button"><i class="fa fa-times"></i> Close</button> </div> </form> </li> <li class="tasks__list" if="{false}"> <div class="tasks__list__label"> No tasks. </div> </li> </ul> </div>', '', 'class="tasks"', function(opts) {


    var self = this;

    self.on('mount', function(){

      self.task_lists = riot.collections.task_lists;
      self.task_list = opts.task_list;
      self.tasks = riot.collections.tasks;
      self.detail_is_shown = false;
      self.done_is_shown = false;
      self.new_task = {};

    });

    this.toggle_detail_shown = function(e) {
      self.detail_is_shown = !self.detail_is_shown;
    }.bind(this)

    this.add = function(e) {
      for(var i = 0; i < e.srcElement.length; i++) {
        if ( e.target[i].name ) {
          self.new_task[e.target[i].name] = e.target[i].value;
        }
      }
      var params = self.new_task;
      params.task_list_id = self.task_list.id;

      self.tasks.trigger('post', {task: params}, function(){
        self.new_task = {};
        self.trigger('changed');
      });
    }.bind(this)

    this.toggle_done_shown = function(e) {
      self.done_is_shown = !self.done_is_shown;
    }.bind(this)

    this.toggle = function(e) {
      var task = e.item.task
      task.done = !task.done

      self.tasks.trigger('patch', task.id, {task: task}, function(){
        self.trigger('changed');
      });
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
        self.task_lists.trigger('get_one', self.task_list.id, function(task_list){

          self.update({ task_list: task_list });
        });
      }
    });

    riot.event.on('change_selected_task_list', function(selected_task_list) {
      self.new_task = {};
      self.update({ task_list: selected_task_list });
    });
});
