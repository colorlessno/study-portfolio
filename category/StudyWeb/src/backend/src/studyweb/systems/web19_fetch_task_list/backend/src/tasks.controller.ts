import { Controller, Get } from "@nestjs/common";

@Controller("tasks")
export class TasksController {
  @Get()
  findAll() {
    return [
      { id: "1", title: "ReactからAPIを呼ぶ", done: true },
      { id: "2", title: "loading/error/successを表示する", done: false },
      { id: "3", title: "NetworkタブでGETを確認する", done: false },
    ];
  }
}
