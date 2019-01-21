class ResultsController < ApplicationController
    def create
        seed = params[:playlog][:seed].to_i
        clicklogs = params[:playlog][:messages] ? params[:playlog][:messages][:click] : {}
        w = params[:playlog][:w].to_i
        h = params[:playlog][:h].to_i
        colors = params[:playlog][:colors].to_i
        pairs = params[:playlog][:pairs].to_i
        sim = ColorTileLogic::ColorTileSimulator.new(seed, clicklogs, w, h, colors, pairs)
        username = params[:username]
        score = sim.score
        result = Result.create!(seed: seed, score: score, username: username, playlog: clicklogs.permit!.to_h)
        render json: {score: score}
    end

    def highscore
        username = params[:username]
        score = Result.where(username: username).order(score: "DESC")
        render json: {result: false, reason: "no such user"} and return if score.empty?
        render json: {score: score.first.score}
    end

    def index
        render json: {result: false, endpoint: "index"}
    end

    def show
        render json: {result: false, endpoint: "show"}
    end
end
