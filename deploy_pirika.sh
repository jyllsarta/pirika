echo "cd pirika"
cd ~/pirika
echo "git pull"
git pull
echo "bundle install"
bundle install
echo "migrate"
RAILS_ENV=production rails db:migrate
echo "precompiling asset"
RAILS_ENV=production rails assets:precompile

echo "kill older server(https)"
PID=`ps ax | grep '[p]uma' | awk '{ print $1 }'`
echo "older server is ${PID}"
kill ${PID}

echo "start server"
# for http start
RAILS_ENV=production bundle exec rails s -d
#SSL_ENABLED=y RAILS_ENV=production bundle exec pumactl start
