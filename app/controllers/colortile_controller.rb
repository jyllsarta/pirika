class ColortileController < ApplicationController

    # render index page
    def index
        # slim側と連携する必要あり
        @row = 25
        @column = 15
        render :index, layout: false
    end

    # returns new colortile board
    def new
        x = 25
        y = 15
        colors = 10
        pairs = 150
        seed = rand(1000)
        board = ColorTileLogic::Board.new(x, y, colors, pairs, seed)
        render json: board.to_json
    end
end
