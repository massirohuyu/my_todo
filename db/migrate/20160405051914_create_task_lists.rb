class CreateTaskLists < ActiveRecord::Migration
  def change
    create_table :task_lists do |t|
      t.string :name
      t.integer :row_order

      t.timestamps null: false
    end
  end
end
