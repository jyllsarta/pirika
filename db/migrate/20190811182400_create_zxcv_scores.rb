class CreateZxcvScores < ActiveRecord::Migration[5.1]
  def change
    create_table :zxcv_scores do |t|
        t.integer :score,       null: false, default: 0
        t.integer :speed_score, null: false, default: 0
        t.integer :total_score, null: false, default: 0
        t.string :username,     null: false, default: ""
        t.timestamps
    end
  end
end
