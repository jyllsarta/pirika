class ColortileController < ApplicationController

    # render index page
    def index
        # slim側と連携する必要あり
        @row = 15
        @column = 10
        render :index, layout: false
        @seed = ColorTileLogic::SeededRandom.new
        ct = ColorTileLogic::Board.new(@row, @column, @seed)
    end

    # returns new colortile board
    def new
        board = ColorTileLogic::Board.new(15, 10, 123)
        render json: board.to_json
    end
end
