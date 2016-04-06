class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :memo, :done
  belongs_to :task_list
end
