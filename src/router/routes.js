const routes = [
  {
    path: "/",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/Login.vue") }]
  },
  {
    path: "/printSales",
    component: () => import("pages/rooms/frontdesk/sales/PrintSales.vue"),
    name: "printSales",
    props: true
  },
  {
    path: "/printDeposit",
    component: () => import("pages/rooms/frontdesk/sales/printDeposit.vue"),
    name: "printDeposit",
    props: true
  },
  {
    path: "/room-select",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/RoomSelect.vue") }]
  },
  {
    path: "/app",
    component: () => import("layouts/RoomsLayout.vue"),
    children: [
      {
        path: "rooms",
        component: () => import("pages/rooms/Index.vue"),
        meta: {
          title: "Index"
        },
        children: [
          {
            path: "calendar",
            component: () => import("pages/rooms/Calendar.vue"),
            meta: {
              title: "Appointment management"
            }
          },
          {
            path: "on-sites",
            component: () => import("pages/rooms/frontdesk/OnSites.vue"),
            meta: {
              title: "Queue Management"
            }
          },
          {
            path: "clients",
            component: () => import("pages/rooms/frontdesk/Clients.vue"),
            meta: {
              title: "Client Management"
            }
          },
          {
            path: "client-pets/:id?",
            component: () => import("pages/rooms/frontdesk/ClientDetails.vue"),
            meta: {
              title: "Client Management"
            },
            props: true
          },
          {
            path: "patients",
            component: () => import("pages/rooms/frontdesk/Patients.vue"),
            meta: {
              title: "Client search by patient"
            }
          },
          {
            path: "sales",
            component: () => import("pages/rooms/frontdesk/sales/POS.vue"),
            meta: {
              title: "Sales"
            }
          },
          {
            path: "sales/client/:clientId",
            component: () => import("pages/rooms/frontdesk/sales/POS.vue"),
            props: true,
            meta: {
              title: "Sales"
            }
          },
          {
            path: "purchases",
            component: () =>
              import("pages/rooms/frontdesk/purchases/Purchases.vue"),
            meta: {
              title: "Purchases"
            }
          },
          {
            path: "purchases/:id",
            component: () =>
              import("pages/rooms/frontdesk/purchases/Purchase.vue"),
            meta: {
              title: "Purchase details"
            },
            props: true
          },
          {
            path: "stock-opname",
            component: () =>
              import("pages/rooms/frontdesk/warehouse/StockOpname.vue"),
            meta: {
              title: "Stock Opname"
            },
            props: false
          },

          //finance
          {
            path: "products",
            component: () => import("pages/rooms/finance/Products.vue"),
            meta: {
              title: "Product list"
            }
          },
          {
            path: "products/:id",
            component: () => import("pages/rooms/finance/Product.vue"),
            meta: {
              title: "Product management"
            },
            props: route => ({ id: Number(route.params.id) })
          },
          {
            path: "finance/commissions",
            component: () =>
              import("pages/rooms/finance/commissions/Commissions.vue"),
            meta: {
              title: "Employee's Commission Management"
            }
          },
          {
            path: "finance/salaries",
            component: () =>
              import("pages/rooms/finance/salaries/Salaries.vue"),
            meta: {
              title: "Employee's Salaries Management"
            }
          },

          //vet
          {
            path: "vet/clients",
            component: () => import("pages/rooms/vet/clients/Clients.vue"),
            meta: {
              title: "Client Management"
            }
          },
          {
            path: "vet/signalements/:id?/:patientId?",
            component: () =>
              import("pages/rooms/vet/clients/ClientDetails.vue"),
            meta: {
              title: "Client Management"
            },
            props: true
          },
          {
            path: "vet/in-patient-treatment-board/signalement/:id",
            component: () => import("pages/rooms/vet/in-patients/Details.vue"),
            meta: {
              title: "Form Rawat Inap"
            },
            props: true
          },
          {
            path: "vet/in-patients",
            component: () => import("pages/rooms/vet/in-patients/Index.vue"),
            meta: {
              title: "Boarding Room"
            },
            props: true
          },

          //admin
          {
            path: "users",
            component: () => import("pages/rooms/admin/Users.vue"),
            meta: {
              title: "User management"
            }
          },

          //
          {
            path: "form-cuti/:id?",
            component: () => import("pages/rooms/LeaveApplications"),
            meta: {
              title: "Daftar pengajuan cuti"
            },
            props: true
          }
        ] // /app/rooms
      },

      {
        path: "form-cuti/:action/:code",
        component: () => import("pages/EmailLoader"),
        props: true
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
