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

    Result.create!(
      seed: seed,
      score: score,
      username: username,
      playlog: clicklogs.try(:permit!).try(:to_h) || {},
      difficulty: difficulty,
      remain_time: remain_time,
      extinct: extinct
    )
    render json: {score: score}
  end

  def highscore
    username = params[:username]
    scores = Result.where(username: username).order(score: "DESC")
    times = Result.where(username: username).order(remain_time: "DESC")

    # SQL 6本が重かったら一度に取得してうまいことフィルタリングする
    score_easy = scores.where(difficulty: 1).try(:first).try(:score)
    score_normal = scores.where(difficulty: 2).try(:first).try(:score)
    score_hard = scores.where(difficulty: 3).try(:first).try(:score)
    time_easy = times.where(difficulty: 1, extinct: true).try(:first).try(:remain_time)
    time_normal = times.where(difficulty: 2, extinct: true).try(:first).try(:remain_time)
    time_hard = times.where(difficulty: 3, extinct: true).try(:first).try(:remain_time)

    render json: {
      score_easy: score_easy,
      score_normal: score_normal,
      score_hard: score_hard,
      time_easy: time_easy,
      time_normal: time_normal,
      time_hard: time_hard
    }
  end

  def index
    render json: {result: false, endpoint: "index"}
  end

  def show
    render json: {result: false, endpoint: "show"}
  end
end
