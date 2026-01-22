import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLead } from '../api/leads';
import StepTimeline from './StepTimeline';


export default function WorkflowDetail() {
    const { id } = useParams();
    const [lead, setLead] = useState<any>(null);


    useEffect(() => {
        getLead(id!).then(setLead);
    }, [id]);


    if (!lead) return <div>Loading...</div>;


    return (
        <div>
            <h2>Workflow</h2>
            <StepTimeline steps={lead.steps} />
            <pre>{JSON.stringify(lead.final_output, null, 2)}</pre>
        </div>
    );
}