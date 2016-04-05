class TaskListsController < ApplicationController
  before_action :set_task_list, only: [:show, :update, :destroy]

  # GET /task_lists
  # GET /task_lists.json
  def index
    @task_list = TaskList.all

    render json: @task_list
  end

  def show
    @task_list = TaskList.find(params[:id])
    render json: @task_list
  end

  # POST /task_lists
  # POST /task_lists.json
  def create
    @task_list = TaskList.new(task_list_params)

    if @task_list.save
      render json: @task_list, status: :created, location: @task_list
    else
      render json: @task_list.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /task_lists/1
  # PATCH/PUT /task_lists/1.json
  def update
    @task_list = TaskList.find(params[:id])

    if @task_list.update(task_list_params)
      head :no_content
    else
      render json: @task_list.errors, status: :unprocessable_entity
    end
  end

  # DELETE /task_lists/1
  # DELETE /task_lists/1.json
  def destroy
    @task_list.destroy

    head :no_content
  end

  private

    def set_task_list
      @task = TaskList.find(params[:id])
    end

    def task_list_params
      params.require(:task_list).permit(:name, :row_order)
    end
  
end
