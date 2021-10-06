<template>
  <v-dialog :value="value" :max-width="800" persistent>
    <v-card class="pa-3">
      <div class="d-flex align-center justify-space-between pb-3">
        <v-card-title class="pt-0 pb-0 text-center">New Exam</v-card-title>
        <v-btn @click="close" icon>
          <v-icon color="error">mdi-close-circle</v-icon></v-btn
        >
      </div>
      <v-form
        ref="form"
        lazy-validation
        @submit.prevent="submit"
        v-model="valid"
      >
        <v-sheet width="600px" class="mx-auto">
          <v-select
            v-model="exam_type"
            :items="examTypes"
            :rules="[rules.required]"
            label="Type of Exam"
            required
            dense
          ></v-select>
          <v-sheet width="120px">
            <v-text-field
              type="number"
              v-model="duration"
              label="Duration"
              :rules="[rules.required, rules.positive, rules.maxDuration]"
              required
            >
              <template v-slot:append-outer>
                sec.
              </template>
            </v-text-field></v-sheet
          >
          <v-textarea
            v-model="description"
            label="Description"
            outlined
            dense
          ></v-textarea>
          <v-textarea v-model="notes" label="Notes" outlined dense></v-textarea>
          <div class="d-flex justify-space-between mb-5">
            <v-btn
              class="mr-4"
              type="submit"
              :disabled="!valid"
              color="primary"
            >
              Save
            </v-btn>
            <v-btn @click="close">
              Cancel
            </v-btn>
          </div>
        </v-sheet>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
//TODO::disable duration field when editing
import { examTypes } from "@/common/constants.js";
/*eslint-disable*/
export default {
  props: ["value"],
  data: () => ({
    valid: true,
    description: "",
    notes: "",
    exam_type: null,
    duration: 15,
    examTypes: examTypes,
    rules: {
      required: value => !!value || "This field is required",
      positive: value => value > 0 || "Invalid number",
      maxDuration: value => value <= 60 || `Maximum is 60`
    }
  }),

  methods: {
    submit() {
      this.validate();
      this.$nextTick(() => {
        console.log("isValid", this.valid);
        if (this.valid) {
          this.$emit("created", this.duration); //or updated
          this.close();
        }
      });
      // this.close();
    },
    close() {
      this.$emit("update:value", false);
      this.reset();
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
