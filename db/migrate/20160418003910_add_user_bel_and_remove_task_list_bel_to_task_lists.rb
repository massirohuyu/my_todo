class AddUserBelAndRemoveTaskListBelToTaskLists < ActiveRecord::Migration
  def change
    remove_reference :task_lists, :task_list
    add_reference :task_lists, :user, index: true, foreign_key: true
  end
end
