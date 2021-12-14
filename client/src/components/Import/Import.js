import React, { useState, useEffect } from 'react'
import * as xlsx from 'xlsx';

const Import = () => {
  const [dragging, setDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [data, setData] = useState([])
  const [cols, setCols] = useState([])

  useEffect(() => {
    const offBrowserDefaults = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    window.addEventListener("dragover", offBrowserDefaults)
    window.addEventListener("drop", offBrowserDefaults)

    return () => {
      window.removeEventListener('dragover', offBrowserDefaults);
      window.removeEventListener('drop', offBrowserDefaults)
    }
  }, [])

  const handleDrop = (e) => {
    setDragging(false)

    const { files, items } = e.dataTransfer;

    if (items) {
      let files = [...items]
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile())
      files.forEach(file => upload(e, file))
    } else {
      // Use DataTransfer interface to access the file(s)
      if (files) {
        for (let i = 0; i < files.length; i++) {
          upload(e, files[i])
        }
      }
    }
  }

  const handlePickedFile = (e) => {
    const { files } = e.target
    const fileArray = [...files]
    fileArray.forEach(file => upload(e, file))
  }

  const preview = (file) => {
    let src = ''
    if (file.type.startsWith('image/')) src = URL.createObjectURL(file)
    return src
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFiles) return

    console.log('files submitted >>>', data)
    const res = await fetch('/api/upload', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const dataRes = await res.json()
    console.log('Response >>>', dataRes)
    setSelectedFiles([])
    setData([])
  }

  const upload = (e, file) => {
    if (file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type.includes('application/vnd.ms-excel') || file.type.includes('.csv')) {
      if (typeof (FileReader) !== 'undefined') {
        setSelectedFiles(prevFiles => ([...prevFiles, {
          id: prevFiles.length + 1,
          file,
          src: preview(file),
          progress: 100
        }]))

        var reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          let wb = xlsx.read(data, { type: 'binary', dateNF: 'mm/dd/yyyy' });
          const wsName = wb.SheetNames[0];
          const ws = wb.Sheets[wsName];
          const parsedData = xlsx.utils.sheet_to_json(ws, { raw: false })
          let parsedData2 = xlsx.utils.sheet_to_json(ws, { header: 1 })
          setData(prevFilez => ([...prevFilez, parsedData]))
          setCols(parsedData2[0])
        };
        reader.readAsBinaryString(file)
      } else { alert('This browser does not support HTML5 !') }
    }
    // else if (file.type.startsWith('image/')) {}
    else { alert('Only .xlsx and .csv files allowed !') }
  }

  console.log('selectedFiles >>', selectedFiles)
  return (
    <div className={`py-12 px-3 md:px-0`}>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div id="drop zone" className={`flex flex-col px-6 py-12 items-center border-2 border-dashed border-gray-400 rounded-md  ${dragging ? ' border-indigo-500 bg-gray-100' : ' border-gray-400'}`}
          onDragOver={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <p className="text-xl text-gray-700">Drop file to upload</p>
          <p className="mb-2 text-gray-700">or</p>
          <form onSubmit={handleSubmit} className="text-center">
            <label className="bg-white px-4 h-9 inline-flex items-center rounded cursor-pointer border border-gray-300 shadow-sm text-sm font-medium text-gray-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 ">
              Select File
            <input type="file" name="file" onChange={handlePickedFile} className="sr-only" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple />
            </label>
            <p className="text-xs text-gray-600 mt-4">.XLSX and .CSV files only</p>
            <p className="text-xs text-gray-600 mt-1">Maximum upload file size: 50MB</p>
            <button type="submit" className="bg-green-400 px-4 h-9 mt-4 inline-flex items-center rounded cursor-pointer border border-gray-300 text-sm font-medium text-white focus-within:ring-2 focus-within:ring-green-300 focus-within:ring-offset-2 ">Submit</button>
          </form>
        </div>

        <ul className="my-6 bg-white rounded divide-y divide-gray-200 shadow">
          {selectedFiles && selectedFiles.reverse().map(({ id, progress, file: { name } }) => {
            return (
              <li key={id} className="p-3 flex items-center">
                <div className="text-sm text-gray-600 max-w-xs">{name}</div>
                <div className="ml-auto w-40 bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden relative flex items-center justify-center">
                  <div className="inline-block h-full bg-indigo-600 absolute top-0 left-0" style={{ width: `${progress}%` }}></div>
                  <div className="relative z-10 text-xs font-semibold text-center text-white drop-shadow text-shadow">{progress}%</div>
                </div>
              </li>
            )
          })}
        </ul>

        {data && (
          <table className="table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
                {cols.map(col => {
                  return <th
                    scope="col"
                  >
                    {col}
                  </th>
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data && data.map(rows => rows.map(row => {
                return <tr key={row.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="!#" className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </a>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.score}</td>
                  <td>{row.date}</td>
                  <td>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.paidFees === 'TRUE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {row.paidFees === 'TRUE' ? 'Paid' : 'Not Paid'}
                    </span>
                  </td>
                </tr>
              }))}
            </tbody>
          </table>
        )}
      </div>
    </div >
  )
}

export default React.memo(Import)
