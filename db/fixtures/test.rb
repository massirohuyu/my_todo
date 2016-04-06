### user
User.seed([
  {
    id: 0,
    user_id: 'massiro',
    name: 'massiro'
  }
])

### task
Task.seed([
  {
    id: 0,
    name: 'test_task0',
    done: true,
    memo: 'faaawww'
  },
  {
    id: 1,
    name: 'test_task1',
    memo: 'faaawww'
  }
])

### task_list
TaskList.seed([
  {
    id: 0,
    name: 'test_task_list0',
    depth: 0,
    row_order: 0
  },
  {
    id: 1,
    name: 'test_task_list1',
    depth: 1,
    row_order: 1
  }
])

### associations
#### setting
user0 = User.find(0)
task0 = Task.find(0)
task1 = Task.find(1)
task_list0 = TaskList.find(0)
task_list1 = TaskList.find(1)

#### user.task_lists
user0.task_lists << task_list0
user0.task_lists << task_list1

### task_list.tasks
task_list0.tasks << task0
task_list1.tasks << task1

### task_list.children
task_list0.children << task_list1
