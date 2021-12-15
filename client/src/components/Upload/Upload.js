import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Upload = () => {
  const [dragging, setDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [media, setMedia] = useState([])
  const submitRef = useRef(null)

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
      files.forEach(file => {
        media.unshift({
          file,
          src: preview(file),
          progress: 0
        })
      })
    } else {
      // Use DataTransfer interface to access the file(s)
      if (files) {
        for (let i = 0; i < files.length; i++) {
          setSelectedFiles([...selectedFiles, { file: files[i], src: preview(files[i]) }])
        }
      }
    }
  }

  const handlePickedFile = (e) => {
    const { files } = e.target
    const file = files[0]
    setSelectedFiles([...selectedFiles, { file, src: preview(file) }])
  }

  const preview = (file) => {
    let src = ''
    if (file.type.startsWith('image/')) src = URL.createObjectURL(file)
    return src
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!media) return
    upload()
  }

  const upload = () => {
    try {
      // const fr = new FileReader()
      // fr.readAsDataURL(file)
      // fr.onloadend = () => {
      //   setFileData(fr.result)
      // }

      const newData = media.map((med) => {
        let formData = new FormData()
        formData.append('file', med.file)
        axios.post('/results', formData, {
          onUploadProgress: (e) => {
            med.progress = Math.round(e.loaded * 100 / e.total)
          },
        })
        return med
      })
      setMedia([...newData])
      console.log('media', media)
      submitRef.current.click()


      // const res = await fetch('/results', {
      //   method: "post",
      //   body: JSON.stringify(selectedFiles),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await res.json()
      // console.log(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={`py-12 px-3 md:px-0 ${dragging && 'h-screen bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div id="drop zone" className={`flex flex-col px-6 py-12 items-center border-2 border-dashed border-gray-400 rounded-md  ${dragging ? ' border-indigo-500 bg-white' : ' border-gray-400'}`}
          onDragOver={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <p className="text-xl text-gray-700">Drop file to upload</p>
          <p className="mb-2 text-gray-700">or</p>
          <form onSubmit={handleSubmit} className="text-center">
            <label className="bg-white px-4 h-9 inline-flex items-center rounded cursor-pointer border border-gray-300 shadow-sm text-sm font-medium text-gray-700">
              Select File
            <input type="file" name="file" onChange={(e) => handlePickedFile(e)} className="sr-only" multiple />
            </label>
            <p className="text-xs text-gray-600 mt-4">Maximum upload file size: 512MB.</p>
            <button ref={submitRef} type="submit" className="bg-green-400 px-4 h-9 mt-5 inline-flex items-center rounded cursor-pointer border border-gray-300 shadow-sm text-sm font-medium text-gray-700">Submit</button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mt-3.5 md:mt-5 mx-auto sm:px-6 lg:px-8 flex flex-wrap">
        {selectedFiles && selectedFiles.map(({ file: { name }, src }) => {
          return (
            <div key={src} className="flex-col mt-5 mr-20 md:text-center">
              {src && <img src={src} alt="preview" className="h-20 md:h-24 rounded" />}
              <p className={`text-xs text-gray-600 max-w-xs ${src && 'mt-3'}`}>{name}</p>
            </div>
          )
        })}
      </div>

      <ul className="my-6 bg-white rounded divide-y divide-gray-200 shadow">
        {media && media.map(item => {
          return (
            <li key={item.src} className="p-3 flex items-center justify-between">
              {/* <img src={item.src} alt="preview" className="h-20 md:h-24 rounded" /> */}
              <div className="text-sm text-gray-700">{item.file.name}</div>
              <div className="w-40 bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden relative flex items-center justify-center">
                <div className="inline-block h-full bg-indigo-600 absolute top-0 left-0" style={{ width: `${item.progress}%` }}></div>
                <div className="relative z-10 text-xs font-semibold text-center text-white drop-shadow text-shadow">{item.progress}%</div>
              </div>
            </li>
          )
        })}
      </ul>
    </div >
  )
}

export default Upload
