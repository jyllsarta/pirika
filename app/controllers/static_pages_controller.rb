class StaticPagesController < ApplicationController
  def index
  end

  def contact
  end

  def illusts
    @image_filenames = image_filenames("illust_all")
  end

  def rakugaki
    @image_filenames= image_filenames("rakugaki")
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
    render 'static_pages/touzoku', :layout => nil
  end

  def twitter_webhook
  end

  def airryr_inrtoduction
  end

  def works
  end

  def games
  end

  private
  def image_filenames(dirname)
    paths = Dir.glob("public/images/#{dirname}/*", base: Rails.root)
    paths.map{|path| path.split("/")[-1]}
  end
end