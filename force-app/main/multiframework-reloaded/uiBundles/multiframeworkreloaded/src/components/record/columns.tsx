import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<any>[] = [
    {
      header: 'Field Name',
      accessorKey: 'fieldName',
    },
    {
      header: 'Field Value',
      accessorKey: 'displayValue',
    },
  ]