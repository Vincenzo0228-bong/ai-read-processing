import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLead } from '../api/leads';
import StepTimeline from './StepTimeline';


export default function WorkflowDetail() {
    const { id } = useParams();
    const [lead, setLead] = useState<any>(null);
    console.log(lead);

    useEffect(() => {
        getLead(id!).then(setLead);
    }, [id]);


    if (!lead) return <div>Loading...</div>;


    return (
        <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: 50 }}>
            <div style={{ flex: 1, marginRight: 32 }}>
                <h2>Workflow Output</h2>
                <pre style={{
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                    fontSize: 15,
                    borderRadius: 6,
                    padding: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>{JSON.stringify(lead.final_output, null, 2)}</pre>
            </div>
            <div style={{ flex: 1, minWidth: 550 }}>
                <h2>Timeline</h2>
                <StepTimeline steps={lead.steps}/>
            </div>
        </div>
    );
}