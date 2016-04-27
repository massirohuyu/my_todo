# -*- coding: utf-8 -*-
rails_root = File.expand_path('./', ENV['RAILS_ROOT'])
rails_env = ENV['RAILS_ENV'] || "development"

worker_processes Integer(ENV["WEB_CONCURRENCY"] || 5)
timeout 15
preload_app true  # 更新時ダウンタイム無し

#listen "0.0.0.0:8080"
listen "/tmp/unicorn.sock"
pid "/tmp/unicorn.pid"

# ログの出力
stderr_path "#{rails_root}/log/#{rails_env}_unicorn_error.log"
stdout_path "#{rails_root}/log/#{rails_env}_unicorn.log"
