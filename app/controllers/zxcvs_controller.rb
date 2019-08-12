class ZxcvsController < ApplicationController
  def index
  end
  def create
    result = ZxcvScore.create(parameter)
    render json: "{high_score: #{result.high_score?}}"
  end

  def parameter
    params.permit([:username, :speed_score, :score, :total_score])
  end
end
