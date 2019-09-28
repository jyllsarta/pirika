class CreateArrowScores < ActiveRecord::Migration[5.1]
  def change
    create_table :arrow_scores do |t|
        t.integer :score,        null: false, default: 0
        t.integer :remove_score, null: false, default: 0
        t.integer :time_score,   null: false, default: 0
        t.string  :username,     null: false, default: ""
        t.timestamps
    end
  end
end
