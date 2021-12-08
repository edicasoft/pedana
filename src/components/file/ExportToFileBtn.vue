<template>
  <v-menu bottom :offset-y="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        class="ml-3"
        color="primary darken-1"
        :loading="isLoading"
        :disabled="isLoading"
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
import { mapState, mapActions } from "vuex";
import { slugify, prepareDataToExport } from "@/common/helpers";
import { ipcRenderer } from "electron";

const fs = window.require("fs");
export default {
  data() {
    return {
      data: []
    };
  },
  computed: {
    ...mapState("patients", ["selectedPatient"]),
    ...mapState("pedana", ["isLoading"]),
    ...mapState("exams", ["selectedExams", "exams"])
  },
  methods: {
    ...mapActions("pedana", ["setIsLoading"]),
    exportPatient() {
      console.log("exportPatient", this.exams);
      if (!this.selectedPatient) return alert("Patient is not selected");
      if (!this.exams.length) return alert("No exams");

      const content = prepareDataToExport(this.selectedPatient, this.exams);
      this.exportToFile(
        JSON.stringify([content]),
        `${this.selectedPatient.fullname}-all-`
      );
    },
    exportSelectedExams() {
      if (!this.selectedPatient) return alert("Patient is not selected");
      if (!this.selectedExams.length) return alert("No exams selected");
      console.log("exportSelectedExams", this.selectedExams);

      const content = prepareDataToExport(
        this.selectedPatient,
        this.selectedExams
      );
      this.exportToFile(
        JSON.stringify([content]),
        `${this.selectedPatient.fullname}-selected-`
      );
    },
    onExportError(er) {
      console.log("exportAll:patients:error", er);
      this.setIsLoading(false);
      this.$nextTick(() => alert(er));
    },
    exportAll() {
      ipcRenderer.send("get:patients");
      this.setIsLoading(true);

      ipcRenderer.once("get:patients:error", (event, er) =>
        this.onExportError(er)
      );
      ipcRenderer.once("export:exams:error", (event, er) =>
        this.onExportError(er)
      );
      ipcRenderer.once("get:patients:result", (event, res) => {
        console.log("exportAll:patients:result", res);
        ipcRenderer.send("export:exams", res);
      });
      ipcRenderer.once("export:exams:result", (event, res) => {
        console.log("export:exams:result", res);
        this.exportToFile(JSON.stringify(res), `db-`);
      });

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

          fs.writeFile(res.filePath, content, err => {
            if (err) {
              alert("An error ocurred creating the file " + err.message);
            }
            this.setIsLoading(false);
            setTimeout(() => alert("Exported successfully!"), 500);
            //alert("The file has been succesfully saved");
          });
        })
        .catch(err => {
          this.setIsLoading(false);
          console.log(err);
        });
    }
  }
};
</script>
