<template>
  <v-card>
    <v-subheader v-if="patient">{{ patient.fullname }} exams</v-subheader>
    <v-data-table
      :headers="headers"
      height="calc(100vh - 150px)"
      :items="exams"
      :loading="loading"
      :hide-default-footer="true"
    >
      <!-- eslint-disable -->

      <!-- <template v-slot:body="body">
        <div :style="{ overflow: 'auto', height: 'calc(100vh - 125px)' }">
          {{ body }}
        </div>
      </template> -->
      <template v-slot:top v-if="isReady">
        <v-toolbar flat height="40">
          <v-btn @click="newExam" color="primary" dark small>
            <v-icon left>mdi-play </v-icon>
            New Exam
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.exam_type="{ item }">
        {{ examTypes.find(t => t.type === item.exam_type).text }}
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
  </v-card>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
import ExamsList from "@/components/exams/ExamsList.vue";
import { examTypes } from "@/common/constants.js";

/*eslint-disable*/
export default Vue.extend({
  props: ["value", "isReady", "patient"],
  components: {
    ExamsList
  },
  data() {
    return {
      loading: false,
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {},
      headers: [
        { text: "Date", value: "created_at" },
        {
          text: "Type",
          align: "start",
          value: "exam_type"
        },
        { text: "", value: "actions", sortable: false }
      ]
    };
  },
  computed: {
    examTypes: () => examTypes,
    ...mapState("exams", ["exams"])
  },
  watch: {
    dialog(val) {
      val || this.cancel();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },
  methods: {
    newExam() {
      this.$emit("newExam");
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
