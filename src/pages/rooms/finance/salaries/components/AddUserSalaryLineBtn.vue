<template>
    <div>
        <q-btn v-bind="$attrs" @click="model=true"/>
        <q-dialog v-model="model">
            <q-card>
            <dialog-header title="Add default salary line"/>
            <q-card-section>
                 <q-input
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
                v-validate="'required|min_value:0'"
                :error="errors.has('value')"
                :error-message="errors.first('value')"
                label="Value"
                dense
                outlined
              />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Save" @click="save" color="primary" />
            </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
export default {
    name: 'AddUserSalaryLineBtn',
    props:{
        userId:{
            type: String,
            required: true
        },
        deduction: {
            type: Boolean,
            default: ()=> false
        }
    },
    data(){
        return {
            model: false,
            modelInput: this.line || {},
            saving: false
        }
    },
   
    watch:{
        line(val){
            this.modelInput = val;
        }
    },
    methods:{
        async save(){
            if(!await this.$validator.validateAll()){
                this.$toastr.error("Please correct all field")
                return;
            }
            if(this.saving) return;
            this.saving = true
            try {
                let obj = JSON.parse(JSON.stringify(this.modelInput))
                obj.userId = this.userId
                if(this.deduction){
                    obj.value *= -1;
                }
                let res = await this.$api.salaries.postDefaultLine(obj.userId, obj)
                this.$toastr.success('Record was added')
                this.$emit('added', res.data)                        
                this.model = false
            } catch (error) {
                this.$toastr.error(error)
            }
            this.saving = false
        }
    }
}
</script>