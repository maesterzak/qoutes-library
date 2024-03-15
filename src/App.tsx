import React, { useEffect, useState } from 'react';

interface Quote {
  id: number;
  text: string;
  author: string;
  dateAdded: string;
  tags: string[];
  content: string;
}




const Quote: React.FC<{ quote: Quote }> = ({ quote }) => {
  return (
    <div className="mb-4 w-[] md:w-[80%]">
      <p className="text-lg font-bold">{quote.content}</p>
      <p className="text-sm">- {quote.author}</p>
      <p className="text-xs">{quote.dateAdded}</p>
      <div className="flex flex-wrap">
        {quote.tags.map((tag, index) => (
          <span key={index} className="mr-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">{tag}</span>
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
    let res = await fetch(`https://api.quotable.io/quotes?page=${page}`)
    let response = await res.json()
    console.log("dff", response)
    if(res.ok){
      const newArray = [...quotes, ...response.results];
      setQuotes(newArray);


      // for(){

      // }

      // if(response.page < response.totalPages && quotes.length < 60){
      //   setCurrentPage(currentPage + 1)
      //   fetchQuotes(currentPage)
      // }
      // else{
      //   setLoading(false)
      // }
          
    }
  
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

  // Pagination
  const indexOfLastQuote = currentPage * quotesPerPage;
  const indexOfFirstQuote = indexOfLastQuote - quotesPerPage;
  const currentQuotes = filteredQuotes//.slice(indexOfFirstQuote, indexOfLastQuote);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  console.log("usiis", currentQuotes)

  return (
    <div className="container mx-auto mt-8 flex justify-center flex-col">
      <h1 className="text-3xl font-bold mb-4 text-center">Quote Library</h1>
      <div className="mb-4 flex justify-center gap-5">
        <input
          type="text"
          placeholder="Filter by author name"
          className="border border-gray-300 px-4 py-2 rounded mr-2"
          value={authorFilter}
          onChange={handleAuthorFilterChange}
        />
        <input
          type="text"
          placeholder="Filter by date added"
          className="border border-gray-300 px-4 py-2 rounded"
          value={dateFilter}
          onChange={handleDateFilterChange}
        />
      </div>
      <div className='flex justify-center flex-col w-full  items-center'>
        {currentQuotes.map((quote) => (
          <Quote key={quote.id} quote={quote} />
        ))}
      </div>
      {/* <nav className="mt-4">
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredQuotes.length / quotesPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav> */}
    </div>
  );
};

export default App;
