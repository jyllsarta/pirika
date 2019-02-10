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

  def self.ranking(difficulty, limit)
    scores = Result.order(score: :desc).where(difficulty: difficulty)
    ranking = []
    scores.each do |score|
      ranking.append(score) if ranking.all?{|rank| rank.username != score.username}
      break if ranking.length == limit
    end
    ranking
  end

  def self.time_ranking(difficulty, limit)
    scores = Result.order(remain_time: :desc).where(difficulty: difficulty, extinct: true)
    ranking = []
    scores.each do |score|
      ranking.append(score) if ranking.all?{|rank| rank.username != score.username}
      break if ranking.length == limit
    end
    ranking
  end

  def self.high_score?(username, difficulty, compare_score)
    return false if compare_score == 0
    high_score = self.where(username: username, difficulty: difficulty).order(score: "DESC").try(:first).try(:score)
    return true if high_score.nil?
    return compare_score > high_score
  end

  def self.best_time?(username, difficulty, compare_time)
    best_time = self.where(username: username, difficulty: difficulty, extinct: true).order(score: "DESC").try(:first).try(:remain_time)
    return true if best_time.nil?
    return compare_time > best_time
  end

  def self.create_default_rank
    10.times do |i|
      Result.create!(seed: 100000000, score: i*50, username: "ななしろこ#{i+1}号", playlog: "{}", remain_time: 5 - i*0.5, difficulty: 1, extinct: false)
      Result.create!(seed: 100000000, score: i*50, username: "ななしろこ#{i+1}号", playlog: "{}", remain_time: 5 - i*0.5, difficulty: 2, extinct: false)
      Result.create!(seed: 100000000, score: i*50, username: "ななしろこ#{i+1}号", playlog: "{}", remain_time: 5 - i*0.5, difficulty: 3, extinct: false)
      Result.create!(seed: 100000000, score: i*50, username: "ななしろこ#{i+1}号", playlog: "{}", remain_time: 5 - i*0.5, difficulty: 1, extinct: true)
      Result.create!(seed: 100000000, score: i*50, username: "ななしろこ#{i+1}号", playlog: "{}", remain_time: 5 - i*0.5, difficulty: 2, extinct: true)
      Result.create!(seed: 100000000, score: i*50, username: "ななしろこ#{i+1}号", playlog: "{}", remain_time: 5 - i*0.5, difficulty: 3, extinct: true)
    end
  end

end
