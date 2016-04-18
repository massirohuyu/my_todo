class AddTaskListBelToTasks < ActiveRecord::Migration
  def change
    remove_column :tasks, :task_list_id
    add_reference :tasks, :task_list, index: true, foreign_key: true
  end
end
