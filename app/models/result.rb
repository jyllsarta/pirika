
# 1プレイの結果
class Result < ApplicationRecord
    validates :seed, presence: true
    validates :score, presence: true
    validates :username, presence: true
    validates :playlog, presence: true
end
