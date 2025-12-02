/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("users", {
      user_id: { type: "serial", primaryKey: true },
      username: { type: "varchar(50)", unique: true, notNull: true },
      email: { type: "varchar(50)", unique: true, notNull: true },
      password_hash: { type: "text", notNull: true },
      profile_picture: { type: "text" },
      created_at: { type: "timestamp", default: pgm.func("now()") },
    });
  
    pgm.createTable("games", {
      game_id: { type: "serial", primaryKey: true },
      user_id: {
        type: "int",
        notNull: true,
        references: "users(user_id)",
        onDelete: "CASCADE",
      },
      rows: { type: "int", notNull: true },
      cols: { type: "int", notNull: true },
      mines: { type: "int", notNull: true },
      status: { type: "text", notNull: true, default: "waiting" },
      // possible values for status could be waiting|play|end_win|end_lose
      started_at: { type: "timestamp" },
      ended_at: { type: "timestamp" },
      diff_level: { type: "text", notNull: true },
      score: { type: "int" },
      created_at: { type: "timestamp", default: pgm.func("now()") },
    });
  
    pgm.createTable("friends", {
      friends_id: { type: "serial", primaryKey: true },
      user_id: {
        type: "int",
        notNull: true,
        references: "users(user_id)",
        onDelete: "CASCADE",
      },
      friend_id: {
        type: "int",
        notNull: true,
        references: "users(user_id)",
        onDelete: "CASCADE",
      },
      created_at: { type: "timestamp", default: pgm.func("now()") },
    });
  
    pgm.createTable("settings", {
      user_id: {
        type: "int",
        primaryKey: true,
        notNull: true,
        references: "users(user_id)",
        onDelete: "CASCADE",
      },
      keybinds: { type: "jsonb", notNull: true, default: "{}" },
      selectors: { type: "jsonb", notNull: true, default: "{}" },
      sliders: { type: "jsonb", notNull: true, default: "{}" },
      checkboxes: { type: "jsonb", notNull: true, default: "{}" },
      updated_at: { type: "timestamp", default: pgm.func("now()") },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("settings");
  pgm.dropTable("friends");
  pgm.dropTable("games");
  pgm.dropTable("users");
};
