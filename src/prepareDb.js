"use strict";

export class PrepareDatabase {
  async createTablePatient(conn) {
    const result = await conn.schema.createTableIfNotExists("patient", function(
      table
    ) {
      table.increments();
      table.string("title");
      table.string("fullname");
      table.string("sex");
      table.date("date_of_birth");
    });

    return result;
  }
}
