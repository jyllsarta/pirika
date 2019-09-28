class ArrowsController < ApplicationController
  def index
  end

  def create
    render json: {is_high_score: true}.to_json
  end
  def high_score
    render json: {high_score: 151}.to_json
  end
  def ranking
    render json: {ranking: []}.to_json
  end
end
