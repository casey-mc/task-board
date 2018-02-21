import axios from 'axios';

class TaskApi {
  constructor() {
      this.url = "/taskList";
  }

  // static getTasks() {


  // }

  static postTask(newTask) {
      axios.post("/taskList", {
          task: newTask.task,
          time: newTask.time
        })
        .then((resp) => {
          console.log("Successfully added ", newTask);
          return resp.data.id;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
  }

  static deleteTask(id) {
    axios.delete("/taskList", {
      params : {
        id : id
      }
    })
    .then((resp) => console.log(resp))
    .catch((err) => console.log(err));
  }
  
}

export default TaskApi;