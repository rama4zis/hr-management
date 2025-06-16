import * as ExcelJS from 'exceljs';

export default function ExportEmployeesLeaveRequest(data: any[] = []) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leave Requests');

    const headerRow = worksheet.addRow(['Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Status']);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true };
    });

    data.forEach((row) => {
        worksheet.addRow([
            row.employeeName,
            row.leaveType,
            row.startDate,
            row.endDate,
            row.status
        ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leave_requests_report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    });

    console.log('Exported leave requests to Excel successfully.');
    console.log(JSON.stringify(data, null, 2)); // Log the data for debugging

}