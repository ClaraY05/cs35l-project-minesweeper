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
    pgm.dropColumn("games", "num_revealed");
    pgm.addColumn("games", {
        revealed_cells: { type: 'INTEGER[]', notNull: true, default: '{}' }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.addColumn("games", {
        num_revealed: { type: 'int', notNull: true, default: 0 }
    });
    pgm.dropColumn("games", "revealed_cells");
};
