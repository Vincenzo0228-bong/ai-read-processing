import { Link } from 'react-router-dom';
import { Box, Typography, Chip, Divider } from '@mui/material';
import type { Lead } from './Dashboard';

const statusColor: Record<string, "default" | "success" | "error" | "warning" | "info"> = {
    pending: "warning",
    processing: "info",
    completed: "success",
    failed: "error",
};

export default function LeadRow({ lead }: { lead: Lead }) {
    return (
        <Box>
            <Typography variant="subtitle1">
                <Link to={`/leads/${lead.id}`}>{lead.message}</Link>
            </Typography>
            <Chip label={lead.status} color={statusColor[lead.status] || "default"} sx={{ ml: 1 }} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">Contact Channel: {lead.contactChannel || lead.contact_channel}</Typography>
            <Typography variant="body2">Name: {lead.name}</Typography>
            {/* Optionally show workflow steps summary here if available */}
            {lead.steps && lead.steps.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">Workflow Steps:</Typography>
                    {lead.steps.map((step) => (
                        <Chip key={step.name} label={`${step.name}: ${step.status}`} color={statusColor[step.status] || "default"} sx={{ mr: 1, mb: 1 }} />
                    ))}
                </Box>
            )}
        </Box>
    );
}