<template>
  <v-btn color="secondary" small @click="importFile">
    <v-icon left>mdi-import</v-icon>
    Import from file
  </v-btn>
</template>
<script>
const app = window.require("electron").remote;
const dialog = app.dialog;

const fs = window.require("fs");
export default {
  data() {
    return {};
  },
  methods: {
    importFile() {
      dialog
        .showOpenDialog({
          properties: ["openFile"]
        })
        .then(result => {
          console.log(result.canceled);
          console.log(result.filePaths);
          fs.readFile(result.filePaths[0], "utf-8", (err, data) => {
            if (err) {
              alert("An error ocurred reading the file :" + err.message);
              return;
            }
            const res = data
              .toString()
              .split(/[\r\n]+/)
              .map(item => item.split(", "));
            this.$emit("inportedData", res);
            console.log(res);
          });
        })
        .catch(err => {
          console.log(err);
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
