class AddRemainTimeDifficulty < ActiveRecord::Migration[5.2]
  def change
    add_column :results, :remain_time, :float
    add_column :results, :difficulty, :integer
  end
end
