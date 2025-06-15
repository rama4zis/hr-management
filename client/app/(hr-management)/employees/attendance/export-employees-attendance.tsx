import * as ExcelJS from 'exceljs'

export default function ExportEmployeesAttendance(data: any[] = []) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Attendance')

    const headerRow = worksheet.addRow(['Employee Name', 'Date', 'Clock In', 'Clock Out', 'Total Hours', 'Status'])
    headerRow.eachCell((cell) => {
        cell.font = { bold: true }
    })
    data.forEach((row) => {
        worksheet.addRow([
            row.employeeName,
            row.date,
            row.clockIn,
            row.clockOut,
            row.totalHours,
            row.status
        ])
    })

    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'attendance_report.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
    })
    
}