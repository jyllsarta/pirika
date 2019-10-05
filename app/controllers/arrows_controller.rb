class ArrowsController < ApplicationController
  def index
  end

  def create
    result = ArrowScore.create(parameter)
    render json: {is_high_score: result.high_score?}.to_json
  end
  def high_score
    render json: {high_score: 151}.to_json
  end
  def ranking
    render json: {ranking: []}.to_json
  end

private
  def parameter
    params.permit([:username, :time_score, :remove_score, :score])
  end
end
