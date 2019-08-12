class ZxcvScore < ApplicationRecord
  def high_score?
    # スコア更新 = 「それ以上のスコアを持つレコードが自身以外に存在しない」
    ZxcvScore.where(username: self.username).where("total_score >= #{self.total_score}").count <= 1
  end
end
