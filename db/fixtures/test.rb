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
    depth: 0
  },
  {
    id: 1,
    name: 'test_task_list1',
    depth: 1
  },
  {
    id: 2,
    name: 'test_task_list2',
    depth: 1
  },
  {
    id: 3,
    name: 'test_task_list3',
    depth: 1
  },
  {
    id: 4,
    name: 'test_task_list4',
    depth: 1
  },
  {
    id: 5,
    name: 'test_task_list5',
    depth: 1
  },
  {
    id: 6,
    name: 'test_task_list6',
    depth: 1
  }
])

### associations
#### setting
user0 = User.find(0)
task0 = Task.find(0)
task1 = Task.find(1)
task_list0 = TaskList.find(0)
task_list1 = TaskList.find(1)
task_list2 = TaskList.find(2)
task_list3 = TaskList.find(3)
task_list4 = TaskList.find(4)
task_list5 = TaskList.find(5)
task_list6 = TaskList.find(6)

#### user.task_lists
user0.task_lists << task_list0
user0.task_lists << task_list1

### task_list.tasks
task_list0.tasks << task0
task_list1.tasks << task1

### task_list.children
task_list0.children << task_list1
task_list0.children << task_list2
task_list0.children << task_list3
task_list0.children << task_list4
task_list0.children << task_list5
task_list0.children << task_list6
