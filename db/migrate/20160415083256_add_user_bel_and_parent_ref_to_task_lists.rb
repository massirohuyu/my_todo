class AddUserBelAndParentRefToTaskLists < ActiveRecord::Migration
  def change
    remove_column :task_lists, :user_id
    remove_column :task_lists, :parent_id
    add_reference :task_lists, :task_list, index: true, foreign_key: true
    add_reference :task_lists, :parent, index: true, foreign_key: false
  end
end
