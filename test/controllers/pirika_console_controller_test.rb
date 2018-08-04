require 'test_helper'

class PirikaConsoleControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get pirika_console_index_url
    assert_response :success
  end

end
