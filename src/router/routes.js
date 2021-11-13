const routes = [
  {
    path: "/",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/Login.vue") }]
  },
  {
    path: "/printSales/:id?",
    component: () => import("pages/rooms/frontdesk/sales/PrintSales.vue"),
    name: "printSales",
    props: true
  },
  {
    path: "/printDeposit/:id?",
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
            path: "dashboard",
            component: () => import("pages/rooms/Dashboard.vue"),
            meta: {
              title: "Dashboard"
            }
          },
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

          {
            path: "unpaid-receipts",
            component: () =>
              import("pages/rooms/frontdesk/extra/UnpaidReceipts.vue"),
            meta: {
              title: "Unpaid Receipts"
            }
          },

          {
            path: "untransferred-items",
            component: () =>
              import("pages/rooms/frontdesk/extra/UntransferredItems.vue"),
            meta: {
              title: "Untransferred Items"
            }
          },
          {
            path: "all-client-deposits",
            component: () =>
              import("pages/rooms/frontdesk/extra/AllClientDeposits.vue"),
            meta: {
              title: "All Client Deposits"
            }
          },
          // {
          //   path: "unpaid-items",
          //   component: () =>
          //     import("pages/rooms/frontdesk/extra/UnpaidItems.vue"),
          //   meta: {
          //     title: "Unpaid Items"
          //   },
          // },

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
          {
            path: "finance/reports",
            component: () => import("pages/rooms/finance/reports/Index.vue"),
            meta: {
              title: "Reports"
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
          {
            path: "utilities",
            component: () => import("pages/rooms/admin/Utility.vue"),
            meta: {
              title: "Database Management"
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
