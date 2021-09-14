export default function() {
  return {
    loaded: false,
    loading: false,
    miniLeft: true,
    selectedRoom: {},
    rooms: [
      {
        id: "fd",
        room: true,
        icon: "las la-user-astronaut",
        class: "text-primary bg-white",
        style: "border-left:5px solid var(--q-color-primary)",
        label: "Front Desk",
        description: "Client, Queue, Sales and Purchase management"
      },
      {
        id: "r1",
        room: true,
        icon: "las la-user-nurse",
        class: "text-accent bg-white",
        style: "border-left:5px solid  var(--q-color-accent)",
        label: "Exam Room 1",
        description: "Patient examination, treatment / surgery "
      },
      {
        id: "r2",
        room: true,
        icon: "las la-user-nurse",
        class: "text-accent bg-white",
        style: "border-left:5px solid  var(--q-color-accent)",
        label: "Exam Room 2",
        description: "Patient examination, treatment / surgery "
      },
      {
        id: "general",
        room: false,
        icon: "las la-smile",
        class: "text-secondary bg-white",
        style: "border-left:5px solid  var(--q-color-secondary)",
        label: "General",
        description: ""
      }
    ],
    hubRoom: {},
    inPatientCount: 0,
  };
}
