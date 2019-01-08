class ResultsController < ApplicationController
    def create
        seed = params[:playlog][:seed].to_i
        clicklogs = params[:playlog][:messages] ? params[:playlog][:messages][:click] : {}
        w = params[:playlog][:w].to_i
        h = params[:playlog][:h].to_i
        colors = params[:playlog][:colors].to_i
        pairs = params[:playlog][:pairs].to_i
        sim = ColorTileLogic::ColorTileSimulator.new(seed, clicklogs, w, h, colors, pairs)
        score = sim.score
        render json: {score: score}
    end

    def index
        render json: {result: false, endpoint: "index"}
    end

    def show
        render json: {result: false, endpoint: "show"}
    end
end
