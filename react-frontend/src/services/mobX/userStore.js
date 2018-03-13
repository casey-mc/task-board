import {observable, action} from 'mobx';
import axios from 'axios';

export class userStore {
     constructor() {
      this.Tasks = new Tasks();
      this.Habits = new Habits();
     }
}

class Tasks {
  @observable list = [];

  constructor() {
    this.loadItems();
    this.completedTasks = [];
  }

  @action
  loadItems() {
    axios.get('user/lists/tasks/')
    .then(action("loadSuccess", (res) => {
      console.log("Obtained data from server",res.data);
      this.list = res.data;
    }))
    .catch((err) => console.log(err));
  }

  @action
  addItem(item) {
    axios.post('/user/lists/tasks', item
    //  {
    //     task: item.task,
    //     time: item.time
    //     }
      )
        .then(action("addSuccess", (res) => {
        console.log("Successfully added ", item);
        item.id = res.data.id;
        this.list.push(item);
        }))
        .catch((err) => {
        console.log(err);
        });
  }

  @action
  deleteItem(item_id) {
    let index = this.list.findIndex((element) => {
      return element.id === item_id;
    })
    if (index !== undefined) {
      this.list.splice(index,1);
      axios.delete('/user/lists/tasks', {
        params : {
          id : item_id
        }
      })
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
    }
  }
}

class Habits {
  @observable list = [];
  constructor(){
    this.loadItems();
  }

  @action
  loadItems() {
    axios.get('user/lists/habits/')
    .then(action("loadSuccess", (res) => {
      console.log("Obtained data from server",res.data);
      this.list = res.data;
    }))
    .catch((err) => console.log(err));
  }

  @action
  addItem(item) {
    axios.post(`/user/lists/habits`, item)
        .then(action("addSuccess", (res) => {
          console.log("Successfully added ", item);
          item.id = res.data.id;
          this.list.push(item);
        }))
        .catch((err) => {
          console.log(err);
        });
  }

  @action
  deleteItem(item_id) {
    let index = this.list.findIndex((element) => {
      return element.id === item_id;
    })
    if (index !== undefined) {
      this.list.splice(index, 1);
      axios.delete(`/user/lists/tasks`, {
        params : {
          id : item_id
        }
      })
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
    }
  }
}

var myUserStore = new userStore();
export default myUserStore;