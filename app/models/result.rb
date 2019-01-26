# 1プレイの結果
class Result < ApplicationRecord
  validates :seed, null: false
  validates :score, null: false
  validates :username, null: false
  validates :playlog, null: false
  validates :difficulty, null: false
  validates :remain_time, null: false
  validates :extinct, null: false
end
