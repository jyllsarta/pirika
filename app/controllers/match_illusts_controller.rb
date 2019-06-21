class MatchIllustsController < ApplicationController
  def index
    render '/match_illusts/index', :layout => nil
  end
end
