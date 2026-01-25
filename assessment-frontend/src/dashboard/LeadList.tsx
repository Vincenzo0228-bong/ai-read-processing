import * as React from 'react';
import type { Lead } from './Dashboard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Chip, Input } from '@mui/material';
import { Link } from 'react-router-dom';

interface Column {
  id: 'name' | 'message' | 'contactChannel' | 'status';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'message', label: 'Message', minWidth: 800 },
  {
    id: 'contactChannel',
    label: 'Contact Channel',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'status',
    label: 'Step Status',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];


export default function LeadList({ leads }: { leads: Lead[] }) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	// Add search state for each column
	const [search, setSearch] = React.useState<{ [key: string]: string }>({});

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	// Handle search input change
	const handleSearchChange = (columnId: string, value: string) => {
		setSearch((prev) => ({ ...prev, [columnId]: value }));
		setPage(0);
	};

	const statusColor: Record<string, "default" | "success" | "error" | "warning" | "info"> = {
		pending: "warning",
		processing: "info",
		completed: "success",
		failed: "error",
	};

	function ColumeVal({ col_value, value, id }: { col_value: string; value: string; id: string }) {
		if (col_value === "message") {
			return <Link to={`/leads/${id}`}>{value}</Link>;
		} else if (col_value === "status") {
			return <Chip label={value} color={statusColor[value] || "default"} sx={{ ml: 1 }} />;
		} else {
			return <>{value}</>;
		}
	}

		// Filter leads based on search values
		const filteredLeads = leads.filter((lead) =>
			columns.every((column) => {
				const searchValue = search[column.id] || '';
				if (!searchValue) return true;
				const leadValue = String(lead[column.id] ?? '').toLowerCase();
				return leadValue.includes(searchValue.toLowerCase());
			})
		);

		return (
			<div>
				<TableContainer sx={{marginTop:6}}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '16px' }}
									>
										{column.label}
										<div>
											<Input
												type="text"
												placeholder={`Search ${column.label}`}
												value={search[column.id] || ''}
												onChange={(e) => handleSearchChange(column.id, e.target.value)}
												style={{ width: '90%', marginTop: 4, padding: 2 }}
											/>
										</div>
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredLeads
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((lead) => (
									<TableRow hover role="checkbox" tabIndex={-1} key={lead.id}>
										{columns.map((column) => {
											const value = lead[column.id];
											return (
												<TableCell key={column.id} align={column.align}>
													<ColumeVal col_value={column.id} value={value} id={lead.id} />
												</TableCell>
											);
										})}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={filteredLeads.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</div>
		);
}