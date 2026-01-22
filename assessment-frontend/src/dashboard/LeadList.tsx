import LeadRow from './LeadRow';
import type { Lead } from './Dashboard';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function LeadList({ leads }: { leads: Lead[] }) {
	return (
		<div>
			{leads.map((lead) => (
				<Accordion key={lead.id} sx={{ mb: 2 }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography sx={{ flex: 1 }}>{lead.message}</Typography>
						<Typography color="text.secondary">{lead.status}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<LeadRow lead={lead} />
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
}