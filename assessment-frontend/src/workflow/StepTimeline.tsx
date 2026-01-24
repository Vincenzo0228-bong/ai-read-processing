
import { Typography, Chip } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Check from '@mui/icons-material/Check';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayArrow from '@mui/icons-material/PlayArrow';
import BlockIcon from '@mui/icons-material/Block';
import type { JSX } from '@emotion/react/jsx-dev-runtime';


const statusColor: Record<string, "default" | "success" | "error" | "warning" | "info"> = {
    not_started: "default",
    processing: "info",
    completed: "success",
    failed: "error",
    skipped: "warning",
};

const statusDotColor: Record<string, "primary" | "success" | "error" | "warning" | "info" | "grey"> = {
    not_started: "grey",
    processing: "info",
    completed: "success",
    failed: "error",
    skipped: "warning",
};

const statusIcon: Record<string, JSX.Element> = {
    not_started: <HourglassEmptyIcon color="disabled" />,
    processing: <PlayArrow color="inherit" />,
    completed: <Check color="inherit" />,
    failed: <PriorityHigh color="inherit" />,
    skipped: <BlockIcon color="inherit" />,
};

export default function StepTimeline({ steps }: { steps: { stepType: string; status: string; error?: string; handleTime?: string }[] }) {
    if (!steps || steps.length === 0) return <Typography>No steps available.</Typography>;
    return (
        <Timeline position="alternate" sx={{ my: 2, fontSize: 16 }}>
            {steps.map((step, idx) => (
                <TimelineItem key={step.stepType || idx}>
                    {/* Left: Step Name */}
                    <TimelineOppositeContent align="left" sx={{ m: 'auto 0', minWidth: 120 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 16}}>{`${idx + 1}. ${step.stepType}`}</Typography>
                    </TimelineOppositeContent>
                    {/* Center: Status Icon */}
                    <TimelineSeparator>
                        <TimelineDot color={statusDotColor[step.status] || 'grey'}>
                            {statusIcon[step.status]}
                        </TimelineDot>
                        {idx < steps.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    {/* Right: Handle Time and Status */}
                    <TimelineContent sx={{ minWidth: 160 }}>
                        <Chip label={step.status} color={statusColor[step.status] || 'default'} size="small" sx={{ mt: 1.5 }} />
                        {step.handleTime && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {step.handleTime}
                            </Typography>
                        )}
                        {/* {step.error && (
                            <Typography color="error" variant="body2">Error: {step.error}</Typography>
                        )} */}
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}