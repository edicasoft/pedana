"use strict";

export class PrepareDatabase {
  async createTablePatient(knex) {
    const result = await knex.schema
      .createTable("patient", function(table) {
        table.increments();
        table.string("title");
        table.string("fullname");
        table.string("sex");
        table.date("date_of_birth");
      })
      .createTable("exam", function(table) {
        table.increments();
        table.string("exam_type");
        table.float("duration");
        table.text("description");
        table.text("notes");
        table.text("weights_data");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table
          .integer("patient_id")
          .unsigned()
          .notNullable();
        table
          .foreign("patient_id")
          .references("id")
          .inTable("patient")
          .onDelete("cascade");
      });

    return result;
  }
}
