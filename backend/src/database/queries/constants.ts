const MENU_RECURSIVE = (limit=false) =>  `WITH RECURSIVE descendants AS (
   SELECT id, name, parentId, formId, 0 as level
   FROM menu
   WHERE id = :id
UNION ALL
   SELECT menu.id, menu.name, descendants.id, descendants.formId, descendants.level + 1
   FROM menu
      JOIN descendants ON menu.parentId = descendants.id ${limit ? "&& descendants.level < :limit" : ""}
)`;

export default {
    MENU_RECURSIVE_DESCENDANT_NO_LIMIT: `
    ${MENU_RECURSIVE()}
    SELECT * FROM descendants;`,
    MENU_RECURSIVE_DESCENDANT_LIMIT: `
    ${MENU_RECURSIVE(true)}
    SELECT * FROM descendants;`
}