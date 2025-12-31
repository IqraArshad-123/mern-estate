import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row gap-2'>
        <div className="p-7 border-b-2 sm:border-r-2 md:min-h-screen">
            <form className='flex flex-col gap-7'>
                <div className="whitespace-nowrap flex items-center gap-3">
            <label className="font-bold">Search Term:</label>
            <input
              type="text"
              placeholder="Search..."  
              id="searchTerm"
              className="border bg-white rounded-lg p-3 w-full"
                     />
                </div>
                <div className="flex flex-wrap items-center gap-3">
            <label className="font-bold">Type:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                className="w-5"
              />
              <span>Sale & Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
            <label className="font-bold">Amenities:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
                </div>
                <div className="flex items-center gap-2">
            <label className="font-bold">Sort:</label>
            <select
              className="border p-2 rounded-lg"
              id="sort_order"
            >
              <option >Price high to low</option>
              <option >Price low to high</option>
              <option >Latest</option>
              <option >Oldest</option>
            </select>
          </div>
          <button
            className="bg-slate-700 p-3
                text-white hover:opacity-85 rounded-lg uppercase"
          >
            Search
          </button>
            </form>
        </div>
        <div className="">
            <h1 className="text-3xl text-slate-800 font-semibold 
           border-b p-3 mt-5">Listing results:</h1>
        </div>
    </div>
  )
}
