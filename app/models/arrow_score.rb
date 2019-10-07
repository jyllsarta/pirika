class ArrowScore < ApplicationRecord
  def high_score?
    # スコア更新 = 「それ以上のスコアを持つレコードが自身以外に存在しない」
    ArrowScore.where(username: self.username).where("score >= #{self.score}").count <= 1
  end

  def self.high_score(username)
    ArrowScore.where(username: username).order(score: :desc).first&.score || 0
  end

  def self.ranking(limit)
    ranking = []
    # order by group by なので多少ダサいが愚直に全件取得からのしちゃう
    ArrowScore.order(score: :desc).each do |score|
      # ユーザ名空はランキング登録しないことにした
      ranking.append(score) if ranking.all?{|rank| rank.username != score.username} && !score.username.blank?
      break if ranking.length == limit
    end
    ranking
    end
end