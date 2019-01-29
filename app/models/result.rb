# 1プレイの結果
class Result < ApplicationRecord
  validates :seed, null: false
  validates :score, null: false
  validates :username, null: false
  validates :playlog, null: false
  validates :difficulty, null: false
  validates :remain_time, null: false
  validates :extinct, null: false

  def self.high_scores(username)
    scores = self.where(username: username).order(score: "DESC")
    times = self.where(username: username).order(remain_time: "DESC")

    # SQL 6本が重かったら一度に取得してうまいことフィルタリングする
    score_easy = scores.where(difficulty: 1).try(:first).try(:score)
    score_normal = scores.where(difficulty: 2).try(:first).try(:score)
    score_hard = scores.where(difficulty: 3).try(:first).try(:score)
    time_easy = times.where(difficulty: 1, extinct: true).try(:first).try(:remain_time)
    time_normal = times.where(difficulty: 2, extinct: true).try(:first).try(:remain_time)
    time_hard = times.where(difficulty: 3, extinct: true).try(:first).try(:remain_time)

    return {
      score_easy: score_easy,
      score_normal: score_normal,
      score_hard: score_hard,
      time_easy: time_easy,
      time_normal: time_normal,
      time_hard: time_hard,
    }
  end
end
