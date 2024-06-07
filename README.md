# odin-todo

My code is not looking great, even that is understatement. It is terrible, awful, bad, or any other word that can describe disgutingness.

First of all, I'm more focused on how it looks before actually create a working functionality. I hate how I only concerned of how everything looks rather than how it would perform.

Before starting again, I promise, I will make a functioning program with console and browser prompt alone.

Here's the plan:

1. Project job is to create, edit, and delete itself. Project instances will be stored on the class static field. The only unuiqe thing each instance has are name and tasks array.

2. Task's job will be to create, edit, delete itself, just like project with addition to push itself to projectInstance.task. Each instance will have index property that point to index on the projectinstance.task. Each time task is removed or created, index property will be changed accordingly. Another instace property are title, desc, dueDate, priority.

### Project class :

#### Property:

- name
- task array
- static projectList

#### Method:

- create through constructor
- edit name
- remove from projectList

### Task class:

#### Property:

- title
- desc
- dueDate
- priority
- id (generated with method)

#### Method:

- create (constucror)
- edit all property except id
- generate id
- remove itself
