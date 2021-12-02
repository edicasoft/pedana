<template>
  <v-menu bottom :offset-y="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        class="ml-3"
        color="primary darken-1"
        :loading="isProcessing"
        :disabled="isProcessing"
      >
        <v-icon left>mdi-export</v-icon>
        EXPORT
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        @click="exportSelectedExams"
        :disabled="!selectedPatient || !selectedExams.length"
      >
        <v-list-item-title
          >Current patient: <b>selected exams</b></v-list-item-title
        >
      </v-list-item>
      <v-list-item @click="exportPatient" :disabled="!selectedPatient">
        <v-list-item-title>Current patient: <b>all exams</b></v-list-item-title>
      </v-list-item>
      <v-list-item @click="exportAll">
        <v-list-item-title>Everything</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
const app = window.require("electron").remote;
const dialog = app.dialog;
import { mapState } from "vuex";
import { slugify } from "@/common/helpers";

const fs = window.require("fs");
export default {
  data() {
    return {
      isProcessing: false,
      data: []
    };
  },
  computed: {
    ...mapState("patients", ["selectedPatient"]),
    ...mapState("exams", ["selectedExams", "exams"])
  },
  methods: {
    exportPatient() {
      console.log("exportPatient", this.exams);
      if (!this.selectedPatient) return alert("Patient is not selected");
      if (!this.exams.length) return alert("No exams");
      /*eslint-disable*/
      const content = [
        {
          title: this.selectedPatient.title,
          fullname: this.selectedPatient.fullname,
          sex: this.selectedPatient.sex,
          date_of_birth: this.selectedPatient.date_of_birth,
          exams: this.exams.map(item => ({
            exam_type: item.exam_type,
            duration: item.duration,
            description: item.description,
            notes: item.notes,
            weights_data: item.weights_data,
            created_at: item.created_at
          }))
        }
      ];
      this.exportToFile(
        JSON.stringify(content),
        `${this.selectedPatient.fullname}-all-`
      );
    },
    exportSelectedExams() {
      if (!this.selectedPatient) return alert("Patient is not selected");
      if (!this.selectedExams.length) return alert("No exams selected");
      console.log("exportSelectedExams", this.selectedExams);

      const content = [
        {
          title: this.selectedPatient.title,
          fullname: this.selectedPatient.fullname,
          sex: this.selectedPatient.sex,
          date_of_birth: this.selectedPatient.date_of_birth,
          exams: this.selectedExams.map(item => ({
            exam_type: item.exam_type,
            duration: item.duration,
            description: item.description,
            notes: item.notes,
            weights_data: item.weights_data,
            created_at: item.created_at
          }))
        }
      ];
      this.exportToFile(
        JSON.stringify(content),
        `${this.selectedPatient.fullname}-selected-`
      );
    },
    exportAll() {
      console.log("exportAll");
    },
    exportToFile(content, fileNameStart) {
      console.log("exportToFile", fileNameStart);

      // this.data.forEach((element, idx) => {
      //   content += element;
      //   if (idx < this.data.length - 1) content += `\n`;
      // });
      const d = new Date();

      const datestring =
        d.getDate() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getFullYear() +
        "-" +
        d.getHours() +
        "_" +
        d.getMinutes();
      let fileName = `${datestring}`;
      if (fileNameStart) fileName = `${slugify(fileNameStart + fileName)}`;
      dialog
        .showSaveDialog({
          defaultPath: `${fileName}.json`
        })
        .then(res => {
          if (res.canceled || !res.filePath) {
            return;
          }
          this.isProcessing = true;

          fs.writeFile(res.filePath, content, err => {
            this.isProcessing = false;

            if (err) {
              alert("An error ocurred creating the file " + err.message);
            }

            alert("The file has been succesfully saved");
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
