import type { ExportRecord } from "@/components/export/columns";

export function getFieldNames(records: ExportRecord[]): string[] {
  return Array.from(
    new Set(
      records.flatMap((record) =>
        Object.keys(record).filter((key) => key !== "attributes")
      )
    )
  );
}

function formatCellValue(value: unknown): string | number | boolean {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return JSON.stringify(value);
}

function toRows(records: ExportRecord[], fieldNames: string[]) {
  return records.map((record) =>
    Object.fromEntries(
      fieldNames.map((field) => [field, formatCellValue(record[field])])
    )
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: string | number | boolean): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function downloadCsv(
  records: ExportRecord[],
  fieldNames: string[],
  filename = `export-${Date.now()}.csv`
) {
  const header = fieldNames.map(escapeCsvValue).join(",");
  const lines = records.map((record) =>
    fieldNames
      .map((field) => escapeCsvValue(formatCellValue(record[field])))
      .join(",")
  );
  const csv = [header, ...lines].join("\r\n");
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
}

export async function downloadExcel(
  records: ExportRecord[],
  fieldNames: string[],
  filename = `export-${Date.now()}.xlsx`
) {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(toRows(records, fieldNames), {
    header: fieldNames,
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  triggerDownload(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename
  );
}
