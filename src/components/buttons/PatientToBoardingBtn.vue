<template>
    <q-btn v-bind="$attrs" icon="las la-bed"  @click="click" :loading="loading">
        <slot></slot>
        <q-tooltip content-class="bg-accent">
            Add patient to boarding room
        </q-tooltip>
    </q-btn>
</template>
<script>
export default {
    name:'PatientToBoardingBtn',
    props:{
        patientId:{
            type:Number,
            required:true
        }
    },
    data(){
        return {
            loading: false,
        }
    },
    methods:{
        async click(){  
            if(!await this.confirm(`Do you want to add this patient to boarding room (or in-patient)?`)) return;
            if(!this.patientId) return;
            if(this.loading) return;
            this.loading = true;
            try {
                await this.$api.onSites.postBoarding(this.patientId)
                this.$toastr.success('Patient was added to boarding room')
                this.countBoarding()
            } catch (error) {
                this.$toastr.error(error)
            }
            this.loading = false;
        }
    }
}
</script>