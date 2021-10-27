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
            :item-class="rowClass"
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
            <!-- NEW PATIENT -->
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
                  <v-form
                    ref="form"
                    lazy-validation
                    @submit.prevent="submit"
                    v-model="valid"
                  >
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="4">
                              <v-text-field
                                v-model="editedItem.title"
                                label="Title"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="8">
                              <v-text-field
                                v-model="editedItem.fullname"
                                :rules="[rules.required]"
                                required
                                label="Full Name"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="5">
                              <v-radio-group
                                v-model="editedItem.sex"
                                row
                                mandatory
                              >
                                <template v-slot:label>
                                  <div>
                                    Sex
                                  </div>
                                </template>
                                <v-radio label="F" value="F"></v-radio>
                                <v-radio label="M" value="M"></v-radio>
                              </v-radio-group>
                            </v-col>
                            <v-col cols="7">
                              <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editedItem.date_of_birth"
                                    label="Date of Birth"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.date_of_birth"
                                  @change="saveBirthday"
                                  :active-picker="activePicker"
                                  :max="
                                    new Date(
                                      Date.now() -
                                        new Date().getTimezoneOffset() * 60000
                                    )
                                      .toISOString()
                                      .substr(0, 10)
                                  "
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="cancel">
                          Cancel
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          type="submit"
                          :disabled="!valid"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
                <!-- NEW PATIENT END-->

                <!-- DELETE PATIENT -->
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h7 mb-2"
                      >Are you sure you want to delete this
                      patient?</v-card-title
                    >
                    <v-card-subtitle>{{ editedItem.fullname }}</v-card-subtitle>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="closeDelete">Cancel</v-btn>
                      <v-btn color="primary" @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!--  DELETE PATIENT END -->
              </v-toolbar>
              <!-- SEARCH -->
              <v-toolbar flat>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
                <!-- END SEARCH -->
                <v-spacer> </v-spacer>
                <!-- FILTER BY EXAM DATE -->
                <v-menu
                  v-model="menuFilter"
                  ref="menuFilter"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      clearable
                      v-model="dateFilter"
                      label="Filter by Exam"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="dateFilter = null"
                      single-line
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateFilter"
                    @change="saveExamDateFilter"
                  ></v-date-picker>
                </v-menu>
                <!-- END FILTER BY EXAM DATE -->
              </v-toolbar>
              <!-- FILTER BY LETTER -->
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
            <!-- END FILTER BY LETTER -->

            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
                :disabled="loading"
              >
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)" :disabled="loading">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              No patients
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
import { ipcRenderer } from "electron";

/*eslint-disable*/
export default Vue.extend({
  props: ["value", "isReady"],
  components: {
    ExamsList
  },
  data() {
    return {
      rules: {
        required: value => !!value || "This field is required"
      },
      valid: true,
      totalPatients: 3,
      loading: false,
      dialog: false,
      dialogDelete: false,
      search: "",
      selected: [],
      patients: [
        // {
        //   id: 1,
        //   fullname: "Solange Di Rocca",
        //   title: "Ms",
        //   sex: "F",
        //   latest_exam: "2021-09-18T09:50:01",
        //   date_of_birth: "1989-09-18"
        // },
        // {
        //   id: 2,
        //   fullname: "John Dou",
        //   title: "Mr",
        //   sex: "M",
        //   latest_exam: "2021-09-18T09:50:01",
        //   date_of_birth: "1954-04-05"
        // },
        // {
        //   id: 3,
        //   fullname: "Jane Dou",
        //   title: "Ms",
        //   sex: "F",
        //   latest_exam: "2021-09-18T09:50:01",
        //   date_of_birth: "1993-01-11"
        // }
      ],
      options: {},
      headers: [
        {
          text: "Patient",
          align: "start",
          value: "fullname",
          sortable: false
        },
        { text: "Sex", value: "sex", sortable: false },
        { text: "Latest Exam", value: "latest_exam", sortable: false },
        { text: "", value: "actions", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {},
      menu: false,
      activePicker: null,
      dateFilter: null,
      menuFilter: false
    };
  },
  mounted() {
    if (this.selectedPatient) this.selected.push(this.selectedPatient);
    //this.getDataFromApi();
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
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
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
    saveBirthday(date) {
      this.$refs.menu.save(date);
    },
    saveExamDateFilter(date) {
      this.$refs.menuFilter.save(date);
      //TODO::filter by exam date
    },
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
      if (this.selected.length) {
        this.selectPatient(this.selected[0]);
      }
      this.$emit("newExam");
      this.close();
    },
    filterByLetter(letter) {
      console.log("filterByLetter", letter);
    },
    clearFilters() {},
    getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      this.loading = true;
      ipcRenderer.send("get:patients");
      ipcRenderer.once("get:patients:result", (event, result) => {
        console.log(result);
        this.loading = false;
        if (result) this.patients = result;
      });
      ipcRenderer.once("get:patients:error", (event, er) => {
        console.log(er);
        this.loading = false;
      });

      // this.fakeApiCall().then(data => {
      //   this.patients = data.items;
      //   this.totalDesserts = data.total;
      // });
    },
    close() {
      this.$emit("update:value", false);
    },
    editItem(item) {
      if (this.loading) return;
      this.editedIndex = this.patients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      if (this.loading) return;
      this.editedIndex = this.patients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.loading = true;
      ipcRenderer.send("delete:patient", this.editedItem.id);
      ipcRenderer.once("delete:patient:result", (event, result) => {
        console.log(result, this.editedItem);
        this.loading = false;
        if (
          result &&
          this.selected.length &&
          this.selected[0].id === this.editedItem.id
        ) {
          this.selectPatient(null);
          this.selected = [];
        }
        this.patients.splice(this.editedIndex, 1);
        this.closeDelete();
      });
      ipcRenderer.once("delete:patient:error", (event, er) => {
        console.log(er);
        this.loading = false;
        this.closeDelete();
      });
    },

    cancel() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
        this.$refs.form.reset();
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
      });
    },
    submit() {
      this.validate();
      this.$nextTick(() => {
        console.log("isValid", this.valid);
        if (this.valid) {
          this.save();
        }
      });
    },
    save() {
      if (this.editedIndex > -1) {
        console.log(this.editedItem);
        ipcRenderer.send("update:patient", {
          id: this.editedItem.id,
          data: {
            fullname: this.editedItem.fullname,
            sex: this.editedItem.sex,
            title: this.editedItem.title,
            date_of_birth: this.editedItem.date_of_birth
          }
        });
        ipcRenderer.once("update:patient:result", (event, result) => {
          console.log(result, this.editedItem);
          this.loading = false;
          if (result)
            this.$set(this.patients, this.editedIndex, this.editedItem);
          this.cancel();
        });
        ipcRenderer.once("update:patient:error", (event, er) => {
          console.log(er);
          this.loading = false;
          this.cancel();
        });
      } else {
        this.loading = true;
        ipcRenderer.send("create:patient", this.editedItem);
        ipcRenderer.once("create:patient:result", (event, id) => {
          console.log(id, this.editedItem);
          this.loading = false;
          if (id) {
            this.editedItem.id = id;
            this.patients.push(this.editedItem);
          }
          this.cancel();
        });
        ipcRenderer.once("create:patient:error", (event, er) => {
          console.log(er);
          this.loading = false;
          this.cancel();
        });
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    rowClass(item) {
      console.log(item);
      if (this.loading) return "is-disabled";
    }
  }
});
</script>
