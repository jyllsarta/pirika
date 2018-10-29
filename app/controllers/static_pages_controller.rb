class StaticPagesController < ApplicationController
  def index
  end

  def contact
  end

  def illusts
    @image_count = image_paths("illust_all").length
  end

  def rakugaki
    @image_count = image_paths("rakugaki").length
  end

  def index
  end

  def neko
    render 'static_pages/neko', :layout => nil
  end

  def neko2
    render 'static_pages/neko2', :layout => nil
  end

  def snipon
    render 'static_pages/snipon', :layout => nil
  end

  def nekomanual
    render 'static_pages/nekomanual', :layout => nil
  end

  def sainokawara
  end

  def samusugi
    render 'static_pages/samusugi', :layout => nil
  end

  def touzoku
  end

  def twitter_webhook
  end

  def works
  end

private
  def image_paths(dirname)
    paths = Dir.glob("public/images/#{dirname}/*", base: Rails.root)
    paths.map{|x| x[(7..-1)]} #trim "public/"
  end
end