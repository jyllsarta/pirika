class ColortileController < ApplicationController

    # render index page
    def index
        # slim側と連携する必要あり
        @row = 16
        @column = 8
        render :index, layout: false
    end

    # returns new colortile board
    def new
        x = 16
        y = 8
        colors = 12
        pairs = 55
        seed = rand(1000)
        board = ColorTileLogic::Board.new(x, y, colors, pairs, seed)
        render json: board.to_json
    end
end
