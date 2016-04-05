class UserSerializer < ActiveModel::Serializer
  # 日付データはレスポンスに含めたくないので、ここで出力するアトリビュートを制限します
  attributes :id, :user_id, :name, :password

  # ビューを操作したい場合は、このように記述ができます。
  # ここでは、パスワードをレスポンスに含めたくないので代わりの文字列を出力させています。
  def password
    'xxxxxxxxxx'
  end
end