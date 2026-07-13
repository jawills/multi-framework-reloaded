import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createDataSDK } from '@salesforce/platform-sdk/data';

export default function Export() {
  const handleExport = async () => {
    console.log('Exporting data...');
    console.log(data);
    console.log('run result')
    const result = await runSOQLQuery(data);
    console.log(result);
  };
  const handleDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(event.target.value);
  };
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <h1>Export</h1>
      <p>Export your data to a file.</p>
      <Textarea value={data} onChange={handleDataChange} />
      <Button onClick={handleExport} type="submit" disabled={loading}>Export</Button>
    </div>
  );
}

async function runSOQLQuery(query: string) {
  const sdk = await createDataSDK();
  const url = `/services/data/v66.0/query/?q=${encodeURIComponent(query)}`;
  const result = await sdk.fetch?.(url);
  console.log('result', await result);
  if(!result?.ok) {
    throw new Error(`Failed to run SOQL query: ${result?.statusText}`);
  }
  return await result?.text();
}