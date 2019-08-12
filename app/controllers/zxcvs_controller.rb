class ZxcvsController < ApplicationController
  def index
  end
  def create
    result = ZxcvScore.create(parameter)
    render json: {is_high_score: result.high_score?}.to_json
  end
  def high_score
    high_score = ZxcvScore.high_score(params[:username])
    render json: {high_score: high_score}.to_json
  end

private
  def parameter
    params.permit([:username, :speed_score, :score, :total_score])
  end
end
