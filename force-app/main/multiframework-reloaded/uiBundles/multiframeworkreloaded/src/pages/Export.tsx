import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/export/data-table";
import {
  createColumns,
  type ExportRecord,
} from "@/components/export/columns";
import {
  downloadCsv,
  downloadExcel,
  getFieldNames,
} from "@/lib/download-records";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, FileSpreadsheet, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { createDataSDK } from '@salesforce/platform-sdk';

export default function Export() {
  const handleExport = async () => {
    setLoading(true);
    runSOQLQuery(query).then( result => {
      console.log(result);
      setTotalSize(result.totalSize);
      setRecords(result.records);
    }).catch(err => {
      console.error(err)
    }).finally(() => {
      setLoading(false);
    });
  };
  const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };
  const [loading, setLoading] = useState(false);
  const [totalSize, setTotalSize] = useState();
  const [records, setRecords] = useState<ExportRecord[]>([]);
  const [query, setQuery] = useState('');
  const [downloadOpen, setDownloadOpen] = useState(false);
  const fieldNames = useMemo(() => getFieldNames(records), [records]);
  const columns = useMemo(() => createColumns(fieldNames), [fieldNames]);

  return (
    <div className="px-10">
      <h1 className="text-3xl my-1">Export</h1>
      <Textarea value={query} onChange={handleQueryChange} />
      <Button className="mt-4" onClick={handleExport} type="submit" disabled={loading}>Export</Button>
      
      <div className="mt-4">
        {records.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p>Total Size: {totalSize}</p>
              <Popover open={downloadOpen} onOpenChange={setDownloadOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={downloadOpen}
                  >
                    Download
                    <ChevronDown className="ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0" align="end">
                  <Command>
                    <CommandList>
                      <CommandGroup heading="Download as">
                        <CommandItem
                          value="csv"
                          onSelect={() => {
                            downloadCsv(records, fieldNames);
                            setDownloadOpen(false);
                          }}
                        >
                          <FileText />
                          CSV file
                        </CommandItem>
                        <CommandItem
                          value="excel"
                          onSelect={() => {
                            void downloadExcel(records, fieldNames);
                            setDownloadOpen(false);
                          }}
                        >
                          <FileSpreadsheet />
                          Excel workbook
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <DataTable columns={columns} data={records} />
          </>
        )}
      </div>
    </div>
  );
}

async function runSOQLQuery(query: string) {
  const sdk = await createDataSDK();
  const response = await sdk.fetch?.('/services/apexrest/soql-export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if(!response?.ok) {
    throw new Error(`Failed to run SOQL query: ${response?.statusText}`);
  }
  return await response?.json();
}
