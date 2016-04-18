class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :memo, :done, :task_list_id
  belongs_to :task_list
end
