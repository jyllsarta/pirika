class ResultsController < ApplicationController
    def create
        pp params
        seed = params[:seed].to_i
        clicklogs = params[:playlog][:messages]
        w = params[:playlog][:w].to_i
        h = params[:playlog][:h].to_i
        colors = params[:playlog][:colors].to_i
        pairs = params[:playlog][:pairs].to_i
        sim = ColorTileLogic::ColorTileSimulator.new(seed, clicklogs, w, h, colors, pairs)
        pp sim.score
        render json: {score: sim.score}
    end

    def index
        render json: {result: false, endpoint: "index"}
    end

    def show
        render json: {result: false, endpoint: "show"}
    end
end
