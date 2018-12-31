class ResultsController < ApplicationController
    def create
        render json: {result: false}
    end

    def index
        render json: {result: false, endpoint: "index"}
    end

    def show
        render json: {result: false, endpoint: "show"}
    end
end
