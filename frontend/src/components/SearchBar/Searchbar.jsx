import { IoSearch } from "react-icons/io5";

const SearchBar = () =>{
    return(
        <div className="searchBar position-relative d-flex align-items-center" >
            <IoSearch className="mr-2"/>
            <input type="text" placeholder="Search here.." />
        </div>
    )

}

export default SearchBar;


// import { useState } from "react"
// import { IoSearch } from "react-icons/io5"

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSearch = (e) => {
//     e.preventDefault()
//     // Handle search logic here
//     console.log("Searching for:", searchTerm)
//   }

//   return (
//     <form onSubmit={handleSearch} className="searchBar d-flex align-items-center">
//       <IoSearch />
//       <input
//         type="text"
//         className="form-control border-0 bg-transparent"
//         placeholder="Search..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//     </form>
//   )
// }

// export default SearchBar
