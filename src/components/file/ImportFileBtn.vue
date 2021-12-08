<template>
  <v-btn
    color="primary darken-1"
    @click="importFile"
    :loading="isLoading"
    :disabled="isLoading"
  >
    <v-icon left>mdi-import</v-icon>
    IMPORT
  </v-btn>
</template>
<script>
const app = window.require("electron").remote;
const dialog = app.dialog;
import { ipcRenderer } from "electron";
import { mapState, mapActions } from "vuex";
const fs = window.require("fs");
export default {
  computed: {
    ...mapState("pedana", ["isLoading"])
  },
  methods: {
    ...mapActions("pedana", ["setIsLoading"]),
    ...mapActions("patients", ["selectPatient"]),
    ...mapActions("exams", ["setSelectedExams"]),

    importFile() {
      dialog
        .showOpenDialog({
          properties: ["openFile"]
        })
        .then(result => {
          // console.log(result.canceled);
          // console.log(result.filePaths);
          if (
            result.canceled ||
            (!result.filePaths.length && !result.filePaths[0])
          ) {
            return;
          }
          this.setIsLoading(true);

          fs.readFile(result.filePaths[0], "utf-8", (err, data) => {
            if (err) {
              alert("An error ocurred reading the file :" + err.message);
              return;
            }
            const res = JSON.parse(data);
            ipcRenderer.send("import:exams", res);

            ipcRenderer.once("import:exams:error", (event, er) => {
              console.log("import:exams:error", er);
              this.setIsLoading(false);
              alert(er);
            });

            ipcRenderer.once("import:exams:result", (event, res) => {
              console.log("import:exams:result", res);
              console.log(res);
              this.setIsLoading(false);
              setTimeout(
                () =>
                  alert(
                    `Imported successfuly! \n Patients created: ${res.createdPatients} \n Exams created: ${res.createdExams} \n `
                  ),
                300
              );
              this.selectPatient(null);
              this.setSelectedExams([]);
              this.$emit("imported");
            });

            // const res = data
            //   .toString()
            //   .split(/[\r\n]+/)
            //   .map(item => {
            //     const arr = item.split(",");
            //     return arr.map(el => parseFloat(el));
            //   });
            /*eslint-disable*/
            // this.$emit("importData", { weights_data: res });

            // console.log(res);
          });
        })
        .catch(err => {
          console.log(err);
          this.setIsLoading(false);
        });
      // dialog.showOpenDialog(fileNames => {
      //   console.log(fileNames);
      //   // fileNames is an array that contains all the selected
      //   if (fileNames === undefined) {
      //     console.log("No file selected");
      //     return;
      //   }
      //   //  let data = fs.readFileSync(filename, 'utf8').split('\n')

      //   fs.readFile(filepath, "utf-8", (err, data) => {
      //     if (err) {
      //       alert("An error ocurred reading the file :" + err.message);
      //       return;
      //     }

      //     // Change how to handle the file content
      //     console.log("The file content is : " + data);
      //   });
      // });
    }
  }
};
</script>
