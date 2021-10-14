<template>
  <q-page key="calendar">
    <page-header>
      <template #actions>
        <q-btn
          flat
          round
          icon="las la-tags"
          @click="showAppointmentTypes = true"
          text-color="secondary"
        >
          <q-tooltip content-class="bg-secondary">
            Manage appointment types
          </q-tooltip>
        </q-btn>

        <q-btn flat icon="las la-arrow-left" @click="$router.back()">
          <q-tooltip>
            Back
          </q-tooltip>
        </q-btn>
      </template>
    </page-header>
    <div class="row full-width">
      <div class="col-sm-12 col-md-9  q-pa-md">
        <full-calendar
          ref="fcalendar"
          default-view="dayGridMonth"
          :plugins="calendarPlugins"
          :weekends="true"
          v-bind="$attrs"
          v-on="$listeners"
          @dateClick="dayClick"
          @eventClick="eventClick"
          :events="getEvents"
          :customButtons="customButtons"
          :header="headerToolbar"
          :displayEventTime="false"
        />
      </div>
      <div class="gt-sm col-md-3 q-py-lg q-mt-xs"></div>
    </div>
    <appointment-type-dialog v-model="showAppointmentTypes" />
    <appointment-dialog
      :date.sync="date"
      v-model="showAppointments"
      @update="refetchEvents"
    />
  </q-page>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import AppointmentTypeDialog from "./components/AppointmentTypeDialog";
import AppointmentDialog from "./components/AppointmentDialog";
export default {
  name: "MyFullCalendar",
  components: {
    FullCalendar,
    AppointmentTypeDialog,
    AppointmentDialog
  },
  inheritAttrs: false,
  data() {
    return {
      calendarPlugins: [dayGridPlugin, interactionPlugin],
      showAppointmentTypes: false,
      showAppointments: false,
      date: new Date(),

      customButtons: {
        addApointment: {
          text: " + ",
          click: () => this.openAppointmentsDialog()
        }
      },
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "addApointment"
      }
    };
  },
  mounted() {
    // console.log('$listeners', this.$refs.fcalendar)
  },
  methods: {
    openAppointmentsDialog() {
      this.date = new Date();
      this.showAppointments = true;
    },
    eventClick(calEvent) {
      // var day = this.$util.formatDate(calEvent.event.start, 'YYYY-MM-DD');
      // console.log('eventClick', calEvent)
      // // console.log('day', day);
      //   this.openAppointmentModal(calEvent.event.start);
      this.date = calEvent.event.start;
      this.showAppointments = true;
    },
    dayClick(day) {
      //   this.openAppointmentModal(day.date);
      this.date = day.date;
      this.showAppointments = true;
    },
    refetchEvents() {
      let cal = this.$refs.fcalendar;
      cal.getApi().refetchEvents();
    },
    async getEvents(info, successFn, failFn) {
      try {
        const res = await this.$api.appointments.calendarEvents(info);
        successFn(res.data);
      } catch (e) {
        throw e;
        // this.$toastr.error(e.message);
        failFn(e);
      }
    }
  }
};
</script>

<style lang="styl">
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
</style>

<style>
a.fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end[style*="border-color:red"] {
  border-width: 3px;
  border-radius: 25px;
  text-align: center;
}
</style>
