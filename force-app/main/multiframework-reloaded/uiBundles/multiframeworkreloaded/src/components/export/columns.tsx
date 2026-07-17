import type { ColumnDef } from "@tanstack/react-table"

export type ExportRecord = Record<string, unknown>

export function createColumns(
  fieldNames: string[]
): ColumnDef<ExportRecord>[] {
  return fieldNames.map((fieldName) => ({
      id: fieldName,
      accessorFn: record => record[fieldName],
      header: fieldName,
      cell: ({ getValue }) => {
        const value = getValue()

        if (value == null) return ""
        if (typeof value === "object") {
          return JSON.stringify(value)
        }

        return String(value)
      },
    }))
}