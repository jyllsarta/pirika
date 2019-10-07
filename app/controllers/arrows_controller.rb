class ArrowsController < ApplicationController
  def index
  end

  def create
    result = ArrowScore.create(parameter)
    render json: {is_high_score: result.high_score?}.to_json
  end
  def high_score
    high_score = ArrowScore.high_score(params[:username])
    render json: {high_score: high_score}.to_json
  end
  def ranking
    ranking = ArrowScore.ranking(10)
    render json: {ranking: ranking}.to_json
  end

private
  def parameter
    params.permit([:username, :time_score, :remove_score, :score])
  end
end
