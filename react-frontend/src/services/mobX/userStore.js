import {observable, action, computed} from 'mobx';
import axios from 'axios';

export class userStore {
     constructor() {
      this.Tasks = new Tasks();
      this.Habits = new Habits();
      this.Inventory = new Inventory();
     }
}

class Tasks {
  @observable list = [];
  @observable currentTask = {};
  @observable completedTasks = [];

  constructor() {
    this.loadItems();
  }

  newCurrentTask() {
    this.currentTask = this.list[Math.floor(Math.random() * this.list.length)]
  }

  @action
  completedTask(elapsed) {
    let id = this.currentTask.id;
    this.completedTasks.push({id : elapsed});
    console.log(`Completed Tasks: ${this.completedTasks}`);
  }

  @action
  loadItems() {
    axios.get('/lists/tasks/')
    .then(action("loadSuccess", (res) => {
      console.log("Obtained tasks from server",res.data);
      this.list.replace(res.data);
    }))
    .catch((err) => console.log(err));
  }

  @action
  addItem(item) {
    axios.post('/lists/tasks', item
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
      axios.delete('/lists/tasks', {
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
    axios.get('/lists/habits/')
    .then(action("loadSuccess", (res) => {
      console.log("Obtained habits from server",res.data);
      this.list = res.data;
    }))
    .catch((err) => console.log(err));
  }

  @action
  addItem(item) {
    axios.post(`/lists/habits`, item)
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
      axios.delete(`/lists/tasks`, {
        params : {
          id : item_id
        }
      })
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
    }
  }

  @computed get associatedItems() {
    return this.list.map((value, index) => {
      userStore.Inventory.list.find(element => {
        return element.id === value.id;
      })
    })
  }

  @action
  associateItem(habitID, itemID) {
    console.log("associating habit ", habitID, "with ", itemID);
    console.log(this.list);
    let habit = this.list.find( (value, index) => {
      return value.id === habitID;
    });
    if (habit !== undefined) {
      habit.item_id = itemID;
    }
    console.log(this.list);
  }
}

class Inventory {
  @observable list = [];
  constructor(){
    this.loadItems();
  }

  @action
  loadItems() {
    axios.get('/items')
    .then(action("loadSuccess", (res) => {
      console.log("Obtained inventory from server",res.data);
      this.list = res.data;
    }))
    .catch((err) => console.log(err));
  }

  @action
  addItem(item) {
    axios.post('/items', item)
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
      axios.delete('/items', {
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