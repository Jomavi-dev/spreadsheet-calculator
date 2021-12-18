import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as xlsx from 'xlsx';
import { XIcon } from '@heroicons/react/outline'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Import = () => {
  const [dragging, setDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [submitDisabled, setSubmitDisabled] = useState(true)

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

  const handleSubmit = (e) => {
    try {
      e.preventDefault()
      if (!selectedFiles) return

      selectedFiles
        .filter(f => !f.uploaded)
        .forEach(async (f) => {
          const res = await axios.post('/results', f.data, {
            onUploadProgress: (e) => {
              let prg = Math.round(e.loaded * 100 / e.total)
              setSelectedFiles(prevState => {
                const updatedFile = prevState.map((f) => {
                  if (f.data) {
                    f.progress = prg
                    f.uploaded = true
                  }
                  return f
                })
                return (updatedFile)
              })
            }
          })
          console.log(res)
          if (res.status === 200) toast.success(JSON.stringify(res.data.msg))
        })
    } catch (error) {
      toast.error(error, { autoClose: false })
    }
    finally {
      setSubmitDisabled(true)
      // setSelectedFiles([])
    }
  }

  const handleDelete = (id) => {
    setSelectedFiles(selectedFiles.filter(file => file.id !== id))
  }

  const upload = (e, file) => {
    if (file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type.includes('application/vnd.ms-excel') || file.type.includes('.csv')) {
      if (typeof (FileReader) !== 'undefined') {
        setSelectedFiles(prevFiles => ([...prevFiles, {
          id: prevFiles.length + 1,
          file,
          src: preview(file),
          progress: 0
        }]))
        setSubmitDisabled(false)
        var reader = new FileReader();
        reader.onload = function (e) {
          let data = e.target.result;
          let wb = xlsx.read(data, { type: 'binary', dateNF: 'mm/dd/yyyy' });
          const wsName = wb.SheetNames[0];
          const ws = wb.Sheets[wsName];
          const rawData = xlsx.utils.sheet_to_json(ws, { raw: false })
          // let parsedData2 = xlsx.utils.sheet_to_json(ws, { header: 1 })
          const parsedData = rawData.map(data => {
            if (data.paid === 'TRUE') data.paid = true
            if (data.paid === 'FALSE') data.paid = false
            return data
          })
          // setData(prevFilez => ([...prevFilez, parsedData]))

          setSelectedFiles(prevState => {
            const updatedFile = prevState.map((f) => {
              if (f.file === file) {
                f.data = parsedData
              }
              return f
            })
            return (updatedFile)
          })
        }
        reader.readAsBinaryString(file)
      } else { alert('This browser does not support HTML5 !') }
    }
    // else if (file.type.startsWith('image/')) {}
    else { alert('Only .xlsx and .csv files allowed !') }
  }

  return (
    <div className="py-12 px-3 md:px-0">
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
            <button type="submit" className="bg-green-400 px-4 h-9 mt-4 inline-flex items-center rounded cursor-pointer border border-gray-300 text-sm font-medium text-white shadow-sm focus-within:ring-2 focus-within:ring-green-300 focus-within:ring-offset-2" disabled={submitDisabled}>Submit</button>
          </form>
        </div>

        <ul className="my-6 bg-white rounded divide-y divide-gray-200 shadow">
          {selectedFiles && selectedFiles.reverse().map(({ id, progress, file: { name } }) => {
            return (
              <li key={id} className="px-3 py-1 flex items-center">
                <div className="text-xs text-gray-600 max-w-xs">{name}</div>
                <div className='ml-auto cursor-pointer rounded-full p-3 text-red-300 hover:bg-gray-100 hover:text-black' onClick={(e) => handleDelete(id)}>
                  <XIcon className={!progress ? 'block h-5 w-5' : 'hidden'} aria-hidden="true" />
                </div>
                <div className={progress ? 'ml-auto w-40 bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden relative flex items-center justify-center' : 'hidden'}>
                  <div className="inline-block h-full bg-indigo-600 absolute top-0 left-0" style={{ width: `${progress}%` }}></div>
                  <div className="relative z-10 text-xs font-semibold text-center text-white drop-shadow text-shadow">{progress}%</div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default React.memo(Import)
