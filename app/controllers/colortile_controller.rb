class ColortileController < ApplicationController

    # render index page
    def index
        # slim側と連携する必要あり
        @row = 20
        @column = 10
        render :index, layout: false
    end

    # returns new colortile board
    def new
        x = 20
        y = 10
        colors = 12
        pairs = 85
        seed = rand(1000)
        board = ColorTileLogic::Board.new(x, y, colors, pairs, seed)
        render json: board.to_json
    end
end
