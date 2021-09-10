<template>
  <q-td align="center" class="q-gutter-xs">
    <slot> </slot>
    <q-btn
      text-color="primary"
      icon="las la-pen-alt"
      round
      size="sm"
      @click="edit"
      :class="editBtnClass"
    >
      <q-tooltip content-class="bg-primary">
        Edit
      </q-tooltip>
    </q-btn>
    <q-btn
      text-color="negative"
      icon="las la-trash"
      round
      size="sm"
      @click="del"
      :class="deleteBtnClass"
    >
      <q-tooltip content-class="bg-negative">
        Delete
      </q-tooltip>
    </q-btn>
  </q-td>
</template>
<script>
export default {
  props: {
    id: {
      type: [String, Number],
      default: () => 0
    },
    name: {
      type: String,
      default: () => ""
    },
    deleteBtnClass: {
      type: String,
      default: () => ""
    },
    editBtnClass: {
      type: String,
      default: () => ""
    }
  },
  methods: {
    edit() {
      this.$emit("edit", this.id);
    },
    del() {
      let id = this.id;
      if (!id) return;
      this.$q
        .dialog({
          title: "Confirm",
          message: `Are you sure want to delete ${this.name} (id = ${id})?`,
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          this.$emit("delete", id);
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    }
  }
};
</script>
