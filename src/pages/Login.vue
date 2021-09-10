<template>
  <transition
    appear
    enter-active-class="animated fadeIn slower"
    leave-active-class="animated fadeOut slower"
  >
    <div
      class="window-height row items-center text-center justify-center col-6 col-sm-12"
    >
      <my-circular-progress v-if="initLoading" />
      <q-card
        v-else
        key="content"
        class="my-card col-4 col-xs-10"
        style="max-width:400px;"
      >
        <q-card-section class="ma-sm bg-white">
          <q-form class="q-gutter-md" @submit="onSubmit">
            <!-- <q-avatar size="5rem"> -->
            <!-- <img src="statics/app-logo-128x128.png" /> -->

            <!-- </q-avatar> -->
            <img src="icons/xpc_logo.png" />

            <q-item-label class="text-grey">
              Please login using your credential below
            </q-item-label>

            <validation-summary
              :value="$store.state.errors"
              @input="$store.commit('clearErrors')"
            />

            <q-input
              v-model="name"
              v-validate="'required'"
              filled
              label="Username *"
              name="username"
              hint=""
              :error="errors.has('username')"
              :error-message="errors.first('username')"
            />

            <q-input
              v-model="password"
              v-validate="'required'"
              filled
              type="password"
              label="Password *"
              name="password"
              :error="errors.has('password')"
              :error-message="errors.first('password')"
            />

            <div class="text-left" style="margin-top:0">
              <q-checkbox
                name="rememberMe"
                v-model="rememberMe"
                label="Remember Me"
              />
            </div>
            <div>
              <submit-button :is-loading="loading">
                Login
              </submit-button>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions vertical align="center" />
      </q-card>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      initLoading: false,
      loading: false,
      name: null,
      password: null,
      rememberMe: false,
      errorMessages: []
    };
  },
  computed: {},
  mounted() {
    if (!this.$store.state.app.loaded) {
      this.initLoad();
    }
  },
  methods: {
    async initLoad() {
      try {
        if (this.initLoading) return;
        this.initLoading = true;

        var res = await this.$api.auth.get();
        // var res = await new Promise(res => {
        //   setTimeout(() => {
        //     res({ code: 200, data: { userName: "admmin", email: "admmin" } });
        //   }, 5000);
        // });
        if (res.status < 300) {
          this.$store.commit("auth/login", res.data);
        } else {
          this.$toastr.warning(res.statusText);
        }
      } catch (e) {}
      this.initLoading = false;
      this.$store.commit("app/loaded");

      if (this.$store.getters["auth/loggedIn"]) {
        if (this.$store.state.returnTo) {
          this.$router.replace(this.$store.state.returnTo);
        } else {
          this.$router.replace("/app/rooms");
        }
      }
    },
    async onSubmit() {
      if (!(await this.$validator.validateAll())) {
        return;
      }
      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.$api.auth.login({
          username: this.name,
          password: this.password,
          rememberMe: this.rememberMe
        });
        this.$store.commit("auth/login", res.data);
        console.log("returnTo", this.$store.state.returnTo);
        if (this.$store.state.returnTo) {
          this.$router.replace(this.$store.state.returnTo);
        } else {
          this.$router.replace("/app/rooms");
        }
      } catch (e) {
        this.$toastr.error(e);
      }

      this.loading = false;
    }
  }
};
</script>

<style></style>
