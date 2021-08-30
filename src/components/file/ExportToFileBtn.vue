<template>
  <v-btn
    color="green"
    rounded
    small
    dark
    @click="exportToFile"
    :loading="isProcessing"
    :disabled="isProcessing"
  >
    <v-icon left>mdi-export</v-icon>
    EXPORT
  </v-btn>
</template>
<script>
const app = window.require("electron").remote;
const dialog = app.dialog;

const fs = window.require("fs");
export default {
  data() {
    return {
      isProcessing: false
    };
  },
  props: ["data"],
  methods: {
    exportToFile() {
      let content = ``;
      this.data.forEach((element, idx) => {
        content += element;
        if (idx < this.data.length - 1) content += `\n`;
      });
      const d = new Date();

      const datestring =
        d.getDate() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getFullYear() +
        "@" +
        d.getHours() +
        "_" +
        d.getMinutes();
      dialog
        .showSaveDialog({
          defaultPath: `${datestring}.txt`
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
