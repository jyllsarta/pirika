class ZxcvScore < ApplicationRecord
  def high_score?
    # スコア更新 = 「それ以上のスコアを持つレコードが自身以外に存在しない」
    ZxcvScore.where(username: self.username).where("total_score >= #{self.total_score}").count <= 1
  end

  def self.high_score(username)
    ZxcvScore.where(username: username).order(total_score: :desc).first&.total_score || 0
  end

  def self.ranking(limit)
    ranking = []
    # order by group by なので多少ダサいが愚直に全件取得からのしちゃう
    ZxcvScore.order(total_score: :desc).each do |score|
      ranking.append(score) if ranking.all?{|rank| rank.username != score.username}
      break if ranking.length == limit
    end
    ranking
    end
end
