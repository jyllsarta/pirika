Rails.application.config.content_security_policy do |policy|
  if Rails.env.development?
    policy.script_src :self, :https, :unsafe_eval
  else
    # jyllsarta.net は http なので、これがonだとvueが読めなくなる
    #policy.script_src :self, :https
  end
end