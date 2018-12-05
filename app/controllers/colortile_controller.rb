class ColortileController < ApplicationController
    def index
        # slim側と連携する必要あり
        @row = 15
        @column = 10
        render :index, layout: false
    end
end
