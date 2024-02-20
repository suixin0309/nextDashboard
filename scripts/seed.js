const { db } = require('@vercel/postgres');

async function createUsersTables(client) {
  // Create t_user table
  const createTUserTable = await client.sql`
      CREATE TABLE IF NOT EXISTS t_user (
        id BIGSERIAL PRIMARY KEY,
        login_name VARCHAR(255) NOT NULL,
        login_password VARCHAR(255) NOT NULL,
        nickname VARCHAR(255),
        avatar VARCHAR(255),
        remarks VARCHAR(255),
        create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
  console.log('Created t_user table');

  }

  // Create bill_rer
async function createBillRecordTable(client) {
  const createBillRecordTable = await client.sql`
      CREATE TABLE IF NOT EXISTS bill_record (
        id BIGSERIAL PRIMARY KEY,
        member_id BIGINT NOT NULL,
        pay_type SMALLINT,
        material_id BIGINT,
        bill_type SMALLINT,
        amount INT NOT NULL,
        user_id BIGINT NOT NULL,
        remarks TEXT,
        create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
  console.log('Created bill_record table');
}

async function createMaterialTable(client) {
  // Create material table
  const createMaterialTable = await client.sql`
      CREATE TABLE IF NOT EXISTS material (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INT,
        remarks VARCHAR(255),
        create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
  console.log('Created material table');
}

async function createTMemberTable(client) {

  // Create t_member table
  const createTMemberTable = await client.sql`
      CREATE TABLE IF NOT EXISTS t_member (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type SMALLINT,
        phone VARCHAR(255) NOT NULL,
        // amount INT NOT NULL,
        // projectList array NOT NULL,
        remarks VARCHAR(255),
        address VARCHAR(255),
        create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
  console.log('Created t_member table');
}
async function main() {
  const client = await db.connect();

  await createUsersTables(client);
  await createBillRecordTable(client);
  await createMaterialTable(client);
  await createTMemberTable(client);

  await client.end();
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err);
});