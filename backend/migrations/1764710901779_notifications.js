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
    pgm.createTable("notifications", {
        notification_id: { type: "serial", primaryKey: true },
        user_id: {
            type: "int",
            notNull: true,
            references: "users(user_id)",
            onDelete: "CASCADE",
        },
        // type is for requests, invites, game status, etc.
        type: { type: "text", notNull: true, },
        message: { type: "text", notNull: true },
        comes_from_ID: {
            type: "int",
            references: "users(user_id)",
            onDelete: "CASCADE",
        },
        is_read: { type: "boolean", notNull: true, default: false },
        created_at: { type: "timestamp", default: pgm.func("now()") },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("notifications");
};