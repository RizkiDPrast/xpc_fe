<template>
  <q-page padding>
    <page-header />

    <q-card flat>
      <q-toolbar>
        <q-toolbar-title>
          <q-badge class="bg-primary" v-if="selected" :label="selected" />
        </q-toolbar-title>
        <q-input
          dense
          v-model="filter"
          borderless
          clearable
          autofocus
          placeholder="Search account..."
        >
          <template #prepend>
            <q-icon name="las la-search" />
          </template>
        </q-input>
      </q-toolbar>
      <q-card-section>
        <q-tree
          color="primary"
          :nodes="model"
          node-key="label"
          :filter="filter"
          :expanded.sync="expanded"
          :selected.sync="selected"
        >
          <template #default-header="props">
            <q-icon v-if="props.node.systemUsed" name="las la-lock" />
            <q-badge color="grey" :label="props.node.normalSign[0]" /> &nbsp;
            {{ props.node.label }}
            <q-btn
              color="primary"
              size="xs"
              icon="las la-pencil-alt"
              no-caps
              class="q-ml-md"
              flat
              round
              v-if="props.node.parentCode"
              @click="updateNode(props.node)"
            />
            <q-btn
              color="primary"
              size="xs"
              icon="las la-plus"
              no-caps
              flat
              round
              @click="addNode(props.node)"
            />

            <q-btn
              v-if="!props.node.children || !props.node.children.length"
              color="negative"
              size="xs"
              icon="las la-trash"
              no-caps
              flat
              round
              @click="deleteNode(props.node)"
            />
          </template>
        </q-tree>
      </q-card-section>
    </q-card>
    <q-dialog v-model="modalState" persisted v-show="node.code">
      <q-card v-if="node">
        <q-toolbar>
          <q-toolbar-title>
            <q-item>
              <q-item-label title>
                <span v-if="node.id">Update </span>
                <span v-else>Add new child node for </span>
              </q-item-label>

              <q-item-label caption v-if="node.id">
                {{ node.label }}
              </q-item-label>

              <q-item-label caption v-else>
                {{ node.parentCode }}
              </q-item-label>
            </q-item>
          </q-toolbar-title>
          <q-btn flat size="xs" icon="las la-times" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <label
            >Normal Sign : {{ node.isDebitType ? "Debit" : "Credit" }}</label
          >
          <q-input
            label="Code"
            dense
            outlined
            v-model="node.code"
            name="code"
            v-validate="'required|max:25'"
            :error="errors.has('code')"
            :error-message="errors.first('code')"
          />
          <q-input
            label="Name"
            dense
            outlined
            v-model="node.name"
            name="name"
            v-validate="'required|max:255'"
            :error="errors.has('name')"
            :error-message="errors.first('name')"
          />
          <q-checkbox
            label="Is Debit Type?"
            dense
            outlined
            v-model="node.isDebitType"
            name="isDebitType"
            v-validate="'required'"
            :error="errors.has('isDebitType')"
            :error-message="errors.first('isDebitType')"
          />
          <q-space />
          <br />
          <q-input
            v-if="node.id"
            label="Parent Code"
            dense
            outlined
            v-model="node.parentCode"
            name="name"
            v-validate="'required|max:25'"
            :error="errors.has('parentCode')"
            :error-message="errors.first('parentCode')"
          />
          <submit-button :isLoading="isSubmitting" @click="submit" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "AccountList",
  data() {
    return {
      selected: null,
      data: [],
      filter: "",
      expanded: [],
      node: {},
      modalState: false,
      isSubmitting: false
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    model() {
      if (!this.data || !this.data.length) return [];

      var root = this.data.filter(x => !x.parentCode);
      root = root.map(x => ({
        code: x.code,
        name: x.name,
        label: `${x.code} ${x.name}`,
        selectable: true,
        parentCode: x.parentCode,
        isDebitType: x.isDebitType,
        systemUsed: x.systemUsed,
        normalSign: x.normalSign,
        children: this.getChildren(x.code)
      }));
      return root;
    }
  },
  methods: {
    getChildren(code) {
      if (!this.data || !this.data.length) return [];
      return this.data
        .filter(x => x.parentCode === code)
        .map(x => ({
          code: x.code,
          name: x.name,
          label: `${x.code} ${x.name}`,
          icon: "las la-building",
          selectable: true,
          parentCode: x.parentCode,
          isDebitType: x.isDebitType,
          systemUsed: x.systemUsed,
          normalSign: x.normalSign,
          children: this.getChildren(x.code)
        }));
    },
    updateNode(node) {
      this.node = { ...node, id: node.code };
      this.modalState = true;
    },
    addNode(node) {
      this.node = { parentCode: node.code, isDebitType: false };
      this.modalState = true;
    },
    deleteNode(node) {
      this.confirmDelete(node);
    },
    async confirmDelete(node) {
      if (
        await this.confirm(`Are you sure want to delete node: ${node.label}?`)
      ) {
        await this.$api.gl.deleteAccount(node.code);
        this.$toastr.success("Account was deleted");
        this.data = this.data.filter(x => x.code !== node.code);
      }
    },
    async submit() {
      const valid = await this.$validator.validateAll();
      if (!valid) {
        this.$toastr.warn("Please fix all errors then resubmit");
        return;
      }

      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        const isEditing = this.node.id;
        const res = isEditing
          ? await this.$api.gl.putAccount(this.node)
          : await this.$api.gl.postAccount(this.node);
        if (isEditing) {
          this.data = this.data.map(x => {
            if (x.code !== this.node.code) return x;
            return { ...this.node };
          });
        } else {
          this.data.push(res.data);
        }
        this.node = {};
        this.$toastr.success("Account was submitted");
        this.modalState = false;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isSubmitting = false;
    },
    async fetchData() {
      try {
        const res = await this.$api.gl.getAccounts();
        this.data = res.data;
        const keys = this.model.map(x => x.label);
        this.expanded = keys;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
    }
  }
};
</script>
