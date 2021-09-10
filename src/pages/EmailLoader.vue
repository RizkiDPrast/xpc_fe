<template>
  <q-page class="flex flex-center">
    <my-circular-progress v-if="loading" />
    <div v-else>
      Please wait you will be redirected
    </div>
  </q-page>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      id: undefined
    };
  },
  mounted() {
    this.post();
  },
  methods: {
    async post() {
      if (this.loading) return;
      this.loading = true;
      try {
        let res;
        switch (this.action) {
          case "forward":
            res = await this.$api.formCuti.postForward(this.code);
            this.id = res.data;
            this.$toastr.success("Leave application was forwarded");
            break;
          case "accept":
            res = await this.$api.formCuti.postAccept(this.code);
            this.id = res.data;
            this.$toastr.success("Leave application was accepted");
            break;
          case "reject":
            res = await this.$api.formCuti.postReject(this.code);
            this.id = res.data;
            this.$toastr.success("Leave application was rejected");
            break;

          default:
            break;
        }
        if (!res) {
          throw "Invalid params. Please contact admin";
        }
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
      if (this.id) {
        this.$router.replace(`/app/rooms/form-cuti/${this.id}`);
      } else {
        this.$toastr.error("Please login with the correct account");
        this.$router.replace(`/app/rooms/form-cuti`);
      }
    }
  }
};
</script>
