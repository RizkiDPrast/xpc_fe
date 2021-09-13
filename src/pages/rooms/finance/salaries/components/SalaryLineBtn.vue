<template>
  <div>
    <q-btn v-bind="$attrs" @click="model = true" />
    <q-dialog v-model="model">
      <q-card>
        <dialog-header :title="title" class="bg-secondary text-white" />
        <q-card-section>      
          <q-input
            :readonly="modelInput.forCashAdvance"
            v-model="modelInput.description"
            name="description"
            v-validate="'required'"
            :error="errors.has('description')"
            :error-message="errors.first('description')"
            label="Description"
            autocomplete="off"
            dense
            outlined
          />
          <money-field
            v-model="modelInput.value"
            name="value"
            v-validate="{
              required:true,
              min_value:0,
              max_value: maxValue()
            }"
            :error="errors.has('value')"
            :error-message="errors.first('value')"
            label="Value"
            dense
            outlined
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :label="modelInput.id < 0 ? 'Update' : 'Add'"
            @click="save"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "SalaryLineBtn",
  props: {
    deduction:{
      type: Boolean,
      default: ()=> false
    },
    line: {
      type: Object,
      default: () => ({
        id: 0,
        description: undefined,
        value: undefined,
        forCashAdvance: false
      })
    },
    title: {
      type: String,
      default: () => "Salary lines"
    }
  },
  data() {
    return {
      model: false,
      modelInput: Object.assign({},this.line || {}, {value: this.line.value * (this.deduction ? -1 : 1) })
    };
  },
  computed:{
    
  },

  watch: {
    'line.id'(val) {
      if (!val) {
        this.modelInput = {};
        return;
      }
      this.modelInput = JSON.parse(JSON.stringify(this.line));
      if(this.deduction){
        this.modelInput.value *= -1;
      }
      console.log(this.modelInput);
    }
  },
  methods: {
    async save() {
      if (!(await this.$validator.validateAll())) {
        this.$toastr.error("Please correct all field");
        return;
      }
      this.$emit("save", this.modelInput);
      this.model = false;
    },
    maxValue(){
      if(!this.modelInput) return undefined;
      return this.modelInput.forCashAdvance ? this.modelInput.value : 1000000000
    },
  }
};
</script>
