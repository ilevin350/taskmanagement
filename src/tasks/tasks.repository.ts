import { Repository, EntityRepository } from "typeorm";
import { Task } from "./tasks.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";
import { Logger } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(taskFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const {status, search} = taskFilterDto;
    const query = this.createQueryBuilder('task');
    let tasks: Task[];

    // Here we use query builder to:
    // select * from tasks where task.userId = user.id
    // Note that the symbol :userId in the 1st param is a
    // placeholder for user.id referenced in the 2nd param
    query.where('task.userId = :userId22', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', {status})
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
    }

    tasks = await query.getMany();
    
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const {title, description} = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    // Delete user from task return object, but note
    // this will not delete it from the database.
    delete task.user;
    return task;
  }
}