require 'yaml'

class PirikaConsoleController < ApplicationController
  before_action :check_params
  def index
  end
  def update
    yaml = YAML.load_file("config/pirika_secrets.yml")
    call_api yaml["token"], yaml["signals"][params["data"]["action"]]
  end

private
  def call_api(token, signal_id)

    url = "https://api.nature.global/1/signals/#{signal_id}/send"
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    req = Net::HTTP::Post.new(uri.request_uri)
    req["Content-Type"] = "application/json"
    req["Authorization"] = "Bearer #{token}"
    req.body = ""
    res = http.request(req)
  end

  def check_params
    params.permit(:data)
  end
end
