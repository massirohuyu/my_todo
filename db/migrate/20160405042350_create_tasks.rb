class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.text :memo
      t.boolean :done, :default => false
      t.timestamp :done_at

      t.timestamps null: false
    end
  end
end
