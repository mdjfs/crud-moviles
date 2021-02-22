

export default {
   MENU_RECURSIVE: (tableName, limit=false) => `WITH RECURSIVE descendants AS (
      SELECT id, name, parentId, formId, 0 as level
      FROM ${tableName}
      WHERE id = :id
   UNION ALL
      SELECT ${tableName}.id, ${tableName}.name, descendants.id, descendants.formId, descendants.level + 1
      FROM ${tableName}
         JOIN descendants ON ${tableName}.parentId = descendants.id ${limit ? "&& descendants.level < :limit" : ""}
   )
   SELECT * FROM descendants`
}