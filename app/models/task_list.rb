class TaskList < ActiveRecord::Base
  has_many :tasks
  has_many :children, class_name: 'TaskList', foreign_key: 'parent_id'
  belongs_to :user
  belongs_to :parent, class_name: 'TaskList'
end
