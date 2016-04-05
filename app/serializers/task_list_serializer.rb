class TaskListSerializer < ActiveModel::Serializer
  attributes :id, :name, :row_order
end
