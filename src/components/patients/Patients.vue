<template>
  <v-dialog :value="value" :style="{ zIndex: 1000 }" fullscreen persistent>
    <v-card class="pa-3">
      <v-btn @click="close" icon class="d-block ml-auto">
        <v-icon color="error">mdi-close-circle</v-icon></v-btn
      >
      <v-row>
        <v-col>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="patients"
            :options.sync="options"
            :server-items-length="totalPatients"
            :loading="loading"
            :single-select="true"
            show-select
          >
            <!-- eslint-disable -->
            <template v-slot:footer.prepend>
              <v-btn
                v-if="selected.length"
                @click="submitSelection"
                small
                color="primary"
                >Submit</v-btn
              >
              <v-btn
                v-if="selected.length"
                @click="cancelSelection"
                class="ml-2"
                small
                >Cancel</v-btn
              >
            </template>
            <template v-slot:top>
              <v-toolbar flat height="40">
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      small
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
                      >Are you sure you want to delete this
                      patient?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete"
                        >Cancel</v-btn
                      >
                      <v-btn color="blue darken-1" @click="deleteItemConfirm"
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
                <v-btn text small color="blue" class="text-capitalize">
                  <u>Filter by Exam</u></v-btn
                >
              </v-toolbar>
              <v-toolbar flat>
                <v-btn
                  @click="clearFilters"
                  small
                  color="blue"
                  text
                  class="text-capitalize"
                  >All</v-btn
                >
                <v-btn
                  small
                  class="pa-0"
                  text
                  :style="{ minWidth: '25px' }"
                  v-for="(letter, idx) in alphabet"
                  :key="idx"
                  @click="filterByLetter(letter)"
                  >{{ letter }}</v-btn
                >
              </v-toolbar>
            </template>
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
        <v-col>
          <ExamsList
            v-if="selected.length"
            @newExam="newExam"
            :patient="selected[0]"
            :isReady="isReady"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import ExamsList from "@/components/patients/ExamsList.vue";
/*eslint-disable*/
export default Vue.extend({
  props: ["value", "isReady"],
  components: {
    ExamsList
  },
  data() {
    return {
      totalPatients: 3,
      loading: false,
      dialog: false,
      dialogDelete: false,
      search: "",
      selected: [],
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
      editedItem: {}
    };
  },
  mounted() {
    if (this.selectedPatient) this.selected.push(this.selectedPatient);
    this.getDataFromApi();
  },
  computed: {
    ...mapState("patients", ["selectedPatient"]),
    alphabet() {
      const alpha = Array.from(Array(26)).map((e, i) => i + 65);
      return alpha.map(x => String.fromCharCode(x));
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Patient" : "Edit Patient";
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

  methods: {
    ...mapActions("patients", ["selectPatient"]),
    cancelSelection() {
      this.selected = [];
      this.selectPatient(null);
      this.close();
    },
    submitSelection() {
      if (this.selected.length) {
        this.selectPatient(this.selected[0]);
        this.close();
      }
    },
    newExam() {
      this.$emit("newExam");
    },
    filterByLetter(letter) {
      console.log("filterByLetter", letter);
    },
    clearFilters() {},
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
        this.editedItem = {};
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = {};
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
