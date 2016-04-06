class AddDepthToTaskLists < ActiveRecord::Migration
  def change
    add_column :task_lists, :depth, :integer
  end
end
