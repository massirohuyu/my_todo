class UserSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :name, :password
  has_many :task_lists

  def password
    'xxxxxxxxxx'
  end
end