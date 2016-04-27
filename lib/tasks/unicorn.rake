namespace :unicorn do
  ##
  # Tasks
  ##
  desc "Start unicorn for development env."
  task(:start) {
    config = Rails.root.join('config', 'unicorn.rb')
    sh "bundle exec unicorn_rails -c #{config} -E development -D"
  }

  desc "Stop unicorn"
  task(:stop) { unicorn_signal :QUIT }
  
  desc "Force stop unicorn"
  task(:stop_f) { unicorn_signal :INT }

  desc "Restart unicorn with USR2"
  task(:restart) {
    old_pid = unicorn_pid
    unicorn_signal :USR2
    unicorn_signal :QUIT, old_pid
  }

  desc "Increment number of worker processes"
  task(:increment) { unicorn_signal :TTIN }

  desc "Decrement number of worker processes"
  task(:decrement) { unicorn_signal :TTOU }

  desc "Unicorn pstree (depends on pstree command)"
  task(:pstree) do
    sh "pstree '#{unicorn_pid}'"
  end

  def unicorn_signal signal, pid = nil
    if pid
      Process.kill signal, pid
    else
      Process.kill signal, unicorn_pid
    end
  end

  def unicorn_pid
    begin
      File.read("/tmp/unicorn.pid").to_i
    rescue Errno::ENOENT
      raise "Unicorn doesn't seem to be running"
    end
  end
end
