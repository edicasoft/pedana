<template>
  <v-dialog :value="value" :style="{ zIndex: 1000 }" fullscreen persistent>
    <v-card class="pa-3">
      <v-btn @click="close" icon class="d-block ml-auto">
        <v-icon color="error">mdi-close-circle</v-icon></v-btn
      >
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="patients"
            :options.sync="options"
            :server-items-length="totalPatients"
            :loading="loading"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      New Patient
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.title"
                              label="Title"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.fullname"
                              label="Full Name"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.sex"
                              label="Sex"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.date_of_birth"
                              label="Date Of Birth"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="cancel">
                        Cancel
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="save">
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5"
                      >Are you sure you want to delete this item?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
              <v-toolbar flat>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer> </v-spacer>
                Latest Exam Date
              </v-toolbar>
            </template>
            <!-- eslint-disable -->
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">
                Reset
              </v-btn>
            </template></v-data-table
          >
        </v-col>
        <v-col> </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import Vue from "vue";
/*eslint-disable*/
export default Vue.extend({
  props: ["value"],
  data() {
    return {
      totalPatients: 3,
      loading: false,
      dialog: false,
      dialogDelete: false,
      search: "",
      patients: [
        {
          id: 1,
          fullname: "Solange Di Rocca",
          title: "Ms",
          sex: "F",
          latest_exam: "2021-09-18T09:50:01",
          date_of_birth: "1989-09-18T09:50:01"
        },
        {
          id: 2,
          fullname: "John Dou",
          title: "Mr",
          sex: "M",
          latest_exam: "2021-09-18T09:50:01",
          date_of_birth: "1954-04-05T09:50:01"
        },
        {
          id: 3,
          fullname: "Jane Dou",
          title: "Ms",
          sex: "F",
          latest_exam: "2021-09-18T09:50:01",
          date_of_birth: "1993-01-11T09:50:01"
        }
      ],
      options: {},
      headers: [
        {
          text: "Patient",
          align: "start",
          value: "fullname"
        },
        { text: "Sex", value: "sex" },
        { text: "Latest Exam", value: "latest_exam" },
        { text: "", value: "actions", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      }
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true
    },
    dialog(val) {
      val || this.cancel();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },
  mounted() {
    this.getDataFromApi();
  },

  methods: {
    getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      // this.loading = true;
      // this.fakeApiCall().then(data => {
      //   this.patients = data.items;
      //   this.totalDesserts = data.total;
      //   this.loading = false;
      // });
    },
    close() {
      this.$emit("update:value", false);
    },
    editItem(item) {
      this.editedIndex = this.patients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.patients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.patients.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    cancel() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.patients[this.editedIndex], this.editedItem);
      } else {
        this.patients.push(this.editedItem);
      }
      this.cancel();
    }
  }
});
</script>
