

export default {
   MENU_RECURSIVE_MYSQL: (limit=false) => `WITH RECURSIVE descendants AS (
      SELECT id, name, menu.\`parentId\` , menu.\`formId\` ,0 as level
      FROM menu
      WHERE id = :id
   UNION ALL
      SELECT menu.id, menu.name, descendants.id, menu.\`formId\` , descendants.level + 1
      FROM menu
         JOIN descendants ON menu.\`parentId\` = descendants.id ${limit ? "and descendants.level < :limit" : ""}
   )
   SELECT * FROM descendants`,
   MENU_RECURSIVE_POSTGRESQL: (limit=false) => `WITH RECURSIVE descendants AS (
      SELECT id, name, menu."parentId", menu."formId"  ,0 as level
      FROM menu
      WHERE id = :id
   UNION ALL
      SELECT menu.id, menu.name, descendants.id, menu."formId" , descendants.level + 1
      FROM menu
         JOIN descendants ON  menu."parentId" = descendants.id ${limit ? "and descendants.level < :limit" : ""}
   )
   SELECT * FROM descendants`
}