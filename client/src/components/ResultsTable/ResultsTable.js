import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ResultsTable = () => {
  const [results, setResults] = useState([])

  useEffect(() => {
    const getResults = async () => {
      const res = await fetch('/results')
      const data = await res.json()
      setResults(data)
    }
    getResults()
  }, [])

  const handleEdit = (id) => {
    // to={`/edit/${row._id}`}
    console.log(id)
  }

  return results.length ? (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-10 sm:py-20" >
      <h2 className="text-center mt-2 text-3xl font-semi-bold leading-loose text-gray-800">All Results</h2>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <label className="text-sm mb-2 sm:mb-3 mx-3" htmlFor="recordfound">{results.length > 0 ? results.length : 'No'} {results.length > 1 ? 'records' : 'record'} found</label>
              <table className="text-left">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th scope="col" className="relative px-4 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                  </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Score
                  </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                  </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      School Fees
                  </th>
                  </tr>
                </thead>
                <tbody>
                  {results && results.map(row => {
                    return <tr key={row._id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Link onClick={() => handleEdit(row._id)} className="text-indigo-600 hover:text-indigo-900">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </td>
                      <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">{row.name}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap text-right">{row.score}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">{new Date(row.date).toLocaleDateString('en-GB')}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap text-center">
                        <span className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {row.paid ? 'Paid' : 'Not Paid'}
                        </span>
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  ) : (
      <>
        <h2 className="text-center mt-32 text-3xl font-semi-bold leading-loose text-gray-800 sm:text-4xl">No Results Uploaded yet</h2>
      </>
    )
}

export default ResultsTable
