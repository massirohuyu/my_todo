### user
User.seed([
  {
    id: 0,
    user_id: 'massiro',
    name: 'massiro'
  }
])

### user
Task.seed([
  {
    id: 0,
    name: 'test_task1',
    done: true,
    memo: 'faaawww'
  },
  {
    id: 1,
    name: 'test_task2',
    memo: 'faaawww'
  }
])

### task_list
TaskList.seed([
  {
    id: 0,
    name: 'test_task_list1',
    row_order: 0
  },
  {
    id: 1,
    name: 'test_task_list2',
    row_order: 1
  }
])