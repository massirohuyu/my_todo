class TaskList < ActiveRecord::Base
  include RankedModel
  
  has_many :tasks
  has_many :children, class_name: 'TaskList', foreign_key: 'parent_id'
  belongs_to :user
  belongs_to :parent, class_name: 'TaskList'
  
  ranks :row_order
end
