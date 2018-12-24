class CreateScores < ActiveRecord::Migration[5.1]
  def change
    create_table :scores do |t|

      t.timestamps
    end
  end
end
