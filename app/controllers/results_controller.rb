class ResultsController < ApplicationController
  def create
    seed = params[:playlog][:seed].to_i
    clicklogs = params[:playlog][:messages] ? params[:playlog][:messages][:click] : {}
    w = params[:playlog][:w].to_i
    h = params[:playlog][:h].to_i
    colors = params[:playlog][:colors].to_i
    pairs = params[:playlog][:pairs].to_i
    difficulty = params[:difficulty].to_i
    remain_time = params[:remain_time].to_f.round(3)
    username = params[:username]
    sim = ColorTileLogic::ColorTileSimulator.new(seed, clicklogs, w, h, colors, pairs, difficulty)
    score = sim.score
    extinct = sim.extinct?

    is_high_score = Result.high_score?(username, difficulty, score)
    is_best_time = extinct && Result.best_time?(username, difficulty, remain_time)

    Result.create!(
      seed: seed,
      score: score,
      username: username,
      playlog: clicklogs.try(:permit!).try(:to_h) || {},
      difficulty: difficulty,
      remain_time: remain_time,
      extinct: extinct
    )
    render json: {score: score, is_high_score: is_high_score, is_best_time: is_best_time, time: remain_time, extinct: extinct}
  end

  def highscore
    username = params[:username]
    scores = Result.high_scores(username)
    render json: scores
  end

  def index
    render json: {result: false, endpoint: "index"}
  end

  def show
    render json: {result: false, endpoint: "show"}
  end
end
