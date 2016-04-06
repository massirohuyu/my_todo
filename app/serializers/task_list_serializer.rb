class TaskListSerializer < ActiveModel::Serializer
  attributes :id, :name, :row_order
  has_many :tasks
  has_many :children
  belongs_to :user
  belongs_to :parent
end
