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
        board = ColorTileLogic::Board.new(25, 15, 6, 70, rand(1000000))
        render json: board.to_json
    end
end
