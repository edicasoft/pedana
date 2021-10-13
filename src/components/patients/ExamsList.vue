<template>
  <v-card>
    <v-subheader v-if="patient">{{ patient.fullname }} exams</v-subheader>
    <v-data-table
      :headers="headers"
      height="calc(100vh - 150px)"
      :items="items"
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
    <!-- EXAM DIALOG-->
    <ExamDialog
      v-if="dialog"
      :value.sync="dialog"
      :exam="editedItem"
      @update="save"
    />

    <!-- DELETE  -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h7 mb-2"
          >Are you sure you want to delete this exam?</v-card-title
        >
        <v-card-subtitle v-if="editedItem.exam_type"
          >{{ examTypes.find(t => t.type === editedItem.exam_type).text }} -
          {{ editedItem.created_at }}</v-card-subtitle
        >

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDelete">Cancel</v-btn>
          <v-btn color="primary" @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  DELETE  END -->
  </v-card>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { examTypes } from "@/common/constants.js";
import ExamDialog from "@/components/exams/ExamDialog.vue";

/*eslint-disable*/
export default Vue.extend({
  props: ["value", "isReady", "patient"],
  components: {
    ExamDialog
  },
  data() {
    return {
      items: [],
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
    dialogDelete(val) {
      val || this.closeDelete();
    },
    exams: {
      handler(val) {
        this.items = val;
      },
      immediate: true
    }
  },
  methods: {
    newExam() {
      this.$emit("newExam");
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
      });
    },

    save(data) {
      console.log(data);
    }
  }
});
</script>
