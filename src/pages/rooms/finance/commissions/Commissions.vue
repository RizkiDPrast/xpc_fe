<template>
  <q-page>
    <page-header>
      <template #actions>
        <lock-monthly-commission-btn
          icon="las la-lock"
          text-color="negative"
          flat
          rounded
          no-caps
        />

        <SelectUserBtn v-model="userDialog" :user.sync="user" />
      </template>
    </page-header>

    <template v-if="user && user.id">
      <q-toolbar>
        <user-avatar :value="user" size="lg" />
        <q-toolbar-title>
          {{ user.displayName || user.userName }}'s commission monthly report
          <q-item-label caption>
            {{ user.email }} / {{ user.phone }}
          </q-item-label>
        </q-toolbar-title>
        <UserCommissionConfigBtn :user="user" />
      </q-toolbar>
      <UserCommissions :user="user" />
    </template>
    <q-banner class="bg-grey-3" v-else>
      Please select employee to check for commissions
      <br />
      <div class="full-width text-center">
        <q-btn label="Select an employee" flat @click="userDialog = true" />
      </div>
    </q-banner>
  </q-page>
</template>

<script>
import UserCommissions from "./components/UserCommissions";
import UserCommissionConfigBtn from "./components/UserCommissionConfigBtn";
import SelectUserBtn from "./components/SelectUserBtn";
import LockMonthlyCommissionBtn from "../components/LockMonthlyCommissionBtn.vue";
export default {
  components: {
    SelectUserBtn,
    UserCommissions,
    UserCommissionConfigBtn,
    LockMonthlyCommissionBtn
  },
  data() {
    return {
      loading: false,
      userDialog: false,
      user: {}
    };
  },

  methods: {}
};
</script>
