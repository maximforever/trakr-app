desc 'start the server'

task :start do
  sh "heroku local -f Procfile.dev"
end

