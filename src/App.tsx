import React, { useEffect, useState } from 'react';

interface Quote {
  _id: string;
  text: string;
  author: string;
  dateAdded: string;
  tags: string[];
  content: string;
}




const Quote: React.FC<{ quote: Quote }> = ({ quote }) => {
  return (
    <div className="mb-4 w-[95%] md:w-[80%] bg-custom-blue rounded-md p-4 shadow-md">
      <p className="text-lg font-bold text-white">{quote.content}</p>
      <p className="text-sm text-white">- {quote.author}</p>
      <p className="text-xs text-white">{quote.dateAdded}</p>
      <div className="flex flex-wrap mt-2">
        {quote.tags.map((tag, index) => (
          <span key={index} className="mr-2 bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">{tag}</span>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quotesPerPage] = useState<number>(5);
  const [loading, setLoading] = useState(false)
  const [quotes, setQuotes] =useState<Quote[]>([]);

  
  const fetchQuotes =async(page: number)=>{
    setLoading(true)
    try{
    let res = await fetch(`https://api.quotable.io/quotes?limit=100`)
    let response = await res?.json()
    
    if(res?.ok){
      const newArray = [...quotes, ...response?.results];
      
      setQuotes(newArray);
      
          
    }
  }
  catch(e){
    
  }
    setLoading(false)
  
  }

  useEffect(()=>{
    
    fetchQuotes(currentPage)
  }, [])

  const handleAuthorFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorFilter(event.target.value);
    setCurrentPage(1); // Reset pagination when filter changes
  };

  const handleDateFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(event.target.value);
    setCurrentPage(1); // Reset pagination when filter changes
  };

  const filteredQuotes = quotes.filter((quote) => {
    return quote.author.toLowerCase().includes(authorFilter.toLowerCase()) &&
      quote.dateAdded.includes(dateFilter);
  });

  const [sortBy, setSortBy] = useState<string>('id'); // Default sort by ID

  const sortedQuotes = filteredQuotes.slice().sort((a, b) => {
    if (sortBy === 'id') {
      return a._id.localeCompare(b._id); // Compare as strings
    } else if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    }
    return 0;
  });

  const handleSortByChange = (value: string) => {
    setSortBy(value);
  };

 

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  console.log("usiis", sortedQuotes)

  return (
    <div className="container mx-auto  flex justify-center flex-col bg-[#03031b] text-white min-h-[100vh]">
      <h1 className="text-3xl font-bold mb-4 text-center mt-8 ">Quote Library</h1>
      <div className="mb-4 grid items-center md:flex justify-center gap-5">
        <input
          type="text"
          placeholder="Filter by author name"
          className="border border-gray-300 px-4 py-2 mr-2 rounded-xl shadow-md focus:outline-none text-black "
          value={authorFilter}
          onChange={handleAuthorFilterChange}
        />
        <input
          type="text"
          placeholder="Filter by date added"
          className="border border-gray-300 px-4 py-2 rounded-xl shadow-md focus:outline-none text-black"
          value={dateFilter}
          onChange={handleDateFilterChange}
        />
      </div>

      <div className="mb-4 flex justify-center gap-5">
        <button
          className={`px-3 py-1 rounded ${sortBy === 'id' ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-800'}`}
          onClick={() => handleSortByChange('id')}
        >
          Sort by ID
        </button>
        <button
          className={`px-3 py-1 rounded ${sortBy === 'author' ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-800'}`}
          onClick={() => handleSortByChange('author')}
        >
          Sort by Author
        </button>
      </div>

      {(sortedQuotes.length > 0 && !loading) &&
      <div className='flex justify-center flex-col w-full items-center'>
        {sortedQuotes.map((quote, index) => (
          <Quote key={index} quote={quote} />
        ))}
      </div>
      
      }

      {(loading && sortedQuotes.length == 0) && 
      <>
        <p className='text-center'>Loading...</p>
      </>
      }

      {sortedQuotes.length <= 0 && !loading &&
      <div className='flex justify-center flex-col w-full items-center'>
        <p className='text-center'>No Qoutes Found</p>
      </div>
      
      }

      
      {/* Pagination and other elements... */}
    </div>  );
};

export default App;
