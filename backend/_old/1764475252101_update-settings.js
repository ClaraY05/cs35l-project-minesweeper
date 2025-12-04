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
    pgm.renameColumn("settings", "selectors", "sound");
    pgm.renameColumn("settings", "sliders", "video");
    pgm.renameColumn("settings", "checkboxes", "notif");
    pgm.dropColumn("settings", "updated_at");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.addColumn("settings", { updated_at: { type: "timestamp", default: pgm.func("now()") } });
    pgm.renameColumn("settings", "sound", "selectors");
    pgm.renameColumn("settings", "video", "sliders");
    pgm.renameColumn("settings", "notif", "checkboxes");
};
