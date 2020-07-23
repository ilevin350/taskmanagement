import { Task } from "../tasks.entity";

export class GetTasksResultsDto {
  success: boolean;
  message: string;
  stack: string;
  tasks: Task[];
}