<template>
  <div>
    <q-toolbar class="q-mb-sm">
      <slot name="title">
        <q-toolbar-title v-if="!searchOnly">
          {{ title }}
        </q-toolbar-title>
      </slot>
      <slot name="actions"></slot>
      <q-btn
        :disable="loadingModel"
        :class="addBtnClass"
        v-if="!searchOnly"
        :icon="addBtnIcon"
        flat
        round
        @click="add"
      />
      <q-btn
        :disable="loadingModel"
        icon="las la-sync"
        flat
        round
        @click="refresh"
      />
      <q-input
        :class="{ 'full-width': searchOnly }"
        v-model="filter"
        type="text"
        debounce="500"
        @input="search"
        clearable
        borderless
        placeholder="search..."
        autofocus
        :disable="loadingModel"
      >
        <template #after>
          <q-icon name="las la-search" />
        </template>
      </q-input>
    </q-toolbar>
    <!-- <q-table
      :loadingModel="loadingModel"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @request="fetch"
    > -->
    <q-table
      v-bind="$attrs"
      v-on="$listeners"
      ref="table"
      :filter="filter"
      flat
      dense
    >
      <template #body-cell-action="props">
        <td-action
          :id="props.row.id"
          :name="
            props.row.name ||
              props.row.code ||
              props.row.displayName ||
              props.row.userName
          "
          @edit="edit"
          @delete="del"
          :editBtnClass="editBtnClass"
          :deleteBtnClass="deleteBtnClass"
        />
      </template>

      <template v-for="(_, name) in $scopedSlots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </q-table>
  </div>
</template>
<script>
export default {
  name: "my-table",
  props: {
    title: {
      type: String,
      default: () => undefined
    },
    searchOnly: {
      type: Boolean,
      default: () => false
    },
    addBtnIcon: {
      type: String,
      default: () => "las la-plus"
    },
    addBtnClass: {
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
  data() {
    return {
      filter: undefined
    };
  },
  mounted() {
    // console.log("scopedSlots", this.$scopedSlots);
  },
  computed: {
    loadingModel() {
      return this.$attrs.loading || false;
    }
  },
  methods: {
    add() {
      this.$emit("add");
    },
    edit(id) {
      this.$emit("edit", id);
    },
    del(id) {
      if (!id) return;
      this.$emit("delete", id);
    },
    search(filter) {
      // this.$refs.table.requestServerInteraction({ filter: k });

      let pager = this.$refs.table.pagination || { page: 1, perPage: 10 };
      pager.filter = this.filter;
      console.log("asd", pager);
      this.fetch({ pagination: pager });
    },
    refresh() {
      let pager = this.$refs.table.pagination || { page: 1, perPage: 10 };
      pager.filter = this.filter;
      this.$emit("refresh", { pagination: pager });
      this.fetch({ pagination: pager });
    },
    fetch(props) {
      this.$emit("request", props);
    }
  }
};
</script>
