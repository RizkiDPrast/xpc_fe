import {
  HubConnectionBuilder,
  HttpTransportType,
  HttpClient,
  DefaultHttpClient,
  LogLevel
} from "@microsoft/signalr";
import store from "src/store";

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ Vue, store }) => {
  Vue.prototype.$hub = new Hub();

  Vue.prototype.$hub.on("hubRoomReceived", (hubRoom, hubUsers) => {
    console.log("hubRoomReceived", hubRoom, hubUsers);
    store.commit("app/hubRoom", hubRoom, hubUsers);
  });

  Vue.prototype.$hub.on("roomSwitched", (to, hubroom) => {
    console.log("roomSwitched", to, hubroom);
    var rooms = store.state.app.rooms;
    var selected = rooms.find(x => x.id === to);
    if (selected) {
      store.commit("app/selectedRoom", selected);
      store.commit("app/hubRoom", hubroom);
    }
  });

  Vue.prototype.$hub.on('boardingCount', (count)=>{
     store.commit('app/inPatientCount', count || 0)
  })
};

class CustomHttpClient extends HttpClient {
  send(request) {
    request.headers = {
      ...request.headers,
      "X-Room": store.state.app.selectedRoom.id
    };
  }
}
class Hub {
  events = ["hubRoomReceived", "clientMoved", "roomSwitched", "boardingCount"];

  async init() {
    if (this.initializing) return;
    this.initializing = true;
    if (this.initialized) {
      console.log(`HubConnection has been initialized`);
      return;
    }

    this.connection = await new HubConnectionBuilder()
      // .withUrl("/roomHub", { httpClient: new CustomHttpClient() })
      // http://192.168.8.144:8182
      .withUrl("/roomHub?room=" + store.state.app.selectedRoom.id, {
        // "Foo: Bar" will not be sent with WebSockets or Server-Sent Events requests
        headers: { "X-Room": store.state.app.selectedRoom.id }
        // transport: HttpTransportType.LongPolling
      })
      .configureLogging(LogLevel.Information)
      .build();

    await this.connection.start();
    console.log("hub connected");

    this.events.forEach(event => {
      this.connection.on(event, (...params) =>
        this.handleEvent(event, ...params)
      );
    });

    this.initializing = false;
    this.initialized = true;
  }

  async moveClient(toRoom, onSiteId) {
    if (!this.initialized) {
      await this.init();
    }
    await this.connection.invoke("MoveClient", toRoom, onSiteId);
  }

  async switchRoom(toRoom) {
    if (!this.initialized) {
      await this.init();
    }
    await this.connection.invoke("SwitchRoom", toRoom);
  }

  async updateBoardingCount(val){
    if (!this.initialized) {
      await this.init();
    }
    await this.connection.invoke("UpdateBoardingCount", val);
  }

  // events
  on(event, handler) {
    this.catalog = this.catalog || {};
    if (!this.catalog[event]) {
      this.catalog[event] = [handler];
    } else {
      this.catalog[event].push(handler);
    }
  }

  handleEvent(event, ...params) {
    this.catalog = this.catalog || {};
    if (this.catalog[event]) {
      this.catalog[event].forEach(handler => {
        handler(...params);
      });
    }
  }
}
