riot.tag2('task_lists', '<h2 class="taskLists__title"> <i class="fa fa-list"></i> Task list </h2> <ul class="taskLists__lists"> <li class="taskLists__list" each="{task_list, i in task_lists.models}"> <div if="{!task_list.is_editing}"> <a class="taskLists__list__name" onclick="{open}">{task_list.name}</a><button class="btn taskLists__list__btn-edit" onclick="{toggle_editing}" type="button"><i class="fa fa-pencil"></i></button> </div> <form class="taskLists__list__edit-form" if="{task_list.is_editing}" onsubmit="{edit}"> <input class="input" name="name" type="text" value="{task_list.name}"> <div class="taskLists__list__edit-form__btns"> <button class="btn"><i class="fa fa-check"></i></button><button class="btn" onclick="{delete}" type="button"><i class="fa fa-trash"></i></button><button class="btn" onclick="{toggle_editing}" type="button"><i class="fa fa-times"></i></button> </div> </form> </li> </ul> <form class="taskLists__list__edit-form" onsubmit="{add}"> <input class="input" name="name" onkeyup="{input}" type="text"> <div class="taskLists__list__edit-form__btns"> <button class="btn"><i class="fa fa-plus"></i></button> </div> </form>', '', 'class="taskLists"', function(opts) {
    var self = this;

    self.task_lists = riot.collections.task_lists;
    self.selected_task_list;

    self.task_lists.on('updated', function(){
      self.update();
    });

    self.new_task_list = {};

    this.input = function(e) {
      self.new_task_list.name = e.target.value;
    }.bind(this)

    this.add = function(e) {
      var params = self.new_task_list;

      self.task_lists.trigger('post', {task_list: params});
    }.bind(this)

    this.open = function(e) {
      self.selected_task_list = e.item.task_list;
      riot.event.trigger('change_selected_task_list', self.selected_task_list)
      riot.route('open/' + e.item.task_list.id)
    }.bind(this)

    this.delete = function(e){
      var task_list = e.item.task_list;

      if ( task_list.tasks.length > 0 ) {
        alert('タスクがあるリストは削除できません。')
      } else if ( confirm('削除しますか？') ) {
        self.task_lists.trigger('delete', task_list.id);
      }
    }.bind(this)

    this.toggle_editing = function(e) {
      var task_list = e.item.task_list
      task_list.is_editing = !task_list.is_editing;
    }.bind(this)

    this.edit = function(e) {
      var task_list = e.item.task_list
      task_list.is_editing = false;

      var form = e.srcElement,
          params = _.reduce(form, function(params, elem){
            if ( elem.name ) {
              params[elem.name] = elem.value;
              task_list[elem.name] = elem.value;
            }
            return params
          }, {});

      self.task_lists.trigger('patch', task_list.id, {task_list: params});
    }.bind(this)
});
