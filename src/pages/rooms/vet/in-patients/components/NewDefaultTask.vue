<template>
  <q-dialog v-model="taskDialog">
    <q-card style="width:500px">
      <q-toolbar>
        <q-toolbar-title
          >Please set default tasks for each cell
        </q-toolbar-title>
      </q-toolbar>
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
        <q-input label="New task" v-model="task" dense outlined />
        <q-btn
          text-color="primary"
          class="q-ml-md"
          outline
          icon="las la-plus"
          @click="newTask"
        />
      </q-toolbar>
      <q-card-section>
        <q-item v-for="item in tasks" :key="item">
          <q-item-section avatar>
            <q-checkbox readonly :value="true" />
          </q-item-section>
          <q-item-section title>
            <q-item-label>
              {{ item }}
            </q-item-label>
          </q-item-section>
          <q-item-section top style="width:50px">
            <q-btn
              rounded
              size="sm"
              text-color="negative"
              flat
              icon="las la-trash"
              @click="tasks = tasks.filter(x => x !== item)"
            />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Continue" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: "NewDefaultTask",
  data() {
    return {
      tasks: ["Pagi", "Sore"],
      taskDialog: false,
      task: undefined,
      to: undefined
    };
  },
  methods: {
    newTask() {
      if (!this.task || !this.task.length) {
        return;
      }
      this.tasks.push(this.task);
      this.task = undefined;
    },
    checkDialog(resolve) {
      if (!this.taskDialog) {
        resolve(this.tasks);
      } else {
        this.to = setTimeout(() => this.checkDialog(resolve), 2000);
      }
    },
    async getDefaultTasks() {
      let self = this;
      return new Promise(resolve => {
        self.taskDialog = true;
        // hack waiting
        self.to = setTimeout(() => self.checkDialog(resolve), 2000);
      });
    }
  },
  destroyed() {
    clearTimeout(this.to);
  }
};
</script>
