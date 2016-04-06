class AddParentIdToTaskLists < ActiveRecord::Migration
  def change
    add_column :task_lists, :parent_id, :integer
  end
end
