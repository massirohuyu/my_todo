riot.tag2('task_lists', '<h2 class="taskLists__title"> <i class="fa fa-list"></i> Task list </h2> <ul class="taskLists__lists" id="taskListsLists"> <li class="taskLists__list {putting: task_list.putting}" each="{task_list, i in task_lists.models}" hide="{task_list.moving}" ondragleave="{dragleave}" ondragover="{dragover}" ondrop="{drop}"> <div draggable="true" if="{!task_list.is_editing}" ondrag="{drag}" ondragend="{dragend}" ondragstart="{dragstart}"> <span class="taskLists__list__handle"></span><a class="taskLists__list__name" onclick="{open}">{task_list.name}<span class="taskLists__list__length-unfinished">{task_lists.length_unfinished(task_list.id)}</span></a><button class="btn taskLists__list__btn-edit" onclick="{toggle_editing}" type="button"><i class="fa fa-pencil"></i></button> </div> <form class="taskLists__list__edit-form" if="{task_list.is_editing}" onsubmit="{edit}"> <input class="input" name="name" type="text" value="{task_list.name}"> <div class="taskLists__list__edit-form__btns"> <button class="btn"><i class="fa fa-check"></i></button><button class="btn" onclick="{delete}" type="button"><i class="fa fa-trash"></i></button><button class="btn" onclick="{toggle_editing}" type="button"><i class="fa fa-times"></i></button> </div> </form> </li> </ul> <ul hide="{true}" id="placeholderCase"> <li class="tasklists__list--placeholder" id="placeholder" ondragover="{dragover_placeholder}" ondrop="{drop_placeholder}" show="{moving}"> ここに移動 </li> </ul> <form class="taskLists__list__edit-form" onsubmit="{add}"> <input class="input" name="name" onkeyup="{input}" type="text"> <div class="taskLists__list__edit-form__btns"> <button class="btn"><i class="fa fa-plus"></i></button> </div> </form>', '', 'class="taskLists"', function(opts) {
    var self = this;

    self.task_lists = riot.collections.task_lists;
    self.selected_task_list;
    self.dragged_task_list;
    self.moveing_index;

    self.task_lists.on('updated', function(){
      self.update();
    });

    self.new_task_list = {};
    self.moving = false;
    self.move = false;

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

    this.dragstart = function(e) {
      var task_list = e.item.task_list;
      self.dragged_task_list = task_list;
      e.dataTransfer.effectAllowed = 'move';
      return true;
    }.bind(this)

    this.drag = function(e) {
      e.item.task_list.moving = true;
      self.moving = true;
    }.bind(this)

    this.dragend = function(e) {
      var task_list = e.item.task_list,
          placeholder = document.getElementById('placeholder'),
          placeholderCase = document.getElementById('placeholderCase');

      if( self.move ) {
        self.move = false;
        console.log( task_list );
        if( self.moveing_index > task_list.row_order_position ) {
          self.moveing_index -= 1;
        }
        var params = {
          row_order_position: self.moveing_index
        }
        self.task_lists.trigger('patch', task_list.id, {task_list: params});
        self.moving = false;
      } else {
        e.item.task_list.moving = false;
      }
      placeholderCase.appendChild(placeholder);
      console.log( self.moveing_index );
      self.moveing_index = null;
      self.dragged_task_list = null;
    }.bind(this)

    this.dragover = function(e) {
      e.dataTransfer.dropEffect = 'move';
      var task_list = e.item.task_list,
          target = e.currentTarget,
          targetHeight = target.offsetHeight,
          placeholder = document.getElementById('placeholder'),
          placeholderCase = document.getElementById('placeholderCase');

      if( e.offsetY < 3 ) {
        task_list.putting = false;
        target.parentNode.insertBefore(placeholder, target);
        self.moveing_index = task_list.row_order_position;
      } else if( e.offsetY < targetHeight - 3 ) {
        task_list.putting = true;
        placeholderCase.appendChild(placeholder);
      } else {
        task_list.putting = false;
        target.parentNode.insertBefore(placeholder, target.nextElementSibling)
        self.moveing_index = task_list.row_order_position + 1;
      }
    }.bind(this)

    this.dragleave = function(e) {
      var task_list = e.item.task_list;
      task_list.putting = false;
    }.bind(this)

    this.dragover_placeholder = function(e) {
      e.dataTransfer.dropEffect = 'move';
    }.bind(this)

    this.drop = function(e) {
      var task_list = e.item.task_list;
      if( task_list.putting && self.dragged_task_list ) {
        console.log("drop");
        console.log( self.dragged_task_list );

      } else {
        self.move = true;
      }
      task_list.putting = false;
    }.bind(this)

    this.drop_placeholder = function(e) {
      self.move = true;
    }.bind(this)
});
