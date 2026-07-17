import { createDataSDK } from '@salesforce/platform-sdk/data';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { DataTable } from '@/components/record/data-table';
import { columns } from '@/components/record/columns';

// fieldName.displayValue
type RecordData = {
  fieldName: string;
  displayValue: string;
}
async function getRecord(recordId: string | undefined) {
  if (!recordId) return;
  const sdk = await createDataSDK();
  const res = await sdk.fetch?.(
    `/services/data/v67.0/ui-api/record-ui/${recordId}?layoutTypes=Full&modes=View`
  );
  if (!res?.ok) {
    throw new Error(`record-ui failed: ${res?.status} ${await res?.text()}`);
  }
  return res.json();
}
export default function Record() {
  const { id } = useParams();
  if (!id) return <div>No record ID</div>;
  const [recordData, setRecordData] = useState<RecordData[]>([]);
  const [recordName, setRecordName] = useState<string>('');
  const [objectName, setObjectName] = useState<string>('');
  useEffect(() => {
    getRecord(id).then(record => {
      console.log(record);
      setObjectName(record.records[id]?.apiName ?? '');
      setRecordName(record.records[id]?.fields?.Name?.value ?? '');
      const fields = Object.entries(record.records[id].fields).map(
        ([fieldName, field]: [string, any]) => ({
          fieldName,
          displayValue: field.displayValue ?? field.value ?? ''
        })
      );
      setRecordData(fields);
    });
  }, [id]);
  console.log(recordData);

  return <div className="container mx-auto p-10"><h1 className='text-2xl font-bold'>{objectName}({id}  / {recordName})</h1>
  {!recordData ? <div>Loading...</div> : (
    <DataTable columns={columns} data={recordData} />
  )}
  </div>;
}

