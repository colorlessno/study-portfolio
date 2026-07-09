import { Controller, Get } from "@nestjs/common";

let requestCount = 0;

@Controller("tasks")
export class TasksController {
  @Get()
  findAll() {
    requestCount += 1;
    return [
      { id: "1", title: "useQueryで取得する", done: true },
      { id: "2", title: `refetch確認 ${requestCount}`, done: false },
    ];
  }
}
