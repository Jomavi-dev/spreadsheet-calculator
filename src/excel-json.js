const xlsx = require('xlsx')

// const workbook = xlsx.readFile('./data.xlsx')
// const workbook = xlsx.readFile('./data.xlsx', { cellDates: true })
const workbook = xlsx.readFile('./uploaded-files/data.xlsx', { dateNF: 'mm/dd/yyyy' })
// console.log(workbook.SheetNames);

const worksheet = workbook.Sheets['Sheet1']
// console.log(worksheet)

// const data = xlsx.utils.sheet_to_json(worksheet)
const data = xlsx.utils.sheet_to_json(worksheet, { raw: false })
// console.log(data);

const newData = data.map(data => {
  if (data.paidFees === 'TRUE') data.paidFees = true
  if (data.paidFees === 'FALSE') data.paidFees = false
  return data
})

console.log(newData);


let dataForExorting = [
  { name: 'Amy', score: '74', date: '3/11/21', paidFees: false },
  { name: 'Mavi', score: '85', date: '3/12/21', paidFees: true }
]

let newExcelWorkbook = xlsx.utils.book_new()
let newExcelWorksheet = xlsx.utils.json_to_sheet(dataForExorting)
xlsx.utils.book_append_sheet(newExcelWorkbook, newExcelWorksheet, 'New data')

try {
  // xlsx.writeFile(newExcelWorkbook, `exported_${new Date().getTime()}.xlsx`)
  // console.log(`--- Exporting data to exported_${new Date().getTime()}.xlsx ----`)
} catch (error) {
  console.error(error.msg)
}

