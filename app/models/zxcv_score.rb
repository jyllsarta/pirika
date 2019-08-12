class ZxcvScore < ApplicationRecord
  def high_score?
    # スコア更新 = 「それ以上のスコアを持つレコードが自身以外に存在しない」
    ZxcvScore.where(username: self.username).where("total_score >= #{self.total_score}").count <= 1
  end

  def self.high_score(username)
    ZxcvScore.where(username: username).order(total_score: :desc).first&.total_score || 0
  end
end
